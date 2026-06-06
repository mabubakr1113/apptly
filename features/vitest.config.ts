import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@apptly/features': fileURLToPath(new URL('./src', import.meta.url)),
      '@apptly/shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
    },
  },
  test: {
    name: 'features',
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
