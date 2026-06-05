import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

// D1 (SQLite) schema. Every per-user table carries `user_id` (the Clerk user id)
// and is always queried scoped to the authenticated user — isolation is enforced
// at the query layer, never via a client-supplied id.

export const users = sqliteTable('users', {
  clerkUserId: text('clerk_user_id').primaryKey(),
  createdAt: text('created_at').notNull(),
});

export const profiles = sqliteTable(
  'profiles',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.clerkUserId),
    /** The full Profile object (validated against the /shared profileSchema), JSON-encoded. */
    data: text('data').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => ({
    userIdx: uniqueIndex('profiles_user_id_idx').on(t.userId),
  }),
);

export const applications = sqliteTable(
  'applications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.clerkUserId),
    company: text('company').notNull(),
    position: text('position').notNull(),
    jobUrl: text('job_url'),
    source: text('source'),
    location: text('location'),
    dateApplied: text('date_applied'),
    status: text('status').notNull(),
    salaryText: text('salary_text'),
    notes: text('notes'),
    resumeDocId: text('resume_doc_id'),
    coverLetterDocId: text('cover_letter_doc_id'),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => ({
    userIdx: index('applications_user_id_idx').on(t.userId),
  }),
);

export const documents = sqliteTable(
  'documents',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.clerkUserId),
    kind: text('kind').notNull(),
    filename: text('filename').notNull(),
    r2Key: text('r2_key').notNull(),
    contentHash: text('content_hash').notNull(),
    size: integer('size').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => ({
    userIdx: index('documents_user_id_idx').on(t.userId),
  }),
);

export const schema = { users, profiles, applications, documents };
