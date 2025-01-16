import { Request, Response } from 'express';
import { ReportingService } from '../services/reporting.service';
import { addParticipantsService, createEventService, deleteEventService, getEventService, getEventsService, removeParticipantService, updateEventService } from '../services/event.service';

const io = require('../utils/socket').io;

const reportingService = new ReportingService();

export const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const event = await createEventService({
      ...req.body,
      organizerId: req.user.id,
    });
    
    res.status(201).json(event);
  } catch (error: any) {
    console.error('Create event error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update other controller methods similarly
export const getEvents = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const events = await getEventsService(req.user.id);
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await getEventService(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await updateEventService(req.params.id, req.body);
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await deleteEventService(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateReport = async (req: Request, res: Response) => {
  try {
    const report = await reportingService.generateEventReport(req.params.id);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
    res.send(report.buffer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addParticipants = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;
    const participants = await addParticipantsService(req.params.id, userIds);
    res.status(200).json(participants);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeParticipant = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await removeParticipantService(req.params.id, userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};