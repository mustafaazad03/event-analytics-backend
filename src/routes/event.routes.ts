import { Router } from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  addParticipants,
  removeParticipant,
  generateReport,
  getEvent
} from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, async (req, res, next) => {
  try {
    await getEvents(req, res);
  } catch (error) {
    next(error);
  }
});
router.post('/', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, async (req, res, next) => {
  try {
    await createEvent(req, res);
  } catch (error) {
    next(error);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, async (req, res, next) => {
  try {
    await getEvent(req, res);
  } catch (error) {
    next(error);
  }
});
router.put('/:id', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, updateEvent);
router.delete('/:id', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, deleteEvent);
router.post('/:id/participants', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, addParticipants);
router.delete('/:id/participants/:userId', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, removeParticipant);
router.get('/:id/report', generateReport);

export default router;