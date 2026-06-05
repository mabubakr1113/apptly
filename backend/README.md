# @apptly/backend

The Apptly **sync API**: a [Cloudflare Workers](https://developers.cloudflare.com/workers/) +
[Hono](https://hono.dev) service that verifies the Clerk session token on every request and stores
each user's profile, application tracker, and resume/cover-letter documents.

- **D1** (SQLite) — relational data: `users`, `profiles`, `applications`, `documents` (via Drizzle).
- **R2** — document blobs at `{userId}/{docId}`; metadata rows live in D1.
- **Durable Object** (`RateLimiter`) — atomic per-user fixed-window rate limiting.
- **`@apptly/shared`** — the zod schemas the API validates against (the FE↔BE contract).

## Security posture

See [`SECURITY.md`](../SECURITY.md) for the full statement. In short:

- **Server-side verification.** Every `/v1/*` request (except `/v1/health`) must carry
  `Authorization: Bearer <clerk-session-token>`. The token is verified networklessly with
  `@clerk/backend`'s `verifyToken` (Clerk JWKS), restricted to `CLERK_AUTHORIZED_PARTIES`. The user
  id is taken from the verified token's `sub` — **a client-supplied id is never trusted**.
- **Per-user isolation.** Every D1 query and R2 key is scoped to the authenticated user, so one user
  can never read or mutate another's records.
- **Key separation.** Only the Clerk **publishable** key (`pk_...`) is ever client-side. The
  **secret** key (`sk_...`) lives only as a Workers Secret / `.dev.vars` — never committed, never
  bundled. Tokens are never logged (the logger routes through `@apptly/shared`'s `redactSecret`).

## Endpoints

| Method | Path                   | Notes                                           |
| ------ | ---------------------- | ----------------------------------------------- |
| GET    | `/v1/health`           | Public liveness check.                          |
| GET    | `/v1/profile`          | The user's profile, or 404.                     |
| PUT    | `/v1/profile`          | Upsert the profile (last-write-wins).           |
| GET    | `/v1/applications`     | List the user's applications.                   |
| POST   | `/v1/applications`     | Create an application.                          |
| PATCH  | `/v1/applications/:id` | Update (ownership-checked).                     |
| DELETE | `/v1/applications/:id` | Delete (ownership-checked).                     |
| POST   | `/v1/documents`        | Upload (multipart; PDF/DOCX, size-capped) → R2. |
| GET    | `/v1/documents/:id`    | Download the blob (ownership-checked).          |
| DELETE | `/v1/documents/:id`    | Delete blob + metadata (ownership-checked).     |

## Local development

```bash
# 1. Provide the Clerk secret key locally (git-ignored).
cp .dev.vars.example .dev.vars        # then paste your sk_test_... key

# 2. Create a local D1 and apply migrations to it.
pnpm --filter @apptly/backend db:migrate:local

# 3. Run the worker locally (Miniflare).
pnpm --filter @apptly/backend dev

# Health check:
curl http://localhost:8787/v1/health   # -> {"status":"ok"}
```

The Clerk **publishable** key for the client lives in `extension/.env` — see
[`docs/clerk-setup.md`](../docs/clerk-setup.md).

## Schema changes

The D1 schema is `src/db/schema.ts` (Drizzle). After editing it:

```bash
pnpm --filter @apptly/backend db:generate        # regenerate src/db/migrations
pnpm --filter @apptly/backend db:migrate:local    # apply locally
```

## Deploy (one-time owner setup)

These require a Cloudflare account and `wrangler login`; the ids are then filled into
`wrangler.toml` (which currently ships `REPLACE_WITH_*` placeholders).

```bash
# Create the D1 database and R2 bucket, then paste the printed ids into wrangler.toml.
wrangler d1 create apptly
wrangler r2 bucket create apptly-docs

# Set the Clerk secret as a Workers Secret (never committed).
wrangler secret put CLERK_SECRET_KEY

# Set the real authorized parties / CORS origins in wrangler.toml [vars]
# (the published extension origin chrome-extension://<id> and the web domain).

# Apply migrations to the remote D1, then deploy.
pnpm --filter @apptly/backend db:migrate:remote
pnpm --filter @apptly/backend deploy
```

## Testing

Tests run inside the Workers runtime via `@cloudflare/vitest-pool-workers` (real D1, R2, and the
rate-limiter Durable Object). `@clerk/backend` is stubbed so tests drive auth directly.

```bash
pnpm --filter @apptly/backend test
```

Coverage includes: auth 401s (missing/invalid/no-subject), **per-user isolation** (user B cannot
touch user A's records), profile/application CRUD, document upload size/MIME enforcement, the
rate-limit 429, and the public health route.
