import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useRouter, usePathname } from 'next/navigation';
import { VersionSwitcher } from '@/components/VersionSwitcher';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/en/6/getting-started/'),
}));

describe('VersionSwitcher', () => {
  let mockPush: jest.Mock;
  let mockUsePathname: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockUsePathname = usePathname as jest.Mock;
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockUsePathname.mockReturnValue('/en/6/getting-started/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render version select dropdown with current version selected', () => {
    render(
      <VersionSwitcher currentVersion="6" currentSlug="/en/6/getting-started/" />
    );

    const select = screen.getByRole('combobox', { name: /select documentation version/i });
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('6');
  });

  it('should display all available versions as options', () => {
    render(
      <VersionSwitcher currentVersion="6" currentSlug="/en/6/getting-started/" />
    );

    expect(screen.getByText('v6')).toBeInTheDocument();
    expect(screen.getByText('v5')).toBeInTheDocument();
    expect(screen.getByText('v4')).toBeInTheDocument();
    expect(screen.getByText('v3')).toBeInTheDocument();
  });

  it('should navigate to same page in target version when switching versions', async () => {
    const user = userEvent.setup();
    render(
      <VersionSwitcher currentVersion="6" currentSlug="/en/6/getting-started/" />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '5');

    expect(mockPush).toHaveBeenCalledWith('/en/5/getting-started/');
  });

  it('should replace version number in slug correctly', async () => {
    const user = userEvent.setup();
    render(
      <VersionSwitcher currentVersion="6" currentSlug="/en/6/api/classes/myclass/" />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '4');

    expect(mockPush).toHaveBeenCalledWith('/en/4/api/classes/myclass/');
  });

  it('should handle root page navigation between versions', async () => {
    const user = userEvent.setup();
    render(
      <VersionSwitcher currentVersion="6" currentSlug="/en/6/" />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '5');

    expect(mockPush).toHaveBeenCalledWith('/en/5/');
  });

  it('should have correct label text visible', () => {
    render(
      <VersionSwitcher currentVersion="6" currentSlug="/en/6/getting-started/" />
    );

    const label = screen.getByText('Version:');
    expect(label).toBeInTheDocument();
  });

  it('should display version status in option labels', () => {
    render(
      <VersionSwitcher currentVersion="6" currentSlug="/en/6/getting-started/" />
    );

    // v6 is current
    expect(screen.getByText('v6')).toBeInTheDocument();
    // v5 is supported
    expect(screen.getByText('v5')).toBeInTheDocument();
    // v3 and v4 are EOL
    expect(screen.getByText('v3')).toBeInTheDocument();
    expect(screen.getByText('v4')).toBeInTheDocument();
  });

  it('should handle complex paths with multiple segments', async () => {
    const user = userEvent.setup();
    render(
      <VersionSwitcher currentVersion="6" currentSlug="/en/6/en/customisation/custom-modules/" />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '5');

    expect(mockPush).toHaveBeenCalledWith('/en/5/en/customisation/custom-modules/');
  });

  it('should use correct version in select element aria-label', () => {
    render(
      <VersionSwitcher currentVersion="6" currentSlug="/en/6/getting-started/" />
    );

    const select = screen.getByLabelText('Select documentation version');
    expect(select).toBeInTheDocument();
  });

  describe('CSS styling based on version status', () => {
    it('should apply EOL styling (red) for version 3', () => {
      mockUsePathname.mockReturnValue('/en/3/some/path/');
      render(
        <VersionSwitcher currentVersion="3" currentSlug="/en/3/some/path/" />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('status-eol');
    });

    it('should apply current styling (green) for version 6', () => {
      mockUsePathname.mockReturnValue('/en/6/some/path/');
      render(
        <VersionSwitcher currentVersion="6" currentSlug="/en/6/some/path/" />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('status-current');
    });

    it('should apply supported styling (blue) for version 5', () => {
      mockUsePathname.mockReturnValue('/en/5/some/path/');
      render(
        <VersionSwitcher currentVersion="5" currentSlug="/en/5/some/path/" />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('status-supported');
    });
  });
});
