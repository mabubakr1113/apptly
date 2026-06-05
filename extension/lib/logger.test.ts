import { afterEach, describe, expect, it, vi } from 'vitest';
import { logger } from './logger';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('logger', () => {
  it('prefixes output and redacts secrets in string args', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    logger.info('connecting with sk-ant-api03-SUPERSECRET1234');

    expect(spy).toHaveBeenCalledTimes(1);
    const line = spy.mock.calls[0]?.join(' ') ?? '';
    expect(line).toContain('[apptly]');
    expect(line).not.toContain('SUPERSECRET1234');
    expect(line).toContain('[REDACTED]');
  });

  it('passes through non-string args untouched', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    logger.warn('count', 42);

    expect(spy).toHaveBeenCalledWith('[apptly]', 'count', 42);
  });
});
