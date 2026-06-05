const REDACTED = '[REDACTED]';

/**
 * Mask values that look like secrets (API keys, tokens) so they never end up in
 * logs, error reports, or telemetry. Order matters: more specific patterns run
 * before the broad `sk-` pattern.
 *
 * This is defense-in-depth - code should still avoid logging secrets in the
 * first place - but the logger pipes string args through here as a safety net.
 */
export function redactSecret(input: string): string {
  if (!input) return input;

  return input
    .replace(/sk-ant-[A-Za-z0-9_-]{8,}/g, REDACTED) // Anthropic
    .replace(/sk-[A-Za-z0-9_-]{16,}/g, REDACTED) // OpenAI / generic
    .replace(/github_pat_[A-Za-z0-9_]{10,}/g, REDACTED) // GitHub fine-grained tokens
    .replace(/gh[oprsu]_[A-Za-z0-9]{16,}/g, REDACTED) // GitHub classic tokens
    .replace(/AKIA[0-9A-Z]{16}/g, REDACTED) // AWS access key id
    .replace(/(Bearer\s+)[A-Za-z0-9._-]{12,}/gi, `$1${REDACTED}`); // Bearer tokens
}
