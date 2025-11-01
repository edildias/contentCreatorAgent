import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import type { ServerConfig } from '../utils/env.js';

export function authenticate(config: ServerConfig, requireAdmin = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing authorization header' });
    }

    try {
      const token = header.slice('Bearer '.length);
      const payload = jwt.verify(token, config.jwtSecret) as { sub: string; role: 'USER' | 'ADMIN' };
      req.context.userId = payload.sub;
      req.context.role = payload.role;

      if (requireAdmin && payload.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin permissions required' });
      }

      next();
    } catch (error) {
      console.error('Auth error', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
