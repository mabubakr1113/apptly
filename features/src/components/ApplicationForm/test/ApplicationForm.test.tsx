import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeApi, renderWithApi } from '@apptly/features/test/util';
import { ApplicationForm } from '@apptly/features/components/ApplicationForm/ApplicationForm';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

const CREATED = {
  id: 'a1',
  company: 'Acme',
  position: 'SWE',
  status: 'saved',
  updatedAt: '2026-06-05T00:00:00.000Z',
} as const;

describe('ApplicationForm', () => {
  it('creates an application from valid input', async () => {
    const createApplication = vi.fn(async () => structuredClone(CREATED));
    renderWithApi(<ApplicationForm />, makeApi({ createApplication }));
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Add application' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Company'), 'Acme');
    await user.type(within(dialog).getByLabelText('Position'), 'SWE');
    await user.click(within(dialog).getByRole('button', { name: /add application/i }));

    await waitFor(() => expect(createApplication).toHaveBeenCalledTimes(1));
    expect(createApplication.mock.calls[0][0]).toMatchObject({
      company: 'Acme',
      position: 'SWE',
      status: 'saved',
    });
  });

  it('blocks submit and shows errors when required fields are empty', async () => {
    const createApplication = vi.fn();
    renderWithApi(<ApplicationForm />, makeApi({ createApplication }));
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Add application' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /add application/i }));

    expect(await within(dialog).findAllByText('Required')).toHaveLength(2);
    expect(createApplication).not.toHaveBeenCalled();
  });
});
