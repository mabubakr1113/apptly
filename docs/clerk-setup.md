# Clerk auth setup (Apptly)

Authentication uses [Clerk](https://clerk.com) via `@clerk/chrome-extension`. The
extension code is already wired; these are the one-time account/config steps that
only the project owner can do.

## 1. Create a Clerk application
1. Go to the Clerk Dashboard and create an application (the GitHub Student Pack covers Clerk Pro).
2. Choose Email as a sign-in option (and any others you want).

## 2. Enable Google and GitHub OAuth
1. In the app: **User & Authentication -> SSO connections (Social)**.
2. Toggle **Google** and **GitHub** on.
3. In development, Clerk uses shared OAuth credentials, so both work immediately with no extra setup. For production, add your own Google and GitHub OAuth client IDs/secrets in the same screen.

Once enabled, the Google and GitHub buttons appear automatically inside the
`<SignIn />` and `<SignUp />` components. No code change is required.

## 3. Add the publishable key
1. Copy the **Publishable key** (`pk_test_...`) from **API Keys**.
2. Create `extension/.env` (git-ignored) from `extension/.env.example`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

## 4. Allow the extension origin (stable extension ID)
Clerk must trust the extension's origin (`chrome-extension://<id>`). The ID is only
stable if the extension has a fixed key in its manifest.

1. Build the extension and load `extension/.output/chrome-mv3` unpacked in Chrome to get its ID, or set a fixed `key` in `wxt.config.ts` so the ID never changes.
2. In the Clerk Dashboard, add `chrome-extension://<your-extension-id>` to the app's allowed origins (Clerk's browser-extension setup).

## 5. Production note
The dev CSP/host permissions in `wxt.config.ts` allow `*.clerk.accounts.dev`. For
production, add your Clerk Frontend API domain (from the production publishable
key) to `host_permissions` and the `connect-src` CSP directive.

## Verify
With the key in place: `pnpm dev`, open the popup, and you should see the Clerk
sign-in screen with Email + Google + GitHub. After signing in, the app renders
with a UserButton (for sign-out) in the header.
