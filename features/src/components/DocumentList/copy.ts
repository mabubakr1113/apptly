import { DocumentKindValue, type DocumentKind } from '@apptly/shared';

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  [DocumentKindValue.Resume]: 'Resume',
  [DocumentKindValue.CoverLetter]: 'Cover letter',
  [DocumentKindValue.TailoredCv]: 'Tailored CV',
};

export const DOCUMENT_LIST_COPY = {
  headers: { kind: 'Kind', file: 'File', size: 'Size', uploaded: 'Uploaded', actions: 'Actions' },
  loading: 'Loading...',
  empty: 'No documents uploaded yet.',
  preview: 'Preview',
  previewLoading: 'Loading preview…',
  noPreview: 'Inline preview is not available for this file type — open or download it instead.',
  openInTab: 'Open in new tab',
  download: 'Download',
  resumeRequired: 'Add your CV/resume — it is required before you can apply.',
  deleteTitle: 'Delete document?',
  deleteBody: (filename: string) =>
    `“${filename}” will be permanently removed. This can’t be undone.`,
  deleteCancel: 'Cancel',
  deleteConfirm: 'Delete',
  deleting: 'Deleting…',
};
