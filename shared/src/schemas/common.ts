import { z } from 'zod';

/** A string that must contain at least one non-whitespace character. */
export const nonEmptyString = z.string().trim().min(1, 'Must not be empty');

/** A normalized (trimmed, lowercased) email address. */
export const emailSchema = z.string().trim().toLowerCase().email('Invalid email address');

/** An absolute http(s) URL. */
export const urlSchema = z
  .string()
  .trim()
  .url('Invalid URL')
  .refine((u) => u.startsWith('http://') || u.startsWith('https://'), 'URL must start with http:// or https://');

export type Email = z.infer<typeof emailSchema>;
export type Url = z.infer<typeof urlSchema>;
