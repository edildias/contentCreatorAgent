declare namespace Express {
  interface Application {
    locals: {
      prisma: import('@prisma/client').PrismaClient;
    } & Application['locals'];
  }
}
