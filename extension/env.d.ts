// Augments Vite's ImportMetaEnv with Apptly's custom env vars.
interface ImportMetaEnv {
  /** Clerk publishable key (client-side, safe to expose). See docs/clerk-setup.md. */
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
}
