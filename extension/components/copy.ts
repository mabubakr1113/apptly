export const EXTENSION_COPY = {
  appName: 'Apptly',
  tagline: 'Apply aptly - fill, tailor, track.',
  loading: 'Loading...',
  missingKey: 'Missing',
  clerkKey: 'VITE_CLERK_PUBLISHABLE_KEY',
  missingKeyHelp: 'Add it to extension/.env (see extension/.env.example and docs/clerk-setup.md).',
  signUp: 'Need an account? Sign up',
  signIn: 'Have an account? Sign in',
};

export const clerkAppearance = {
  variables: {
    colorPrimary: '#18181b',
    borderRadius: '0.625rem',
    fontFamily: 'system-ui, sans-serif',
  },
} as const;
