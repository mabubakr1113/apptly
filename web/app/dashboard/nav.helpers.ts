/**
 * Active-state logic for a dashboard nav link. The tracker root (`/dashboard`)
 * matches exactly so it doesn't light up on every sub-route; the rest match by
 * prefix so nested pages keep their section active.
 */
export const isNavLinkActive = (pathname: string, href: string): boolean =>
  href === '/dashboard' ? pathname === href : pathname.startsWith(href);
