import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  async getEventAnalytics(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        sessions: {
          include: {
            interactions: true
          }
        },
        participants: true
      }
    });

    if (!event) throw new Error('Event not found');

    const analytics = {
      totalParticipants: event.participants.length,
      sessions: event.sessions.map((session: any) => ({
        id: session.id,
        name: session.name,
        interactionCount: session.interactions.length,
        uniqueParticipants: new Set(session.interactions.map((i: {userId: string}) => i.userId)).size,
        averageSentiment: this.calculateAverageSentiment(session.interactions)
      })),
      overallEngagement: this.calculateOverallEngagement(event)
    };

    return analytics;
  }

  async getSentimentAnalytics(eventId: string) {
    const interactions = await prisma.interaction.findMany({
      where: {
        session: {
          eventId
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const sentimentTrend = this.calculateSentimentTrend(interactions);
    return sentimentTrend;
  }

  async getEngagementMetrics(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        sessions: {
          include: {
            interactions: true
          }
        },
        participants: true
      }
    });

    if (!event) throw new Error('Event not found');

    return {
      participantEngagement: this.calculateParticipantEngagement(event),
      sessionEngagement: this.calculateSessionEngagement(event.sessions),
      peakTimes: this.findPeakEngagementTimes(event.sessions)
    };
  }

  private calculateAverageSentiment(interactions: any[]) {
    const sentiments = interactions
      .filter(i => i.sentiment !== null)
      .map(i => i.sentiment);
    return sentiments.length > 0
      ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length
      : 0;
  }

  private calculateOverallEngagement(event: any) {
    // Implementation of engagement calculation algorithm
    const totalInteractions = event.sessions.reduce(
      (sum: number, session: any) => sum + session.interactions.length,
      0
    );
    const totalDuration = Math.abs(event.endDate.getTime() - event.startDate.getTime());
    const participantCount = event.participants.length;

    return (totalInteractions / (totalDuration / 3600000)) / participantCount;
  }

  private calculateSentimentTrend(interactions: any[]) {
    const timeWindows = new Map();
    const windowSize = 5 * 60 * 1000; // 5 minutes in milliseconds

    interactions.forEach(interaction => {
      const timestamp = Math.floor(interaction.createdAt.getTime() / windowSize) * windowSize;
      if (!timeWindows.has(timestamp)) {
        timeWindows.set(timestamp, []);
      }
      timeWindows.get(timestamp).push(interaction.sentiment);
    });

    return Array.from(timeWindows.entries()).map(([timestamp, sentiments]) => ({
      timestamp: new Date(timestamp),
      averageSentiment: sentiments.reduce((a: number, b: number) => a + b, 0) / sentiments.length
    }));
  }

  private calculateParticipantEngagement(event: any) {
    const participantStats = new Map();

    event.sessions.forEach((session: any) => {
      session.interactions.forEach((interaction: any) => {
        if (!participantStats.has(interaction.userId)) {
          participantStats.set(interaction.userId, {
            interactionCount: 0,
            lastInteraction: null,
            totalSentiment: 0,
            sentimentCount: 0
          });
        }

        const stats = participantStats.get(interaction.userId);
        stats.interactionCount++;
        stats.lastInteraction = interaction.createdAt;
        if (interaction.sentiment !== null) {
          stats.totalSentiment += interaction.sentiment;
          stats.sentimentCount++;
        }
      });
    });

    return Array.from(participantStats.entries()).map(([userId, stats]) => ({
      userId,
      interactionCount: stats.interactionCount,
      lastInteraction: stats.lastInteraction,
      averageSentiment: stats.sentimentCount > 0 ? stats.totalSentiment / stats.sentimentCount : null
    }));
  }

  private findPeakEngagementTimes(sessions: any[]) {
    const interactionCounts = new Map();
    const timeWindow = 15 * 60 * 1000; // 15 minutes

    sessions.forEach(session => {
      session.interactions.forEach((interaction: any) => {
        const timeSlot = Math.floor(interaction.createdAt.getTime() / timeWindow) * timeWindow;
        interactionCounts.set(timeSlot, (interactionCounts.get(timeSlot) || 0) + 1);
      });
    });

    return Array.from(interactionCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([timestamp, count]) => ({
        timestamp: new Date(timestamp),
        interactionCount: count
      }));
  }

  private calculateSessionEngagement(sessions: any[]) {
    // Implementation of session engagement calculation
    // TODO: Add actual logic
    return sessions.map(session => ({
      sessionId: session.id,
      engagementScore: 0 // Replace with actual calculation
    }));
  }
}