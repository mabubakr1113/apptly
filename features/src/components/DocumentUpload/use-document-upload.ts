import { DocumentKindValue, type DocumentKind } from '@apptly/shared';
import { toast } from '@apptly/ui';
import { useState, type FormEvent } from 'react';
import { useUploadDocument } from '@apptly/features/lib/hooks/use-documents';
import { DOCUMENT_UPLOAD_COPY } from '@apptly/features/components/DocumentUpload/copy';

export const useDocumentUpload = (onUploaded?: () => void) => {
  const upload = useUploadDocument();
  const [kind, setKind] = useState<DocumentKind>(DocumentKindValue.Resume);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!file) return setError(DOCUMENT_UPLOAD_COPY.chooseFile);
    upload.mutate(
      { body: { file, kind } },
      {
        onSuccess: () => {
          form.reset();
          setFile(null);
          setError(null);
          toast.success(DOCUMENT_UPLOAD_COPY.uploaded);
          onUploaded?.();
        },
      },
    );
  };
  return { kind, setKind, setFile, error, onSubmit, isUploading: upload.isPending };
};
