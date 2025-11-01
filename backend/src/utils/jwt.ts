import jwt from 'jsonwebtoken';

import type { ServerConfig } from './env.js';

export type JwtPayload = {
  sub: string;
  role: 'USER' | 'ADMIN';
};

export function signToken(config: ServerConfig, payload: JwtPayload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}
