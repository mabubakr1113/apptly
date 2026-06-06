import { redactSecret } from '@apptly/shared';

type Level = 'debug' | 'info' | 'warn' | 'error';

const PREFIX = '[apptly]';

const emit = (level: Level, args: readonly unknown[]): void => {
  // Safety net: scrub anything that looks like a secret out of string args
  // before it reaches the console. Code should still avoid logging PII/keys.
  const safe = args.map((arg) => (typeof arg === 'string' ? redactSecret(arg) : arg));
  console[level](PREFIX, ...safe);
};

/**
 * Project-wide logger. `debug` is suppressed in production builds; all levels
 * route through {@link redactSecret} so credentials never land in logs.
 */
export const logger = {
  debug: (...args: unknown[]): void => {
    if (import.meta.env.DEV) emit('debug', args);
  },
  info: (...args: unknown[]): void => emit('info', args),
  warn: (...args: unknown[]): void => emit('warn', args),
  error: (...args: unknown[]): void => emit('error', args),
};
