import type { DocumentMeta } from '@apptly/shared';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from '@apptly/ui';
import { DOCUMENT_LIST_COPY } from '@apptly/features/components/DocumentList/copy';

export interface DeleteConfirmDialogViewProps {
  doc: DocumentMeta | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export const DeleteConfirmDialogView = ({
  doc,
  isDeleting,
  onConfirm,
  onOpenChange,
}: DeleteConfirmDialogViewProps) => (
  <Dialog open={doc !== null} onOpenChange={(open) => !isDeleting && onOpenChange(open)}>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle>{DOCUMENT_LIST_COPY.deleteTitle}</DialogTitle>
        <DialogDescription>{DOCUMENT_LIST_COPY.deleteBody(doc?.filename ?? '')}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isDeleting}
          onClick={() => onOpenChange(false)}
        >
          {DOCUMENT_LIST_COPY.deleteCancel}
        </Button>
        <Button type="button" variant="destructive" disabled={isDeleting} onClick={onConfirm}>
          {isDeleting ? (
            <Box className="flex items-center gap-2">
              <Spinner /> {DOCUMENT_LIST_COPY.deleting}
            </Box>
          ) : (
            DOCUMENT_LIST_COPY.deleteConfirm
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
