import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeApi, renderWithApi } from '@apptly/features/test/util';
import { TrackerTable } from '@apptly/features/components/TrackerTable/TrackerTable';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

const ROWS = [
  {
    id: 'a1',
    company: 'Acme',
    position: 'SWE',
    status: 'applied',
    updatedAt: '2026-06-05T00:00:00.000Z',
  },
  {
    id: 'a2',
    company: 'Globex',
    position: 'PM',
    status: 'offer',
    updatedAt: '2026-06-05T00:00:00.000Z',
  },
] as const;

describe('TrackerTable', () => {
  it('renders the user applications as rows', async () => {
    renderWithApi(
      <TrackerTable />,
      makeApi({ listApplications: async () => structuredClone(ROWS) }),
    );

    expect(await screen.findByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Globex')).toBeInTheDocument();
    expect(screen.getByText('SWE')).toBeInTheDocument();
  });

  it('filters rows by the global search box', async () => {
    renderWithApi(
      <TrackerTable />,
      makeApi({ listApplications: async () => structuredClone(ROWS) }),
    );
    const user = userEvent.setup();

    await screen.findByText('Acme');
    await user.type(screen.getByLabelText('Search applications'), 'Globex');

    expect(screen.getByText('Globex')).toBeInTheDocument();
    expect(screen.queryByText('Acme')).not.toBeInTheDocument();
  });

  it('deletes a row via the delete action', async () => {
    const deleteApplication = vi.fn(async () => {});
    renderWithApi(
      <TrackerTable />,
      makeApi({ listApplications: async () => structuredClone(ROWS), deleteApplication }),
    );
    const user = userEvent.setup();

    const row = (await screen.findByText('Acme')).closest('tr')!;
    await user.click(within(row).getByRole('button', { name: /delete acme/i }));

    await waitFor(() => expect(deleteApplication).toHaveBeenCalledWith('a1'));
  });

  it('shows an empty state when there are no applications', async () => {
    renderWithApi(<TrackerTable />, makeApi({ listApplications: async () => [] }));
    expect(await screen.findByText('No applications yet.')).toBeInTheDocument();
  });
});
