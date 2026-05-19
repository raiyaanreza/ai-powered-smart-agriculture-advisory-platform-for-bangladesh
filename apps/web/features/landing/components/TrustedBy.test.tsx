import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TrustedBy } from './TrustedBy';

// Mock framer-motion to bypass layout animations in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('TrustedBy Component', () => {
  it('renders support paragraph text', () => {
    render(<TrustedBy />);
    expect(screen.getByText('Endorsed & Supported by National Institutions')).toBeDefined();
  });

  it('renders national institution partners', () => {
    render(<TrustedBy />);
    expect(screen.getAllByText('Ministry of Agriculture')[0]).toBeDefined();
    expect(screen.getAllByText('Bangladesh Rice Research Institute')[0]).toBeDefined();
  });
});
