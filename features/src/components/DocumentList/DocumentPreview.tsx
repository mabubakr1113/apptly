import type { DocumentMeta } from '@apptly/shared';
import { DocumentPreviewView } from '@apptly/features/components/DocumentList/DocumentPreview.view';
import { useDocumentPreview } from '@apptly/features/components/DocumentList/use-document-preview';

export interface DocumentPreviewProps {
  doc: DocumentMeta | null;
  onClose: () => void;
}

export const DocumentPreview = ({ doc, onClose }: DocumentPreviewProps) => {
  const state = useDocumentPreview(doc);
  return (
    <DocumentPreviewView
      doc={doc}
      {...state}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    />
  );
};
