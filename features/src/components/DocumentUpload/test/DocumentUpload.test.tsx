import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DocumentKindValue } from '@apptly/shared';
import { makeApi, renderWithApi } from '@apptly/features/test/util';
import { DocumentUpload } from '@apptly/features/components/DocumentUpload/DocumentUpload';
import { DOCUMENT_KIND_OPTIONS } from '@apptly/features/components/DocumentUpload/copy';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

const meta = {
  id: 'doc-1',
  kind: DocumentKindValue.Resume,
  filename: 'cv.pdf',
  r2Key: 'u/doc-1',
  contentHash: 'abc',
  size: 10,
  createdAt: new Date().toISOString(),
};

describe('DocumentUpload', () => {
  it('offers only Resume and Cover letter (no tailored CV) and shows the requirement hint', () => {
    renderWithApi(<DocumentUpload />);
    expect(DOCUMENT_KIND_OPTIONS.map((o) => o.value)).toEqual([
      DocumentKindValue.Resume,
      DocumentKindValue.CoverLetter,
    ]);
    expect(screen.getByText(/a cv\/resume is required/i)).toBeInTheDocument();
  });

  it('blocks upload until a file is chosen', async () => {
    const uploadDocument = vi.fn(async () => meta);
    renderWithApi(<DocumentUpload />, makeApi({ uploadDocument }));
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /^upload$/i }));

    expect(await screen.findByText(/choose a pdf or docx file/i)).toBeInTheDocument();
    expect(uploadDocument).not.toHaveBeenCalled();
  });

  it('uploads the chosen file with the selected kind', async () => {
    const uploadDocument = vi.fn(async () => meta);
    renderWithApi(<DocumentUpload />, makeApi({ uploadDocument }));
    const user = userEvent.setup();

    const file = new File(['%PDF-1.4'], 'cv.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText('Document'), file);
    await user.click(screen.getByRole('button', { name: /^upload$/i }));

    await waitFor(() => expect(uploadDocument).toHaveBeenCalledTimes(1));
    expect(uploadDocument.mock.calls[0][0]).toMatchObject({ kind: DocumentKindValue.Resume });
    expect((uploadDocument.mock.calls[0][0] as { file: File }).file.name).toBe('cv.pdf');
  });
});
