import { describe, expect, it } from 'vitest';
import { isNavLinkActive } from './nav.helpers';

describe('isNavLinkActive', () => {
  it('matches the tracker root only on an exact path', () => {
    expect(isNavLinkActive('/dashboard', '/dashboard')).toBe(true);
    expect(isNavLinkActive('/dashboard/profile', '/dashboard')).toBe(false);
  });

  it('matches sub-routes by prefix so the section stays active', () => {
    expect(isNavLinkActive('/dashboard/profile', '/dashboard/profile')).toBe(true);
    expect(isNavLinkActive('/dashboard/documents/123', '/dashboard/documents')).toBe(true);
    expect(isNavLinkActive('/dashboard/profile', '/dashboard/documents')).toBe(false);
  });
});
