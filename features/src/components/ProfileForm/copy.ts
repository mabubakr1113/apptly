/** Yes/No options for the tri-state (relocate, sponsorship) selects. */
export const TRI_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const PROFILE_FORM_COPY = {
  loading: 'Loading profile...',
  save: 'Save profile',
  saving: 'Saving...',
  selectPlaceholder: 'Select…',
};

/** Voluntary self-identification options, one set per field (a single yes/no is
 * not meaningful for gender or race). `decline` is the safe default — these
 * answers are never auto-filled (the user discloses them deliberately). */
const DECLINE = { value: 'decline', label: 'Prefer not to say' } as const;

export const GENDER_OPTIONS = [
  { value: 'woman', label: 'Woman' },
  { value: 'man', label: 'Man' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'self_describe', label: 'Prefer to self-describe' },
  DECLINE,
] as const;

export const RACE_OPTIONS = [
  { value: 'hispanic_latino', label: 'Hispanic or Latino' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black or African American' },
  { value: 'asian', label: 'Asian' },
  { value: 'native_american', label: 'Native American or Alaska Native' },
  { value: 'pacific_islander', label: 'Native Hawaiian or Pacific Islander' },
  { value: 'two_or_more', label: 'Two or more races' },
  DECLINE,
] as const;

export const VETERAN_OPTIONS = [
  { value: 'protected_veteran', label: 'I am a protected veteran' },
  { value: 'not_protected_veteran', label: 'I am not a protected veteran' },
  DECLINE,
] as const;

export const DISABILITY_OPTIONS = [
  { value: 'yes', label: 'Yes, I have a disability (or previously did)' },
  { value: 'no', label: 'No, I do not have a disability' },
  DECLINE,
] as const;

export const SECTION_COPY = {
  workHistory: { title: 'Work history', add: 'Add role', empty: 'No roles added yet.' },
  education: { title: 'Education', add: 'Add education', empty: 'No education added yet.' },
  skills: {
    title: 'Skills',
    placeholder: 'Type a skill and press Enter',
    empty: 'No skills added yet.',
  },
  customQA: {
    title: 'Saved answers',
    description: 'Reusable answers to questions you have filled before.',
    add: 'Add question',
    empty: 'No saved answers yet.',
  },
  eeo: {
    title: 'Voluntary self-identification',
    description:
      'Optional. Used only if you choose to share — these are never auto-filled for you.',
  },
};
