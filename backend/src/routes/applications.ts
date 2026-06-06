import {
  applicationCreateSchema,
  applicationPatchSchema,
  type ApplicationRecord,
} from '@apptly/shared';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { getDb } from '@apptly/backend/db/client';
import { applications } from '@apptly/backend/db/schema';
import type { AppBindings } from '@apptly/backend/env';

type Row = typeof applications.$inferSelect;

// DB rows store absent optionals as NULL; the API contract uses `undefined`.
function rowToRecord(row: Row): ApplicationRecord {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    status: row.status as ApplicationRecord['status'],
    updatedAt: row.updatedAt,
    jobUrl: row.jobUrl ?? undefined,
    source: row.source ?? undefined,
    location: row.location ?? undefined,
    dateApplied: row.dateApplied ?? undefined,
    salaryText: row.salaryText ?? undefined,
    notes: row.notes ?? undefined,
    resumeDocId: row.resumeDocId ?? undefined,
    coverLetterDocId: row.coverLetterDocId ?? undefined,
  };
}

export const applicationRoutes = new Hono<AppBindings>()
  // List the user's applications.
  .get('/applications', async (c) => {
    const rows = await getDb(c.env)
      .select()
      .from(applications)
      .where(eq(applications.userId, c.get('userId')))
      .all();
    return c.json({ applications: rows.map(rowToRecord) });
  })
  // Create an application.
  .post('/applications', async (c) => {
    const parsed = applicationCreateSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: { code: 'invalid_body', message: 'Invalid application' } }, 400);
    }

    const row: Row = {
      ...parsed.data,
      jobUrl: parsed.data.jobUrl ?? null,
      source: parsed.data.source ?? null,
      location: parsed.data.location ?? null,
      dateApplied: parsed.data.dateApplied ?? null,
      salaryText: parsed.data.salaryText ?? null,
      notes: parsed.data.notes ?? null,
      resumeDocId: parsed.data.resumeDocId ?? null,
      coverLetterDocId: parsed.data.coverLetterDocId ?? null,
      id: crypto.randomUUID(),
      userId: c.get('userId'),
      updatedAt: new Date().toISOString(),
    };

    await getDb(c.env).insert(applications).values(row);
    return c.json({ application: rowToRecord(row) }, 201);
  })
  // Patch an application (ownership-checked).
  .patch('/applications/:id', async (c) => {
    const parsed = applicationPatchSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: { code: 'invalid_body', message: 'Invalid patch' } }, 400);
    }

    const db = getDb(c.env);
    const scope = and(
      eq(applications.id, c.req.param('id')),
      eq(applications.userId, c.get('userId')),
    );

    const updated = await db
      .update(applications)
      .set({ ...parsed.data, updatedAt: new Date().toISOString() })
      .where(scope)
      .returning()
      .get();

    if (!updated) {
      return c.json({ error: { code: 'not_found', message: 'Application not found' } }, 404);
    }
    return c.json({ application: rowToRecord(updated) });
  })
  // Delete an application (ownership-checked).
  .delete('/applications/:id', async (c) => {
    const deleted = await getDb(c.env)
      .delete(applications)
      .where(and(eq(applications.id, c.req.param('id')), eq(applications.userId, c.get('userId'))))
      .returning()
      .get();

    if (!deleted) {
      return c.json({ error: { code: 'not_found', message: 'Application not found' } }, 404);
    }
    return c.body(null, 204);
  });
