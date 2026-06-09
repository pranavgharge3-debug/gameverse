import dotenv from 'dotenv';
import { createServer } from 'http';
import { app } from './app';
import { setupRealtime } from './socket';
import { logger } from './utils/logger';

dotenv.config();

const port = Number(process.env.SERVER_PORT || 4000);
const httpServer = createServer(app);

setupRealtime(httpServer);

httpServer.listen(port, () => {
  logger.info(`GamerVerse API running on http://localhost:${port}`);
});
