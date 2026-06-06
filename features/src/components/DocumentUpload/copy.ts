import { DocumentKindValue, type DocumentKind } from '@apptly/shared';

export const DOCUMENT_KIND_OPTIONS: { value: DocumentKind; label: string }[] = [
  { value: DocumentKindValue.Resume, label: 'Resume' },
  { value: DocumentKindValue.CoverLetter, label: 'Cover letter' },
  { value: DocumentKindValue.TailoredCv, label: 'Tailored CV' },
];

export const DOCUMENT_UPLOAD_COPY = {
  document: 'Document',
  kind: 'Kind',
  chooseFile: 'Choose a PDF or DOCX file.',
  upload: 'Upload',
  uploading: 'Uploading...',
  uploaded: 'Document uploaded',
};
