import { defineConfig } from 'drizzle-kit';

// Generates SQLite migrations from src/db/schema.ts into src/db/migrations,
// which wrangler applies to D1 (`wrangler d1 migrations apply DB`).
export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1-http',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
});
