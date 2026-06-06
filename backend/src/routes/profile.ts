import { profileSchema } from '@apptly/shared';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { getDb } from '@apptly/backend/db/client';
import { profiles } from '@apptly/backend/db/schema';
import type { AppBindings } from '@apptly/backend/env';

export const profile = new Hono<AppBindings>()
  // The user's profile, or 404 if they have not saved one yet.
  .get('/profile', async (c) => {
    const db = getDb(c.env);
    const row = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, c.get('userId')))
      .get();
    if (!row) {
      return c.json({ error: { code: 'not_found', message: 'No profile yet' } }, 404);
    }
    return c.json({ profile: profileSchema.parse(JSON.parse(row.data)) });
  })
  // Upsert the profile (last-write-wins on updatedAt).
  .put('/profile', async (c) => {
    const parsed = profileSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: { code: 'invalid_body', message: 'Invalid profile' } }, 400);
    }

    const userId = c.get('userId');
    const data = JSON.stringify(parsed.data);
    const updatedAt = new Date().toISOString();

    await getDb(c.env)
      .insert(profiles)
      .values({ userId, data, updatedAt })
      .onConflictDoUpdate({ target: profiles.userId, set: { data, updatedAt } });

    return c.json({ profile: parsed.data });
  });
