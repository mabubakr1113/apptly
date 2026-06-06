import { useState } from 'react';

export enum AuthMode {
  SignIn = 'sign-in',
  SignUp = 'sign-up',
}

export const getPublishableKey = (): string | undefined =>
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const getRedirectUrl = (): string =>
  typeof window !== 'undefined' ? window.location.pathname : '/';

export const useAuthScreen = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.SignIn);
  const toggleMode = () =>
    setMode((value) => (value === AuthMode.SignIn ? AuthMode.SignUp : AuthMode.SignIn));
  return { mode, toggleMode, redirectUrl: getRedirectUrl() };
};
