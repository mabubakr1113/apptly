import type { HTMLInputTypeAttribute } from 'react';
import type { ApplicationStatus } from '@apptly/shared';
import { ApplicationStatusValue } from '@apptly/shared';
import type { ApplicationFormValues } from '@apptly/features/components/ApplicationForm/helpers';

type TextFieldName = Extract<
  keyof ApplicationFormValues,
  'company' | 'position' | 'jobUrl' | 'location' | 'source' | 'salaryText' | 'dateApplied'
>;

export const APPLICATION_TEXT_FIELDS: {
  name: TextFieldName;
  label: string;
  type?: HTMLInputTypeAttribute;
}[] = [
  { name: 'company', label: 'Company' },
  { name: 'position', label: 'Position' },
  { name: 'jobUrl', label: 'Job URL', type: 'url' },
  { name: 'location', label: 'Location' },
  { name: 'source', label: 'Source' },
  { name: 'salaryText', label: 'Salary' },
  { name: 'dateApplied', label: 'Date applied' },
];

export const APPLICATION_STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: ApplicationStatusValue.Saved, label: 'Saved' },
  { value: ApplicationStatusValue.Applied, label: 'Applied' },
  { value: ApplicationStatusValue.Screening, label: 'Screening' },
  { value: ApplicationStatusValue.Interview, label: 'Interview' },
  { value: ApplicationStatusValue.Offer, label: 'Offer' },
  { value: ApplicationStatusValue.Rejected, label: 'Rejected' },
  { value: ApplicationStatusValue.Withdrawn, label: 'Withdrawn' },
];

export const APPLICATION_FORM_COPY = {
  add: 'Add application',
  edit: 'Edit application',
  description: "Track a job you've applied to or want to apply to.",
  status: 'Status',
  notes: 'Notes',
  saving: 'Saving...',
  saveChanges: 'Save changes',
};
