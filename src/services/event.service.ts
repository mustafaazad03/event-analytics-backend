import { PrismaClient } from '@prisma/client';
import { sendEventNotification, sendUserNotification } from './notification.service';

const prisma = new PrismaClient();

export async function createEventService(data: any) {
  const event = await prisma.event.create({
    data: {
      name: data.name,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      type: data.type,
      capacity: data.capacity,
      organizerId: data.organizerId
    }
  });

  // Create default session
  await prisma.session.create({
    data: {
      name: 'Main Session',
      startTime: new Date(data.startDate),
      endTime: new Date(data.endDate),
      eventId: event.id
    }
  });

  return event;
}

export async function getEventService(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          interactions: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
}

export async function getEventsService(userId: string) {
  return prisma.event.findMany({
    where: { organizerId: userId },
    include: {
      sessions: true,
      participants: true
    }
  });
}

export async function updateEventService(id: string, data: any) {
  const event = await prisma.event.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      type: data.type,
      capacity: data.capacity
    }
  });

  await sendEventNotification(
    id,
    'EVENT_UPDATED',
    `Event "${event.name}" has been updated`
  );

  return event;
}

export async function deleteEventService(id: string) {
  const event = await prisma.event.delete({
    where: { id }
  });

  await sendEventNotification(
    id,
    'EVENT_DELETED',
    `Event "${event.name}" has been cancelled`
  );

  return event;
}

export async function addParticipantsService(eventId: string, userIds: string[]) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      participants: true
    }
  });

  if (!event) throw new Error('Event not found');

  // Check capacity
  if (event.participants.length + userIds.length > event.capacity) {
    throw new Error('Event capacity exceeded');
  }

  // Add participants
  const participants = await Promise.all(
    userIds.map(userId =>
      prisma.eventParticipant.create({
        data: {
          eventId,
          userId
        }
      })
    )
  );

  // Notify users
  await Promise.all(
    userIds.map(userId =>
      sendUserNotification(
        userId,
        'EVENT_INVITATION',
        `You have been added to event "${event.name}"`
      )
    )
  );

  return participants;
}

export async function removeParticipantService(eventId: string, userId: string) {
  await prisma.eventParticipant.delete({
    where: {
      userId_eventId: {
        userId,
        eventId
      }
    }
  });

  await sendUserNotification(
    userId,
    'EVENT_REMOVAL',
    `You have been removed from event "${eventId}"`
  );
}

export async function recordInteractionService(sessionId: string, userId: string, data: any) {
  const interaction = await prisma.interaction.create({
    data: {
      type: data.type,
      content: data.content,
      sessionId,
      userId,
      sentiment: data.sentiment
    }
  });

  return interaction;
}