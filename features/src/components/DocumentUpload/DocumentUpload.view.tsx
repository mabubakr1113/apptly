import { ALLOWED_DOCUMENT_MIME, type DocumentKind } from '@apptly/shared';
import {
  Box,
  Button,
  FormRoot,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from '@apptly/ui';
import type { FormEvent } from 'react';
import {
  DOCUMENT_KIND_OPTIONS,
  DOCUMENT_UPLOAD_COPY,
} from '@apptly/features/components/DocumentUpload/copy';

export interface DocumentUploadViewProps {
  kind: DocumentKind;
  setKind: (kind: DocumentKind) => void;
  setFile: (file: File | null) => void;
  error: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isUploading: boolean;
}

export const DocumentUploadView = ({
  kind,
  setKind,
  setFile,
  error,
  onSubmit,
  isUploading,
}: DocumentUploadViewProps) => (
  <FormRoot
    onSubmit={onSubmit}
    className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_var(--container-field)_auto] sm:items-end"
  >
    <Box className="grid gap-1.5">
      <Label htmlFor="document-file">{DOCUMENT_UPLOAD_COPY.document}</Label>
      <Input
        id="document-file"
        type="file"
        accept={ALLOWED_DOCUMENT_MIME.join(',')}
        onChange={(event) => setFile(event.currentTarget.files?.[0] ?? null)}
      />
    </Box>
    <Box className="grid gap-1.5">
      <Label htmlFor="document-kind">{DOCUMENT_UPLOAD_COPY.kind}</Label>
      <Select value={kind} onValueChange={(value) => setKind(value as DocumentKind)}>
        <SelectTrigger id="document-kind">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DOCUMENT_KIND_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Box>
    <Button type="submit" disabled={isUploading}>
      {isUploading ? DOCUMENT_UPLOAD_COPY.uploading : DOCUMENT_UPLOAD_COPY.upload}
    </Button>
    <Text className="text-xs text-muted-foreground sm:col-span-3">{DOCUMENT_UPLOAD_COPY.hint}</Text>
    {error ? <Text className="text-sm text-destructive sm:col-span-3">{error}</Text> : null}
  </FormRoot>
);
