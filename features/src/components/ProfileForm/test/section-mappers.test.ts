import type { Profile } from '@apptly/shared';
import { describe, expect, it } from 'vitest';
import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';
import {
  EMPTY_EEO,
  sectionsFromForm,
  sectionsToForm,
} from '@apptly/features/components/ProfileForm/section-mappers';

const PROFILE = {
  workHistory: [{ company: 'Acme', title: 'Eng', start: '2020', end: '2022', summary: 'Built things' }],
  education: [{ school: 'MIT', degree: 'BSc', field: 'CS', start: '2016', end: '2020' }],
  skills: ['TypeScript', 'React'],
  eeo: {
    gender: 'woman',
    race: 'decline',
    veteranStatus: 'protected_veteran',
    disabilityStatus: 'no',
  },
  customQA: [{ question: 'Why us?', answer: 'Mission' }],
} as unknown as Profile;

const asForm = (over: Partial<ProfileFormValues>): ProfileFormValues =>
  ({ workHistory: [], education: [], skills: [], eeo: EMPTY_EEO, customQA: [], ...over }) as ProfileFormValues;

describe('section mappers', () => {
  it('round-trips a profile through form values', () => {
    const form = sectionsToForm(PROFILE);
    const back = sectionsFromForm(asForm(form));
    expect(back.workHistory).toEqual(PROFILE.workHistory);
    expect(back.education).toEqual(PROFILE.education);
    expect(back.skills).toEqual(['TypeScript', 'React']);
    expect(back.customQA).toEqual(PROFILE.customQA);
    expect(back.eeo).toEqual(PROFILE.eeo);
  });

  it('carries EEO answers through unchanged (no yes/no translation)', () => {
    const form = sectionsToForm(PROFILE);
    expect(form.eeo).toEqual({
      gender: 'woman',
      race: 'decline',
      veteranStatus: 'protected_veteran',
      disabilityStatus: 'no',
    });
  });

  it('drops blank repeatable rows and empty skills', () => {
    const out = sectionsFromForm(
      asForm({
        workHistory: [{ company: '', title: '', start: '', end: '', summary: '' }],
        education: [{ school: '  ', degree: '', field: '', start: '', end: '' }],
        skills: [{ value: '  ' }, { value: 'Go' }],
        customQA: [{ question: '', answer: 'orphan' }],
      }),
    );
    expect(out.workHistory).toEqual([]);
    expect(out.education).toEqual([]);
    expect(out.skills).toEqual(['Go']);
    expect(out.customQA).toEqual([]);
  });

  it('strips empty optional fields to undefined', () => {
    const out = sectionsFromForm(
      asForm({ workHistory: [{ company: 'A', title: 'B', start: 'C', end: '', summary: '' }] }),
    );
    expect(out.workHistory[0]).toEqual({
      company: 'A',
      title: 'B',
      start: 'C',
      end: undefined,
      summary: undefined,
    });
  });
});
