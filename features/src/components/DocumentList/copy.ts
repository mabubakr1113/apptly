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
};
