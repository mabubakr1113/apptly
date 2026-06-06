import { DocumentUploadView } from '@apptly/features/components/DocumentUpload/DocumentUpload.view';
import { useDocumentUpload } from '@apptly/features/components/DocumentUpload/use-document-upload';

export interface DocumentUploadProps {
  onUploaded?: () => void;
}

export const DocumentUpload = ({ onUploaded }: DocumentUploadProps) => (
  <DocumentUploadView {...useDocumentUpload(onUploaded)} />
);
