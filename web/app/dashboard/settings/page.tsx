'use client';

import { UserProfile } from '@clerk/nextjs';
import { Box, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@apptly/ui';
import { PageHeader } from '../../../components/page-header';

const SettingsPage = () => (
  <Box as="section" className="flex flex-col gap-6">
    <PageHeader
      title="Settings"
      description="Manage your account. This is the same Clerk account you use in the Apptly extension."
    />

    <Card>
      <CardHeader>
        <CardTitle className="text-base">Synced account</CardTitle>
        <CardDescription>
          Signing in here or in the browser extension uses one Clerk identity, so your profile,
          documents, and tracker stay the same on both.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Connected social logins (Google, GitHub) and security settings are managed below.
      </CardContent>
    </Card>

    <UserProfile routing="hash" />
  </Box>
);

export default SettingsPage;
