import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Unit tests run on happy-dom with the React plugin. We deliberately do NOT use
// WxtVitest here: the WXT build pipeline is exercised by `wxt build`, and
// decoupling unit tests from it keeps them fast and cross-platform. Tests that
// need the WebExtension API use the fake `browser` wired in vitest.setup.ts.
export default defineConfig({
  root: import.meta.dirname,
  plugins: [react()],
  test: {
    name: 'extension',
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.wxt', '.output'],
  },
});
