import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Everything under /dashboard requires an authenticated Clerk session. The
// public landing page and the sign-in/sign-up routes stay open.
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware((auth, req) => {
  // Send signed-out visitors to sign-in (with a return path) rather than 404ing.
  if (isProtectedRoute(req) && !auth().userId) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Skip Next internals and static files, unless found in search params.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes.
    '/(api|trpc)(.*)',
  ],
};
