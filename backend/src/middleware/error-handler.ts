import type { NextFunction, Request, Response } from 'express';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof Error) {
    console.error(error.message, error.stack);
    return res.status(500).json({ message: error.message });
  }

  console.error('Unknown error', error);
  return res.status(500).json({ message: 'Unexpected error' });
}
