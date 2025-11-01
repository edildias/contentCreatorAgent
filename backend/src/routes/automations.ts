import { Router } from 'express';
import { z } from 'zod';

import { authenticate } from '../middleware/auth.js';
import type { ServerConfig } from '../utils/env.js';
import { logAutomationEvent } from '../services/automation-service.js';
import { prisma } from '../utils/prisma.js';

const automationSchema = z.object({
  postId: z.string(),
  event: z.string(),
  payload: z.record(z.any())
});

export function automationRouter(config: ServerConfig) {
  const router = Router();
  router.use(authenticate(config));

  router.post('/', async (req, res, next) => {
    try {
      const body = automationSchema.parse(req.body);
      const post = await prisma.post.findFirst({
        where: { id: body.postId, userId: req.context.userId }
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const record = await logAutomationEvent(body.postId, body.event, body.payload);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
