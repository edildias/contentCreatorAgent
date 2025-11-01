import { Router } from 'express';
import { z } from 'zod';

import { authenticate } from '../middleware/auth.js';
import type { ServerConfig } from '../utils/env.js';
import { createTheme, deleteTheme, listThemes, updateTheme } from '../services/theme-service.js';

const themeSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  objective: z.string().min(2),
  format: z.string().min(2)
});

export function themesRouter(config: ServerConfig) {
  const router = Router();
  router.use(authenticate(config));

  router.get('/', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const themes = await listThemes(req.context.userId);
      res.json(themes);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const body = themeSchema.parse(req.body);
      const theme = await createTheme(req.context.userId, body);
      res.status(201).json(theme);
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:id', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const body = themeSchema.partial().parse(req.body);
      const theme = await updateTheme(req.params.id, req.context.userId, body);
      if (!theme) {
        return res.status(404).json({ message: 'Theme not found' });
      }
      res.json(theme);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      if (!req.context.userId) return res.status(401).json({ message: 'Not authenticated' });
      const result = await deleteTheme(req.params.id, req.context.userId);
      if (result.count === 0) {
        return res.status(404).json({ message: 'Theme not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
