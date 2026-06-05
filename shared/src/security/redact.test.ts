import { describe, expect, it } from 'vitest';
import { redactSecret } from './redact';

// NOTE: the token-like strings below are intentionally fake placeholders
// (they contain "EXAMPLE"/"FAKE") so secret scanners do not flag this file.
describe('redactSecret', () => {
  it('masks Anthropic API keys', () => {
    expect(redactSecret('key=sk-ant-EXAMPLE000FAKEKEY')).toBe('key=[REDACTED]');
  });

  it('masks OpenAI-style keys', () => {
    expect(redactSecret('OPENAI sk-EXAMPLE0000FAKEKEY00')).toBe('OPENAI [REDACTED]');
  });

  it('masks GitHub classic tokens', () => {
    expect(redactSecret('token gho_EXAMPLE0000FAKEKEY00')).toBe('token [REDACTED]');
  });

  it('masks GitHub fine-grained tokens', () => {
    expect(redactSecret('pat github_pat_EXAMPLE0000FAKE')).toBe('pat [REDACTED]');
  });

  it('masks Bearer tokens while keeping the scheme', () => {
    expect(redactSecret('Authorization: Bearer EXAMPLEfaketoken00')).toBe(
      'Authorization: Bearer [REDACTED]',
    );
  });

  it('leaves ordinary text untouched', () => {
    expect(redactSecret('Applying to Acme Corp as Senior Engineer')).toBe(
      'Applying to Acme Corp as Senior Engineer',
    );
  });

  it('returns empty string unchanged', () => {
    expect(redactSecret('')).toBe('');
  });
});
