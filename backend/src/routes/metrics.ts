import { Router } from 'express';
import { z } from 'zod';

import { authenticate } from '../middleware/auth.js';
import type { ServerConfig } from '../utils/env.js';
import { getDashboardSummary, upsertMetrics } from '../services/metrics-service.js';

const rangeSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date()
});

const metricsInputSchema = z.object({
  impressions: z.number().int().nonnegative(),
  engagement: z.number().int().nonnegative(),
  leads: z.number().int().nonnegative()
});

export function metricsRouter(config: ServerConfig) {
  const router = Router();
  router.use(authenticate(config));

  router.get('/summary', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const { start, end } = rangeSchema.parse(req.query);
      const summary = await getDashboardSummary(req.context.userId, { start, end });
      res.json(summary);
    } catch (error) {
      next(error);
    }
  });

  router.post('/posts/:postId', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const body = metricsInputSchema.parse(req.body);
      const metrics = await upsertMetrics(req.params.postId, body);
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
