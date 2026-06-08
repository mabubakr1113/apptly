import type { DocumentMeta } from '@apptly/shared';
import { useEffect, useState } from 'react';
import { fetchBlob } from '@apptly/features/lib/api/runtime';
import { messageForError } from '@apptly/features/lib/api/errors';

interface PreviewState {
  url: string | null;
  isPdf: boolean;
  isLoading: boolean;
  error: string | null;
}

const EMPTY: PreviewState = { url: null, isPdf: false, isLoading: false, error: null };

/** Fetches the selected document (authenticated) as an object URL for inline
 * preview/download, and revokes it on change/unmount so blob URLs don't leak. */
export const useDocumentPreview = (doc: DocumentMeta | null): PreviewState => {
  const [state, setState] = useState<PreviewState>(EMPTY);

  useEffect(() => {
    if (!doc) {
      setState(EMPTY);
      return;
    }
    let active = true;
    let objectUrl: string | null = null;
    setState({ ...EMPTY, isLoading: true });
    fetchBlob(`/v1/documents/${doc.id}`)
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        const isPdf =
          blob.type === 'application/pdf' || doc.filename.toLowerCase().endsWith('.pdf');
        setState({ url: objectUrl, isPdf, isLoading: false, error: null });
      })
      .catch((err) => active && setState({ ...EMPTY, error: messageForError(err) }));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc]);

  return state;
};
