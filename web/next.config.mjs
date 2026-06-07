/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The shared workspace packages ship raw TS/TSX (no build step), so Next must
  // transpile them as part of the app build. They are consumed via their
  // package `exports` maps (e.g. `@apptly/features/lib/...`).
  transpilePackages: ['@apptly/ui', '@apptly/features', '@apptly/shared'],
  experimental: {
    // Rewrite named barrel imports to direct paths so we don't pull whole
    // packages into the client bundle (AGENT.md §2.1). lucide-react is in
    // Next's default list; the workspace barrels are not, so list them.
    optimizePackageImports: ['lucide-react', '@apptly/ui', '@apptly/features'],
  },
};

export default nextConfig;
