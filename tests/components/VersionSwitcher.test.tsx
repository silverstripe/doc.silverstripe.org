import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useRouter, usePathname } from 'next/navigation';
import { VersionSwitcher } from '@/components/VersionSwitcher';
import { DEFAULT_VERSION } from '../../global-config';
import { getAllVersions, getVersionStatus } from '@/lib/versions/version-utils';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => `/en/${DEFAULT_VERSION}/getting-started/`),
}));

describe('VersionSwitcher', () => {
  let mockPush: jest.Mock;
  let mockUsePathname: jest.Mock;
  
  // Dynamically find a supported version (not current, not EOL)
  // Note that the `|| ''` is so that the `string | undefined` return type of find() will always be string type
  const supportedVersion = getAllVersions().find(v => getVersionStatus(v) === 'supported') || '';
  // Dynamically find an EOL version
  // Note that the `|| ''` is so that the `string | undefined` return type of find() will always be string type
  const eolVersion = getAllVersions().find(v => getVersionStatus(v) === 'eol') || '';
  const allVersions = getAllVersions();

  beforeEach(() => {
    mockPush = jest.fn();
    mockUsePathname = usePathname as jest.Mock;
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockUsePathname.mockReturnValue(`/en/${DEFAULT_VERSION}/getting-started/`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render version select dropdown with current version selected', () => {
    render(
      <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/getting-started/`} />
    );

    const select = screen.getByRole('combobox', { name: /select documentation version/i });
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue(DEFAULT_VERSION);
  });

  it('should display all available versions as options', () => {
    render(
      <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/getting-started/`} />
    );

    // Check all versions from the dynamic list
    allVersions.forEach(version => {
      expect(screen.getByText(`v${version}`)).toBeInTheDocument();
    });
  });

  it('should navigate to same page in target version when switching versions', async () => {
    const user = userEvent.setup();
    render(
      <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/getting-started/`} />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, supportedVersion);

    expect(mockPush).toHaveBeenCalledWith(`/en/${supportedVersion}/getting-started/`);
  });

  it('should replace version number in slug correctly', async () => {
    const user = userEvent.setup();
    render(
      <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/api/classes/myclass/`} />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, eolVersion);

    expect(mockPush).toHaveBeenCalledWith(`/en/${eolVersion}/api/classes/myclass/`);
  });

  it('should handle root page navigation between versions', async () => {
    const user = userEvent.setup();
    render(
      <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/`} />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, supportedVersion);

    expect(mockPush).toHaveBeenCalledWith(`/en/${supportedVersion}/`);
  });

  it('should have correct label text visible', () => {
    render(
      <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/getting-started/`} />
    );

    const label = screen.getByText('Version:');
    expect(label).toBeInTheDocument();
  });

  it('should display version status in option labels', () => {
    render(
      <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/getting-started/`} />
    );

    // Check that all versions are displayed
    allVersions.forEach(version => {
      expect(screen.getByText(`v${version}`)).toBeInTheDocument();
    });
  });

  it('should handle complex paths with multiple segments', async () => {
    const user = userEvent.setup();
    render(
      <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/en/customisation/custom-modules/`} />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, supportedVersion);

    expect(mockPush).toHaveBeenCalledWith(`/en/${supportedVersion}/en/customisation/custom-modules/`);
  });

  it('should use correct version in select element aria-label', () => {
    render(
      <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/getting-started/`} />
    );

    const select = screen.getByLabelText('Select documentation version');
    expect(select).toBeInTheDocument();
  });

  describe('CSS styling based on version status', () => {
    it('should apply EOL styling (red) for EOL version', () => {
      mockUsePathname.mockReturnValue(`/en/${eolVersion}/some/path/`);
      render(
        <VersionSwitcher currentVersion={eolVersion} currentSlug={`/en/${eolVersion}/some/path/`} />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('status-eol');
    });

    it('should apply current styling (green) for DEFAULT_VERSION', () => {
      // Using DEFAULT_VERSION which is current by definition
      mockUsePathname.mockReturnValue(`/en/${DEFAULT_VERSION}/some/path/`);
      render(
        <VersionSwitcher currentVersion={DEFAULT_VERSION} currentSlug={`/en/${DEFAULT_VERSION}/some/path/`} />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('status-current');
    });

    it('should apply supported styling (blue) for supported versions', () => {
      // Using dynamically determined supported version
      mockUsePathname.mockReturnValue(`/en/${supportedVersion}/some/path/`);
      render(
        <VersionSwitcher currentVersion={supportedVersion} currentSlug={`/en/${supportedVersion}/some/path/`} />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('status-supported');
    });
  });
});
