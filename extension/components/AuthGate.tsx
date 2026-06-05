import { ClerkProvider, useAuth, UserButton } from '@clerk/chrome-extension';
import type { ReactNode } from 'react';
import { AuthScreen } from './AuthScreen';

// Theme Clerk's own widgets (SignIn/SignUp/UserButton) to roughly match the app.
const clerkAppearance = {
  variables: {
    colorPrimary: '#18181b',
    borderRadius: '0.625rem',
    fontFamily: 'system-ui, sans-serif',
  },
} as const;

// Decides what to show based on Clerk auth state (the chrome-extension SDK does
// not export <SignedIn>/<SignedOut>, so we gate with the useAuth hook).
function GatedContent({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!isSignedIn) {
    return <AuthScreen />;
  }

  return (
    <>
      <header className="flex justify-end p-2">
        <UserButton />
      </header>
      {children}
    </>
  );
}

// Required-auth gate. Wraps any surface (popup, options, side panel): signed-out
// users get the Clerk sign-in / sign-up screen; signed-in users get the app.
export function AuthGate({ children }: { children: ReactNode }) {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div className="min-w-[320px] p-4">
        <h1 className="text-base font-semibold">Apptly</h1>
        <p className="mt-1 text-sm text-destructive">
          Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code>. Add it to <code>extension/.env</code>{' '}
          (see <code>extension/.env.example</code> and <code>docs/clerk-setup.md</code>).
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/" appearance={clerkAppearance}>
      <GatedContent>{children}</GatedContent>
    </ClerkProvider>
  );
}
