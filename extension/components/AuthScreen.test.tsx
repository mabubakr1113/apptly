import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@clerk/chrome-extension', () => ({
  SignIn: () => 'Clerk SignIn',
  SignUp: () => 'Clerk SignUp',
}));

import { AuthScreen } from './AuthScreen';

describe('AuthScreen', () => {
  it('shows sign-in by default', () => {
    render(<AuthScreen />);

    expect(screen.getByText('Clerk SignIn')).toBeInTheDocument();
    expect(screen.queryByText('Clerk SignUp')).not.toBeInTheDocument();
  });

  it('toggles to sign-up and back to sign-in', async () => {
    const user = userEvent.setup();
    render(<AuthScreen />);

    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('Clerk SignUp')).toBeInTheDocument();
    expect(screen.queryByText('Clerk SignIn')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Clerk SignIn')).toBeInTheDocument();
    expect(screen.queryByText('Clerk SignUp')).not.toBeInTheDocument();
  });
});
