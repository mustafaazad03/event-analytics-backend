import { Router } from 'express';
import authRoutes from './auth.routes';
import eventRoutes from './event.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/analytics', analyticsRoutes);

export default router;