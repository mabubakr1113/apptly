import { logger } from '../lib/logger';

export default defineBackground(() => {
  logger.info('background service worker started');
});
