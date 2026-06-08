'use client';

import { DocumentList, DocumentUpload } from '@apptly/features';
import { Box } from '@apptly/ui';
import { PageHeader } from '../../../components/page-header';

const DocumentsPage = () => (
  <Box as="section" className="flex max-w-3xl flex-col gap-6">
    <PageHeader
      title="Documents"
      description="Your resumes and cover letters. Upload here; the extension can attach them when applying."
    />
    <DocumentUpload />
    <DocumentList />
  </Box>
);

export default DocumentsPage;
