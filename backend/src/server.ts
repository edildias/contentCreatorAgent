import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { authRouter } from './routes/auth.js';
import { metricsRouter } from './routes/metrics.js';
import { postsRouter } from './routes/posts.js';
import { themesRouter } from './routes/themes.js';
import { automationRouter } from './routes/automations.js';
import { prisma } from './utils/prisma.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestContext } from './middleware/request-context.js';
import type { ServerConfig } from './utils/env.js';

export function createServer(config: ServerConfig) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));
  app.use(requestContext);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', version: config.version });
  });

  app.set('config', config);
  app.locals.prisma = prisma;

  app.use('/auth', authRouter(config));
  app.use('/themes', themesRouter(config));
  app.use('/posts', postsRouter(config));
  app.use('/metrics', metricsRouter(config));
  app.use('/automations', automationRouter(config));

  app.use(errorHandler);

  return app;
}
