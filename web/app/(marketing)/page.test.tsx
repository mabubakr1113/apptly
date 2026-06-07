import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@clerk/nextjs', () => ({
  SignedIn: () => null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SignedOut: ({ children }: any) => children,
}));
vi.mock('next/link', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ href, children, ...props }: any) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

import LandingPage from './page';

describe('LandingPage', () => {
  it('renders the hero and the signed-out call to action', () => {
    render(<LandingPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/track your job applications/i);
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  });

  it('lists the product features', () => {
    render(<LandingPage />);

    expect(screen.getByText('Autofill applications')).toBeInTheDocument();
    expect(screen.getByText('Synced to one account')).toBeInTheDocument();
  });
});
