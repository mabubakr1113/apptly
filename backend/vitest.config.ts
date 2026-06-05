import { resolve } from 'node:path';
import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

// Backend tests run inside the Workers runtime (Miniflare) so D1, R2, and the
// RateLimiter Durable Object behave as in production. The generated D1
// migrations are read here and applied per-test in the setup file, so every
// test starts against the real schema. Resolve relative to this file so the
// path is correct whether run from the package or the repo root.
const migrations = await readD1Migrations(resolve(import.meta.dirname, 'src/db/migrations'));

export default defineWorkersConfig({
  resolve: {
    // Replace @clerk/backend with a tiny stub in tests (see clerk-stub.ts).
    alias: { '@clerk/backend': resolve(import.meta.dirname, 'src/test/clerk-stub.ts') },
  },
  test: {
    name: 'backend',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./src/test/apply-migrations.ts'],
    poolOptions: {
      workers: {
        singleWorker: true,
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          // Deterministic test values + the migrations binding the setup reads.
          bindings: {
            CLERK_AUTHORIZED_PARTIES: 'chrome-extension://test',
            CORS_ALLOWED_ORIGINS: 'chrome-extension://test',
            RATE_LIMIT_MAX: '10',
            RATE_LIMIT_WINDOW_MS: '60000',
            TEST_MIGRATIONS: migrations,
          },
        },
      },
    },
  },
});
