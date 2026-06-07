'use client';

import { TrackerTable } from '@apptly/features';
import { Box } from '@apptly/ui';
import { PageHeader } from '../../components/page-header';

const TrackerPage = () => (
  <Box as="section" className="flex flex-col gap-6">
    <PageHeader
      title="Application tracker"
      description="Every job you’ve saved or applied to. Add one here or let the extension log it for you — it stays in sync across both."
    />
    <TrackerTable />
  </Box>
);

export default TrackerPage;
