import { profileSchema, type Profile } from '@apptly/shared';

/** Serializes a profile to a pretty JSON file and triggers a browser download.
 * Document blobs live in R2 and are intentionally excluded — this is the
 * structured profile data only (links, history, skills, EEO, saved answers). */
export const downloadProfileJson = (profile: Profile, filename = 'apptly-profile.json') => {
  const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

/** Reads a user-supplied JSON file and validates it against the canonical
 * profile schema. Rejects (never partially applies) anything malformed. */
export const readProfileJson = async (file: File): Promise<Profile> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  const result = profileSchema.safeParse(parsed);
  if (!result.success) throw new Error('That file is not a valid Apptly profile export.');
  return result.data;
};
