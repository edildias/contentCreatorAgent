import { createServer } from './server.js';
import { loadEnv } from './utils/env.js';

async function bootstrap() {
  const config = loadEnv();
  const app = createServer(config);

  const port = config.port;
  app.listen(port, () => {
    console.log(`TopVoice backend running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
