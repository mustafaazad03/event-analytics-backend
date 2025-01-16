import { PrismaClient } from '@prisma/client';
import * as ExcelJS from 'exceljs';

const prisma = new PrismaClient();

export class ReportingService {
  async generateEventReport(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        sessions: {
          include: {
            interactions: true
          }
        },
        participants: {
          include: {
            user: true
          }
        }
      }
    });

    if (!event) throw new Error('Event not found');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Event Report');

    // Add headers
    worksheet.columns = [
      { header: 'Session ID', key: 'sessionId', width: 15 },
      { header: 'Session Name', key: 'sessionName', width: 30 },
      { header: 'Interaction Type', key: 'interactionType', width: 20 },
      { header: 'Content', key: 'content', width: 50 },
      { header: 'Sentiment', key: 'sentiment', width: 10 },
      { header: 'User ID', key: 'userId', width: 15 },
      { header: 'Timestamp', key: 'timestamp', width: 25 }
    ];

    // Add data
    event.sessions.forEach((session: any) => {
      session.interactions.forEach((interaction: any) => {
        worksheet.addRow({
          sessionId: session.id,
          sessionName: session.name,
          interactionType: interaction.type,
          content: interaction.content,
          sentiment: interaction.sentiment,
          userId: interaction.userId,
          timestamp: interaction.createdAt
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return {
      filename: `EventReport_${eventId}.xlsx`,
      buffer
    };
  }
}