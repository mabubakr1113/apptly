import { logger } from '@apptly/extension/lib/logger';

export default defineBackground(() => {
  logger.info('background service worker started');
});
