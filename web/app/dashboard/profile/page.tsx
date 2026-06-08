'use client';

import { ProfileForm } from '@apptly/features';
import { Box } from '@apptly/ui';
import { PageHeader } from '../../../components/page-header';

const ProfilePage = () => (
  <Box as="section" className="flex max-w-2xl flex-col gap-6">
    <PageHeader
      title="Profile"
      description="The details Apptly uses to autofill applications. Synced to your account and shared with the extension."
    />
    <ProfileForm />
  </Box>
);

export default ProfilePage;
