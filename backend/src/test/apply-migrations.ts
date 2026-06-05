import { applyD1Migrations, env } from 'cloudflare:test';

// Apply the generated D1 migrations before each test file's tests run, against
// the isolated per-test D1 instance.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
