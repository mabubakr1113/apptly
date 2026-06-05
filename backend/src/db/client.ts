import { drizzle } from 'drizzle-orm/d1';
import type { Env } from '../env';
import { schema } from './schema';

/** Drizzle client bound to the request's D1 database. */
export function getDb(env: Env) {
  return drizzle(env.DB, { schema });
}

export type Db = ReturnType<typeof getDb>;
