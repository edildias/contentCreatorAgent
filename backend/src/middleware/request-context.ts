import type { NextFunction, Request, Response } from 'express';

export type RequestContext = {
  userId?: string;
  role?: 'USER' | 'ADMIN';
};

declare module 'express-serve-static-core' {
  interface Request {
    context: RequestContext;
  }
}

export function requestContext(req: Request, _res: Response, next: NextFunction) {
  req.context = {};
  next();
}
