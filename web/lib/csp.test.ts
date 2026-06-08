import { describe, expect, it } from 'vitest';
import { buildCsp, originOf } from './csp';

describe('buildCsp', () => {
  it('embeds the nonce and uses strict-dynamic', () => {
    const csp = buildCsp({ nonce: 'abc123', isDev: false });
    expect(csp).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain('clerk.accounts.dev');
  });

  it('allows blob: frames so document previews can render', () => {
    const csp = buildCsp({ nonce: 'n', isDev: false });
    expect(csp).toMatch(/frame-src[^;]*blob:/);
  });

  it('allows eval and websockets only in dev', () => {
    const dev = buildCsp({ nonce: 'n', isDev: true });
    const prod = buildCsp({ nonce: 'n', isDev: false });
    expect(dev).toContain("'unsafe-eval'");
    expect(dev).toContain('ws:');
    expect(prod).not.toContain("'unsafe-eval'");
    expect(prod).not.toContain('ws:');
  });

  it('adds the API origin to connect-src when provided', () => {
    const csp = buildCsp({ nonce: 'n', isDev: false, apiOrigin: 'http://localhost:8787' });
    expect(csp).toMatch(/connect-src[^;]*http:\/\/localhost:8787/);
  });
});

describe('originOf', () => {
  it('returns the origin of a valid URL', () => {
    expect(originOf('http://localhost:8787/v1/health')).toBe('http://localhost:8787');
    expect(originOf('https://api.apptly.dev')).toBe('https://api.apptly.dev');
  });

  it('returns undefined for missing or invalid input', () => {
    expect(originOf(undefined)).toBeUndefined();
    expect(originOf('')).toBeUndefined();
    expect(originOf('not a url')).toBeUndefined();
  });
});
