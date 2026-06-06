import type { D1Migration } from 'cloudflare:test';
import type { Env } from '@apptly/backend/env';

declare module 'cloudflare:test' {
  // The test env carries all Worker bindings plus the migrations the setup applies.
  interface ProvidedEnv extends Env {
    TEST_MIGRATIONS: D1Migration[];
  }
}
