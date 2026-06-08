import { getCountries } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';

/** All countries (ISO-3166 alpha-2 code + English name), sorted by name.
 * Sourced from `react-phone-number-input` so we don't ship a second list. */
const names = en as Record<string, string>;

export const COUNTRIES: { code: string; name: string }[] = getCountries()
  .map((code) => ({ code: code as string, name: names[code] as string | undefined }))
  .filter((c): c is { code: string; name: string } => Boolean(c.name))
  .sort((a, b) => a.name.localeCompare(b.name));
