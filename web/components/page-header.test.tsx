import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  it('renders the title as a heading and the description text', () => {
    render(<PageHeader title="Application tracker" description="Every job you've applied to." />);

    expect(screen.getByRole('heading', { name: 'Application tracker' })).toBeInTheDocument();
    expect(screen.getByText("Every job you've applied to.")).toBeInTheDocument();
  });
});
