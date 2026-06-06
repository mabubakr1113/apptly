import { drizzle } from 'drizzle-orm/d1';
import type { Env } from '@apptly/backend/env';
import { schema } from '@apptly/backend/db/schema';

/** Drizzle client bound to the request's D1 database. */
export function getDb(env: Env) {
  return drizzle(env.DB, { schema });
}

export type Db = ReturnType<typeof getDb>;
