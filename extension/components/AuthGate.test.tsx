import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Box } from '@apptly/ui';

// Mutable, hoisted auth state so each test can drive useAuth's return value.
const auth = vi.hoisted(() => ({
  state: { isLoaded: true, isSignedIn: true } as { isLoaded: boolean; isSignedIn: boolean },
}));

vi.mock('@clerk/chrome-extension', () => ({
  ClerkProvider: ({ children }: { children?: ReactNode }) => children,
  UserButton: () => 'UserButton',
  useAuth: () => auth.state,
}));

vi.mock('./AuthScreen', () => ({ AuthScreen: () => 'AuthScreen' }));

import { AuthGate } from '@apptly/extension/components/AuthGate';

const KEY = 'VITE_CLERK_PUBLISHABLE_KEY';

beforeEach(() => {
  // Default: key present, fully loaded, signed in. Each test overrides as needed.
  vi.stubEnv(KEY, 'pk_test_example');
  auth.state = { isLoaded: true, isSignedIn: true };
});

afterEach(() => {
  vi.unstubAllEnvs();
});

const renderGate = () =>
  render(
    <AuthGate>
      <Box>App content</Box>
    </AuthGate>,
  );

describe('AuthGate', () => {
  it('shows a setup notice when the publishable key is missing', () => {
    vi.stubEnv(KEY, '');

    renderGate();

    expect(screen.getByText(/Missing/i)).toBeInTheDocument();
    expect(screen.queryByText('App content')).not.toBeInTheDocument();
    expect(screen.queryByText('AuthScreen')).not.toBeInTheDocument();
  });

  it('shows a loading state before Clerk has loaded', () => {
    auth.state = { isLoaded: false, isSignedIn: false };

    renderGate();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(screen.queryByText('App content')).not.toBeInTheDocument();
    expect(screen.queryByText('AuthScreen')).not.toBeInTheDocument();
  });

  it('shows the auth screen when loaded but signed out', () => {
    auth.state = { isLoaded: true, isSignedIn: false };

    renderGate();

    expect(screen.getByText('AuthScreen')).toBeInTheDocument();
    expect(screen.queryByText('App content')).not.toBeInTheDocument();
    expect(screen.queryByText('UserButton')).not.toBeInTheDocument();
  });

  it('renders the app (and UserButton) when loaded and signed in', () => {
    auth.state = { isLoaded: true, isSignedIn: true };

    renderGate();

    expect(screen.getByText('App content')).toBeInTheDocument();
    expect(screen.getByText('UserButton')).toBeInTheDocument();
    expect(screen.queryByText('AuthScreen')).not.toBeInTheDocument();
  });
});
