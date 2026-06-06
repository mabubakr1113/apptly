import { redactSecret } from '@apptly/shared';

type Level = 'debug' | 'info' | 'warn' | 'error';

const PREFIX = '[apptly-backend]';

// Mirrors extension/lib/logger.ts: route string args through redactSecret so
// tokens/keys never reach the logs. Code should still avoid logging PII.
function emit(level: Level, args: readonly unknown[]): void {
  const safe = args.map((arg) => (typeof arg === 'string' ? redactSecret(arg) : arg));
  console[level](PREFIX, ...safe);
}

export const logger = {
  debug: (...args: unknown[]): void => emit('debug', args),
  info: (...args: unknown[]): void => emit('info', args),
  warn: (...args: unknown[]): void => emit('warn', args),
  error: (...args: unknown[]): void => emit('error', args),
};
