import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .refine((value) => /^(postgres|postgresql|mysql|mssql|file|https?):/i.test(value), {
      message: 'DATABASE_URL must be a valid connection string'
    }),
  JWT_SECRET: z.string().min(16),
  PORT: z
    .string()
    .regex(/^[0-9]+$/)
    .transform((val) => Number.parseInt(val, 10))
    .default('4000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_VERSION: z.string().default('0.1.0')
});

export type ServerConfig = {
  databaseUrl: string;
  jwtSecret: string;
  port: number;
  env: 'development' | 'test' | 'production';
  version: string;
};

export function loadEnv(): ServerConfig {
  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    APP_VERSION: process.env.npm_package_version ?? process.env.APP_VERSION
  });

  if (!parsed.success) {
    console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
    throw new Error('Failed to load environment variables');
  }

  const { DATABASE_URL, JWT_SECRET, PORT, NODE_ENV, APP_VERSION } = parsed.data;

  return {
    databaseUrl: DATABASE_URL,
    jwtSecret: JWT_SECRET,
    port: PORT,
    env: NODE_ENV,
    version: APP_VERSION
  };
}
