import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

const analyticsService = new AnalyticsService();

export const getEventAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await analyticsService.getEventAnalytics(req.params.eventId);
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSentimentAnalytics = async (req: Request, res: Response) => {
  try {
    const sentiment = await analyticsService.getSentimentAnalytics(req.params.eventId);
    res.json(sentiment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEngagementMetrics = async (req: Request, res: Response) => {
  try {
    const metrics = await analyticsService.getEngagementMetrics(req.params.eventId);
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getEventAnalytics(req.params.eventId);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};