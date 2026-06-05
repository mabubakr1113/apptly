import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// WXT generates the MV3 manifest from this config and the entrypoints/ folder.
// Security posture (Module 0 baseline):
//  - Strict extension-pages CSP: no remote code, no eval, locked base-uri.
//  - Least-privilege permissions: storage/activeTab/scripting/sidePanel only.
//    No blanket <all_urls> host permission - broad site access is added later,
//    deliberately, when the detection/filler modules need it.
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'Apptly',
    description: 'Apply aptly - AI autofill, tailoring, and tracking for job applications.',
    permissions: ['storage', 'activeTab', 'scripting', 'sidePanel'],
    // Clerk auth (development uses *.clerk.accounts.dev). For production, add your
    // Clerk Frontend API domain to host_permissions and the connect-src directive
    // (see docs/clerk-setup.md).
    host_permissions: ['https://*.clerk.accounts.dev/*'],
    content_security_policy: {
      extension_pages:
        "script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; connect-src 'self' https://*.clerk.accounts.dev; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';",
    },
  },
});
