# Apptly

**Apply aptly - fill, tailor, track.**

Apptly is a cross-browser extension that auto-fills job applications from your stored profile, tailors your CV keywords and writes a cover letter against each job description, then **stops for your review** before you submit. Every application is logged to a built-in tracker dashboard.

- 🧠 **Smart autofill** - generic form engine + per-ATS adapters (Greenhouse, Lever to start)
- ✍️ **Tailoring** - CV keyword optimization + AI cover-letter generation per job
- 📋 **Tracker** - auto-logs company, role, link, date, status, and the exact docs you sent
- 🔒 **Local cache + secure sync** - on-device cache with authenticated cloud sync (Clerk + Cloudflare D1/R2); bring your own API key or use a hosted proxy
- ✅ **Review-then-submit by default** - auto-submit is an opt-in toggle

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the branch + PR workflow.

## Monorepo layout

```
extension/   # Frontend - the MV3 browser extension (WXT + React + TS)
backend/     # Backend - Cloudflare Workers sync API (Hono + D1 + R2, Clerk-authenticated)
shared/      # zod schemas + types shared by both (the FE↔BE contract)
```

## Development

Requires Node ≥ 20 (see `.nvmrc`) and **pnpm** (managed via Corepack - `corepack enable`,
or invoke as `corepack pnpm <cmd>`).

```bash
pnpm install         # install all workspaces
pnpm dev             # run the extension in dev mode (Chrome)
pnpm test            # run the test suite (Vitest, TDD)
pnpm typecheck       # type-check all workspaces
pnpm lint            # ESLint
pnpm build           # build Chrome + Firefox artifacts
```

Load the unpacked build from `extension/.output/chrome-mv3` (or `firefox-mv2`) in your browser.

## Status

**Module 0 - scaffold** complete: WXT + TypeScript + React, Vitest (TDD), ESLint/Prettier,
security baseline (strict CSP, least-privilege permissions). Built module by module.

## License

[MIT](./LICENSE) (c) 2026 Mohammad Abubakr.
