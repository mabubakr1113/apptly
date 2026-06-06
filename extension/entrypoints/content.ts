import { logger } from '@apptly/extension/lib/logger';

// Module 0 placeholder. Matches are intentionally narrow (example.com) to keep
// install-time permissions minimal; the real job-site matching strategy (and
// the activeTab / on-demand injection trade-off) lands with the detection
// engine in Module 4.
export default defineContentScript({
  matches: ['https://example.com/*'],
  main() {
    logger.info('content script loaded (scaffold placeholder)');
  },
});
