import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PopupApp } from '@apptly/extension/components/PopupApp';

describe('PopupApp', () => {
  it('renders the Apptly heading and tagline', () => {
    render(<PopupApp />);

    expect(screen.getByRole('heading', { name: /apptly/i })).toBeInTheDocument();
    expect(screen.getByText(/fill, tailor, track/i)).toBeInTheDocument();
  });
});
