import { Router } from 'express';
import { z } from 'zod';

import { authenticate } from '../middleware/auth.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { findUserByEmail, createUser, findUserById } from '../services/user-service.js';
import type { ServerConfig } from '../utils/env.js';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export function authRouter(config: ServerConfig) {
  const router = Router();

  router.post('/register', async (req, res, next) => {
    try {
      const body = registerSchema.parse(req.body);
      const existing = await findUserByEmail(body.email);
      if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const passwordHash = await hashPassword(body.password);
      const user = await createUser({
        email: body.email,
        name: body.name,
        passwordHash
      });

      const token = signToken(config, { sub: user.id, role: user.role });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const body = loginSchema.parse(req.body);
      const user = await findUserByEmail(body.email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const match = await comparePassword(body.password, user.passwordHash);
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = signToken(config, { sub: user.id, role: user.role });
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/me', authenticate(config), async (req, res, next) => {
    try {
      if (!req.context.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      const user = await findUserById(req.context.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
