import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeApi, renderWithApi } from '@apptly/features/test/util';
import { ProfileForm } from '@apptly/features/components/ProfileForm/ProfileForm';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

const FULL_PROFILE = {
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '123',
  location: 'London',
  links: { linkedin: 'https://linkedin.com/in/ada' },
  workHistory: [],
  education: [],
  skills: [],
  eeo: {
    gender: 'decline',
    race: 'decline',
    veteranStatus: 'decline',
    disabilityStatus: 'decline',
  },
  customQA: [],
  documentRefs: [],
} as const;

describe('ProfileForm', () => {
  it('loads the existing profile into the fields', async () => {
    renderWithApi(
      <ProfileForm />,
      makeApi({ getProfile: async () => structuredClone(FULL_PROFILE) }),
    );

    expect(await screen.findByDisplayValue('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ada@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://linkedin.com/in/ada')).toBeInTheDocument();
  });

  it('shows a validation error when required fields are empty', async () => {
    const putProfile = vi.fn();
    renderWithApi(<ProfileForm />, makeApi({ getProfile: async () => null, putProfile }));
    const user = userEvent.setup();

    await screen.findByLabelText('Full name');
    await user.click(screen.getByRole('button', { name: /save profile/i }));

    expect(await screen.findAllByText('Required')).not.toHaveLength(0);
    expect(putProfile).not.toHaveBeenCalled();
  });

  it('saves a valid profile via putProfile', async () => {
    const putProfile = vi.fn(async (p) => p);
    renderWithApi(<ProfileForm />, makeApi({ getProfile: async () => null, putProfile }));
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText('Full name'), 'Grace Hopper');
    await user.type(screen.getByLabelText('Email'), 'grace@example.com');
    await user.click(screen.getByRole('button', { name: /save profile/i }));

    await waitFor(() => expect(putProfile).toHaveBeenCalledTimes(1));
    expect(putProfile.mock.calls[0][0]).toMatchObject({
      fullName: 'Grace Hopper',
      email: 'grace@example.com',
      eeo: { gender: 'decline' },
    });
  });
});
