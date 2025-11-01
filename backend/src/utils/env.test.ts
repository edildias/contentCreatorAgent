import { describe, expect, it } from 'vitest';

import { loadEnv } from './env.js';

describe('loadEnv', () => {
  it('parses environment variables', () => {
    const originalDatabaseUrl = process.env.DATABASE_URL;
    const originalJwtSecret = process.env.JWT_SECRET;
    const originalPort = process.env.PORT;
    const originalNodeEnv = process.env.NODE_ENV;

    process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
    process.env.JWT_SECRET = 'super-secret-value-123';
    process.env.PORT = '5001';
    process.env.NODE_ENV = 'test';

    const config = loadEnv();
    expect(config.databaseUrl).toBe('postgresql://localhost:5432/test');
    expect(config.jwtSecret).toBe('super-secret-value-123');
    expect(config.port).toBe(5001);
    expect(config.env).toBe('test');

    process.env.DATABASE_URL = originalDatabaseUrl;
    process.env.JWT_SECRET = originalJwtSecret;
    process.env.PORT = originalPort;
    process.env.NODE_ENV = originalNodeEnv;
  });
});
