import { z } from 'zod';

/** Form-level (all-string) schemas for the Profile's repeatable sections.
 * Required sub-fields mirror the canonical `@apptly/shared` profile schema so a
 * half-filled row is caught before save; empty rows are dropped in the mapper. */

const optStr = z.string().trim().optional();

export const workHistoryRow = z.object({
  company: z.string().trim().min(1, 'Required'),
  title: z.string().trim().min(1, 'Required'),
  start: z.string().trim().min(1, 'Required'),
  end: optStr,
  summary: optStr,
});

export const educationRow = z.object({
  school: z.string().trim().min(1, 'Required'),
  degree: optStr,
  field: optStr,
  start: optStr,
  end: optStr,
});

export const customQARow = z.object({
  question: z.string().trim().min(1, 'Required'),
  answer: optStr,
});

/** Skills are stored as `{ value }` objects so `useFieldArray` has stable keys. */
export const skillRow = z.object({ value: z.string().trim().min(1, 'Required') });
