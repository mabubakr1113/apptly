import type { ProfileFormValues } from '@apptly/features/components/ProfileForm/helpers';

export const PROFILE_FIELDS: {
  name: keyof ProfileFormValues;
  label: string;
  type?: string;
  placeholder?: string;
}[] = [
  { name: 'fullName', label: 'Full name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
  { name: 'location', label: 'Location' },
  { name: 'linkedin', label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/in/you' },
  { name: 'portfolio', label: 'Portfolio', type: 'url', placeholder: 'https://...' },
  { name: 'github', label: 'GitHub', type: 'url', placeholder: 'https://github.com/you' },
];

export const PROFILE_FORM_COPY = {
  loading: 'Loading profile...',
  save: 'Save profile',
  saving: 'Saving...',
};
