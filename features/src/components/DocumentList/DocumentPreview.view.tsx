import type { DocumentMeta } from '@apptly/shared';
import {
  Box,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Frame,
  Spinner,
  Text,
  buttonVariants,
} from '@apptly/ui';
import { DOCUMENT_LIST_COPY } from '@apptly/features/components/DocumentList/copy';

export interface DocumentPreviewViewProps {
  doc: DocumentMeta | null;
  url: string | null;
  isPdf: boolean;
  isLoading: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
}

export const DocumentPreviewView = ({
  doc,
  url,
  isPdf,
  isLoading,
  error,
  onOpenChange,
}: DocumentPreviewViewProps) => (
  <Dialog open={doc !== null} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="truncate pr-6">{doc?.filename}</DialogTitle>
      </DialogHeader>
      <Box className="min-h-[60vh]">
        {isLoading ? (
          <Box className="flex h-[60vh] items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner /> {DOCUMENT_LIST_COPY.previewLoading}
          </Box>
        ) : null}
        {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
        {url && isPdf ? (
          <Frame
            title={doc?.filename ?? 'Document'}
            src={url}
            className="h-[70vh] rounded-md border bg-muted"
          />
        ) : null}
        {url && !isPdf && !isLoading ? (
          <Box className="flex h-[60vh] items-center justify-center">
            <Text className="max-w-sm text-center text-sm text-muted-foreground">
              {DOCUMENT_LIST_COPY.noPreview}
            </Text>
          </Box>
        ) : null}
      </Box>
      {url ? (
        <DialogFooter className="gap-2 sm:justify-start">
          <Box
            as="a"
            href={url}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: 'outline' })}
          >
            {DOCUMENT_LIST_COPY.openInTab}
          </Box>
          <Box as="a" href={url} download={doc?.filename} className={buttonVariants()}>
            {DOCUMENT_LIST_COPY.download}
          </Box>
        </DialogFooter>
      ) : null}
    </DialogContent>
  </Dialog>
);
