import { ApplicationStatusValue, type ApplicationStatus } from '@apptly/shared';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export const statusBadgeVariant = (status: ApplicationStatus): BadgeVariant => {
  switch (status) {
    case ApplicationStatusValue.Offer:
      return 'default';
    case ApplicationStatusValue.Rejected:
    case ApplicationStatusValue.Withdrawn:
      return 'destructive';
    case ApplicationStatusValue.Interview:
    case ApplicationStatusValue.Screening:
      return 'secondary';
    default:
      return 'outline';
  }
};
