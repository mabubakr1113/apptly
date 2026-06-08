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
  phone: '+358401234567',
  location: 'Finland',
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

  it('rejects a LinkedIn URL that is not on linkedin.com', async () => {
    const putProfile = vi.fn();
    renderWithApi(<ProfileForm />, makeApi({ getProfile: async () => null, putProfile }));
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText('Full name'), 'Grace Hopper');
    await user.type(screen.getByLabelText('Email'), 'grace@example.com');
    await user.type(screen.getByLabelText('LinkedIn'), 'https://example.com/in/grace');
    await user.click(screen.getByRole('button', { name: /save profile/i }));

    expect(await screen.findByText(/must be a linkedin\.com link/i)).toBeInTheDocument();
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

  it('populates relocate/sponsorship and the per-field EEO answers from the backend', async () => {
    const profile = {
      ...structuredClone(FULL_PROFILE),
      willingToRelocate: true,
      requiresSponsorship: false,
      eeo: {
        gender: 'woman',
        race: 'white',
        veteranStatus: 'protected_veteran',
        disabilityStatus: 'decline',
      },
    };
    renderWithApi(<ProfileForm />, makeApi({ getProfile: async () => profile }));

    await screen.findByDisplayValue('Ada Lovelace');
    const trigger = (name: RegExp) => screen.getByRole('combobox', { name });
    // Booleans render as Yes/No on their own triggers.
    expect(trigger(/willing to relocate/i)).toHaveTextContent('Yes');
    expect(trigger(/visa sponsorship/i)).toHaveTextContent('No');
    // Gender/race are real categories, not yes/no.
    expect(trigger(/gender/i)).toHaveTextContent('Woman');
    expect(trigger(/race/i)).toHaveTextContent('White');
    expect(trigger(/veteran/i)).toHaveTextContent('I am a protected veteran');
  });

  it('round-trips a relocate choice through save', async () => {
    const putProfile = vi.fn(async (p) => p);
    renderWithApi(<ProfileForm />, makeApi({ getProfile: async () => null, putProfile }));
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText('Full name'), 'Grace Hopper');
    await user.type(screen.getByLabelText('Email'), 'grace@example.com');

    await user.click(screen.getByRole('combobox', { name: /willing to relocate/i }));
    await user.click(await screen.findByRole('option', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: /save profile/i }));

    await waitFor(() => expect(putProfile).toHaveBeenCalledTimes(1));
    expect(putProfile.mock.calls[0][0]).toMatchObject({ willingToRelocate: true });
  });

  it('adds a work-history role and a skill, then saves them', async () => {
    const putProfile = vi.fn(async (p) => p);
    renderWithApi(<ProfileForm />, makeApi({ getProfile: async () => null, putProfile }));
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText('Full name'), 'Grace Hopper');
    await user.type(screen.getByLabelText('Email'), 'grace@example.com');

    await user.click(screen.getByRole('button', { name: /add role/i }));
    await user.type(await screen.findByLabelText('Company'), 'US Navy');
    await user.type(screen.getByLabelText('Title'), 'Rear Admiral');
    await user.type(screen.getByLabelText('Start'), '1944');

    await user.type(screen.getByLabelText('Add a skill'), 'COBOL{Enter}');
    expect(screen.getByText('COBOL')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /save profile/i }));

    await waitFor(() => expect(putProfile).toHaveBeenCalledTimes(1));
    expect(putProfile.mock.calls[0][0]).toMatchObject({
      workHistory: [{ company: 'US Navy', title: 'Rear Admiral', start: '1944' }],
      skills: ['COBOL'],
    });
  });

  it('removes an added work-history row', async () => {
    renderWithApi(<ProfileForm />, makeApi({ getProfile: async () => null }));
    const user = userEvent.setup();

    await screen.findByLabelText('Full name');
    await user.click(screen.getByRole('button', { name: /add role/i }));
    expect(await screen.findByLabelText('Company')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove work history entry 1/i }));
    await waitFor(() => expect(screen.queryByLabelText('Company')).not.toBeInTheDocument());
  });

  it('imports a profile JSON and populates the fields', async () => {
    renderWithApi(<ProfileForm />, makeApi({ getProfile: async () => null }));
    const user = userEvent.setup();

    const json = JSON.stringify({
      fullName: 'Imported User',
      email: 'imported@example.com',
      links: {},
      workHistory: [],
      education: [],
      skills: ['Rust'],
      eeo: {
        gender: 'decline',
        race: 'decline',
        veteranStatus: 'decline',
        disabilityStatus: 'decline',
      },
      customQA: [],
      documentRefs: [],
    });
    const file = new File([json], 'profile.json', { type: 'application/json' });

    await screen.findByLabelText('Full name');
    await user.upload(screen.getByLabelText('Import profile JSON'), file);

    expect(await screen.findByDisplayValue('Imported User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('imported@example.com')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();
  });
});
