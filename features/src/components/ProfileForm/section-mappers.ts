import type { Profile } from '@apptly/shared';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';

const has = (v: string | undefined) => Boolean(v && v.trim());
const trimOpt = (v: string | undefined) => (has(v) ? v!.trim() : undefined);

/** Default EEO answers (decline-to-answer) for an empty form. The form stores
 * EEO with the same shape as the canonical Profile, so no translation is needed. */
export const EMPTY_EEO: ProfileFormValues['eeo'] = {
  gender: 'decline',
  race: 'decline',
  veteranStatus: 'decline',
  disabilityStatus: 'decline',
};

export const sectionsToForm = (profile: Profile) => ({
  workHistory: profile.workHistory.map((w) => ({
    company: w.company,
    title: w.title,
    start: w.start,
    end: w.end ?? '',
    summary: w.summary ?? '',
  })),
  education: profile.education.map((e) => ({
    school: e.school,
    degree: e.degree ?? '',
    field: e.field ?? '',
    start: e.start ?? '',
    end: e.end ?? '',
  })),
  skills: profile.skills.map((value) => ({ value })),
  eeo: { ...profile.eeo },
  customQA: profile.customQA.map((q) => ({ question: q.question, answer: q.answer })),
});

/** Drops blank rows and trims optional fields; the canonical schema validates. */
export const sectionsFromForm = (values: ProfileFormValues) => ({
  workHistory: values.workHistory
    .filter((w) => has(w.company) || has(w.title) || has(w.start))
    .map((w) => ({
      company: w.company.trim(),
      title: w.title.trim(),
      start: w.start.trim(),
      end: trimOpt(w.end),
      summary: trimOpt(w.summary),
    })),
  education: values.education
    .filter((e) => has(e.school))
    .map((e) => ({
      school: e.school.trim(),
      degree: trimOpt(e.degree),
      field: trimOpt(e.field),
      start: trimOpt(e.start),
      end: trimOpt(e.end),
    })),
  skills: values.skills.map((s) => s.value.trim()).filter(Boolean),
  eeo: values.eeo,
  customQA: values.customQA
    .filter((q) => has(q.question))
    .map((q) => ({ question: q.question.trim(), answer: (q.answer ?? '').trim() })),
});
