import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const nav = vi.hoisted(() => ({ pathname: '/dashboard' }));

vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }));
vi.mock('next/link', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ href, children, ...props }: any) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

import { DashboardNav } from './nav';

describe('DashboardNav', () => {
  it('renders a link for every section', () => {
    render(<DashboardNav />);

    for (const label of ['Tracker', 'Profile', 'Documents', 'Settings']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('marks the active section based on the current path', () => {
    nav.pathname = '/dashboard/profile';
    render(<DashboardNav />);

    // Active link carries the branded `bg-primary/10`; inactive links don't.
    expect(
      screen.getByRole('link', { name: 'Profile' }).classList.contains('bg-primary/10'),
    ).toBe(true);
    expect(
      screen.getByRole('link', { name: 'Tracker' }).classList.contains('bg-primary/10'),
    ).toBe(false);
  });
});
