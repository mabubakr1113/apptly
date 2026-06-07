# @apptly/web

The Apptly web app: a public landing page plus an authenticated dashboard over the
same synced data as the browser extension. Next.js (App Router) + React 18,
Tailwind v4 / shadcn via `@apptly/ui`, Clerk auth, and the shared
`@apptly/features` data layer (TanStack Query + the typed sync client).

## How it fits together

- **Same Clerk app as the extension.** Use the same `pk_…`/`sk_…` keys, so a
  sign-in on either surface is the same account. `middleware.ts` protects
  `/dashboard/*`.
- **Same backend, same contract.** Feature components (`TrackerTable`,
  `ProfileForm`, `DocumentList`, `DocumentUpload`) come from `@apptly/features`
  and call the Cloudflare Worker at `NEXT_PUBLIC_API_BASE_URL`, attaching the
  Clerk session token. Writes here sync to the backend and show up in the
  extension (and vice-versa) — no separate web state store needed.

## Routes

```
/                       landing (public)
/sign-in, /sign-up      Clerk <SignIn/> / <SignUp/>
/dashboard              application tracker (TrackerTable)
/dashboard/profile      profile editor (ProfileForm)
/dashboard/documents    upload + list (DocumentUpload, DocumentList)
/dashboard/settings     account (Clerk UserProfile)
```

## Local dev

1. Copy `.env.example` to `.env.local` and fill the Clerk keys (Dashboard → API
   Keys) and `NEXT_PUBLIC_API_BASE_URL` (the local Worker is `http://localhost:8787`).
   See `docs/clerk-setup.md`.
2. Start the backend Worker (see `backend/README.md`).
3. `pnpm --filter @apptly/web dev` and open http://localhost:3000.

`next build` reads `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` at build time, so the env
must be present when building (locally via `.env.local`, in CI via secrets).
