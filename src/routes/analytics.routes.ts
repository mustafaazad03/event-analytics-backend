import { Router } from 'express';
import {
  getEventAnalytics,
  getSentimentAnalytics,
  getEngagementMetrics,
  getDashboardStats
} from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/events/:eventId', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, getEventAnalytics);
router.get('/events/:eventId/sentiment', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, getSentimentAnalytics);
router.get('/events/:eventId/engagement', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, getEngagementMetrics);
router.get('/events/:eventId/dashboard', async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    next(error);
  }
}, getDashboardStats);

export default router;