import { SignIn, SignUp } from '@clerk/chrome-extension';
import { useState } from 'react';
import { Button } from './ui/button';

// The Google and GitHub buttons render automatically inside <SignIn /> and
// <SignUp /> once those providers are enabled in the Clerk Dashboard
// (User & Authentication -> SSO connections). No per-provider code is needed.
export function AuthScreen() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  return (
    <div className="flex min-w-[360px] flex-col items-center gap-3 p-4">
      {mode === 'sign-in' ? <SignIn routing="hash" /> : <SignUp routing="hash" />}
      <Button
        variant="link"
        size="sm"
        onClick={() => setMode((m) => (m === 'sign-in' ? 'sign-up' : 'sign-in'))}
      >
        {mode === 'sign-in' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
      </Button>
    </div>
  );
}
