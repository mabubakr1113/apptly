import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { buildCsp, originOf } from './lib/csp';

// Everything under /dashboard requires an authenticated Clerk session. The
// public landing page and the sign-in/sign-up routes stay open.
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware((auth, req) => {
  // Send signed-out visitors to sign-in (with a return path) rather than 404ing.
  if (isProtectedRoute(req) && !auth().userId) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  // Per-request nonce + strict CSP. Setting it on the request headers lets Next
  // apply the nonce to its own scripts; we also send it on the response.
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp({
    nonce,
    isDev: process.env.NODE_ENV !== 'production',
    apiOrigin: originOf(process.env.NEXT_PUBLIC_API_BASE_URL),
  });

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set('content-security-policy', csp);
  return res;
});

export const config = {
  matcher: [
    // Skip Next internals and static files, unless found in search params.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes.
    '/(api|trpc)(.*)',
  ],
};
