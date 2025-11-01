import { Router } from 'express';
import { z } from 'zod';

import { authenticate } from '../middleware/auth.js';
import type { ServerConfig } from '../utils/env.js';
import { createPost, deletePost, listPosts, updatePost } from '../services/post-service.js';
import { logAutomationEvent } from '../services/automation-service.js';
import { prisma } from '../utils/prisma.js';

const postSchema = z.object({
  themeId: z.string(),
  idea: z.string().min(4),
  title: z.string().min(4),
  text: z.string().min(10),
  imageUrl: z.string().url().optional().nullable(),
  status: z.enum(['BACKLOG', 'TO_REVIEW', 'READY_TO_PUBLISH', 'PUBLISHED']).optional(),
  scheduledAt: z.coerce.date().optional().nullable(),
  publishNow: z.boolean().optional()
});

const filtersSchema = z.object({
  themeId: z.string().optional(),
  status: z.enum(['BACKLOG', 'TO_REVIEW', 'READY_TO_PUBLISH', 'PUBLISHED']).optional()
});

export function postsRouter(config: ServerConfig) {
  const router = Router();

  router.use(authenticate(config));

  router.get('/', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const filters = filtersSchema.parse(req.query);
      const posts = await listPosts(req.context.userId, filters);
      res.json(posts);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const body = postSchema.parse(req.body);
      const post = await createPost(req.context.userId, body);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:id', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const body = postSchema.partial().parse(req.body);
      const post = await updatePost(req.params.id, req.context.userId, body);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (body.status) {
        await logAutomationEvent(post.id, 'status_changed', {
          status: body.status,
          userId: req.context.userId,
          scheduledAt: body.scheduledAt ? body.scheduledAt.toISOString() : null,
          publishNow: body.publishNow
        });
      }

      res.json(post);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const result = await deletePost(req.params.id, req.context.userId);
      if (result.count === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  router.post('/:id/metrics', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const metricsSchema = z.object({
        impressions: z.number().int().nonnegative(),
        engagement: z.number().int().nonnegative(),
        leads: z.number().int().nonnegative()
      });

      const body = metricsSchema.parse(req.body);
      const post = await prisma.post.findFirst({ where: { id: req.params.id, userId: req.context.userId } });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const metrics = await prisma.metrics.upsert({
        where: { postId: post.id },
        update: body,
        create: { postId: post.id, ...body }
      });

      res.json(metrics);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
