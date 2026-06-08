import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DocumentKindValue, type DocumentMeta } from '@apptly/shared';
import { makeApi, renderWithApi } from '@apptly/features/test/util';
import { DocumentList } from '@apptly/features/components/DocumentList/DocumentList';

const resume: DocumentMeta = {
  id: 'doc-1',
  kind: DocumentKindValue.Resume,
  filename: 'cv.pdf',
  r2Key: 'u/doc-1',
  contentHash: 'abc',
  size: 1024,
  createdAt: new Date().toISOString(),
};

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => 'blob:preview');
  URL.revokeObjectURL = vi.fn();
});

describe('DocumentList', () => {
  it('warns that a resume is required when none is uploaded', async () => {
    renderWithApi(<DocumentList />, makeApi({ listDocuments: async () => [] }));
    expect(await screen.findByText(/cv\/resume .* is required/i)).toBeInTheDocument();
  });

  it('hides the requirement warning once a resume exists', async () => {
    renderWithApi(<DocumentList />, makeApi({ listDocuments: async () => [resume] }));
    expect(await screen.findByText('cv.pdf')).toBeInTheDocument();
    expect(screen.queryByText(/is required before you can apply/i)).not.toBeInTheDocument();
  });

  it('previews a PDF in a modal', async () => {
    renderWithApi(<DocumentList />, makeApi({ listDocuments: async () => [resume] }));
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /preview cv\.pdf/i }));

    // The PDF renders inside the Frame (iframe titled with the filename).
    expect(await screen.findByTitle('cv.pdf')).toBeInTheDocument();
    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalled());
  });

  it('asks for confirmation before deleting and only deletes on confirm', async () => {
    const deleteDocument = vi.fn(async () => {});
    renderWithApi(
      <DocumentList />,
      makeApi({ listDocuments: async () => [resume], deleteDocument }),
    );
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /delete cv\.pdf/i }));

    // A confirmation dialog appears; nothing is deleted yet.
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/can’t be undone/i)).toBeInTheDocument();
    expect(deleteDocument).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(deleteDocument).toHaveBeenCalledWith('doc-1'));
  });

  it('does not delete when the confirmation is cancelled', async () => {
    const deleteDocument = vi.fn(async () => {});
    renderWithApi(
      <DocumentList />,
      makeApi({ listDocuments: async () => [resume], deleteDocument }),
    );
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /delete cv\.pdf/i }));
    await user.click(await screen.findByRole('button', { name: /cancel/i }));

    await waitFor(() =>
      expect(screen.queryByText(/can’t be undone/i)).not.toBeInTheDocument(),
    );
    expect(deleteDocument).not.toHaveBeenCalled();
  });
});
