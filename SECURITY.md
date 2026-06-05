# Security

Apptly handles sensitive personal data (resumes, contact details, application
history) and API credentials. Security is a first-class concern.

## Data & credential handling

- **Local cache + authenticated cloud sync (v1):** the device keeps a local
  cache (`browser.storage.local` + IndexedDB), and profile, tracker, and
  resume/cover-letter files sync to the backend (Cloudflare Workers + D1 + R2)
  behind required Clerk authentication. Data is stored per-user and
  access-controlled; end-to-end encryption is a planned hardening step.
- **API keys** are stored in `browser.storage.local` only - never in
  `storage.sync`, never committed, and never sent to any Apptly-operated server
  in bring-your-own-key mode.
- **No secrets in the repo.** `.env*` is git-ignored; only `.env.example` is
  tracked. Logs are routed through a redacting logger (`extension/lib/logger.ts`)
  that masks anything resembling an API key or token.

## Extension hardening

- Manifest V3 with a strict extension-pages CSP: `script-src 'self'`,
  `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'` - no remote
  code, no `eval`.
- **Least-privilege permissions:** `storage`, `activeTab`, `scripting`,
  `sidePanel`. No blanket `<all_urls>` host permission.
- LLM provider calls originate in the background service worker, not content
  scripts, keeping credentials out of page context.

## Authentication & data isolation (Clerk)

- **Key separation:** only the Clerk publishable key (`pk_...`) ships in client
  bundles (extension + web). The secret key (`sk_...`) lives solely as a
  Cloudflare Workers Secret - never in a bundle, the repo, or a shipped `.env`.
- **Server-side verification:** the backend verifies the Clerk session token on
  every request (`@clerk/backend`) and derives the user id from the verified
  token; client-supplied user ids are never trusted. Invalid or expired tokens
  are rejected with 401.
- **Per-user isolation:** every D1 query and R2 object key is scoped to the
  authenticated user; the R2 bucket is private and served only via
  authenticated routes.
- **Origin restriction:** Clerk allowed origins and the backend
  `authorizedParties` are limited to the published extension ID and the web
  domain, to prevent token replay from other sites.
- **Token hygiene:** session tokens are short-lived, never logged (the redacting
  logger strips them), never stored in `storage.sync`; sign-out clears local
  session state.
- **OAuth:** Google and GitHub via Clerk; production uses our own OAuth
  credentials. All auth traffic is HTTPS; CSP `connect-src` is limited to the
  Clerk Frontend API domain.

## Dependency posture

- **`pnpm audit --prod` reports 0 vulnerabilities** - the shipped extension
  has no known-vulnerable dependencies.
- Remaining `pnpm audit` advisories are confined to **dev/build/test tooling**
  (e.g. the Vite/esbuild dev server, the happy-dom test environment, and WXT's
  build CLI). These never ship in the extension artifact. Upgrades that require
  breaking major bumps (Vitest 4, WXT 0.20) are tracked and applied
  deliberately rather than via `npm audit fix --force`.

## Reporting a vulnerability

This is an early-stage personal project. Please open a private security advisory
on the GitHub repository rather than a public issue.
