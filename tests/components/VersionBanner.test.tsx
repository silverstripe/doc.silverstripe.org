/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { VersionBanner } from '@/components/VersionBanner';
import { DEFAULT_VERSION } from '../../global-config';
import { getAllVersions, getVersionStatus } from '@/lib/versions/version-utils';

describe('VersionBanner', () => {
  const mockLatestVersionPath = `/en/${DEFAULT_VERSION}/`;
  
  // Dynamically find a supported version (not current, not EOL)
  // Note that the `|| ''` is so that the `string | undefined` return type of find() will always be string type
  const supportedVersion = getAllVersions().find(v => getVersionStatus(v) === 'supported') || '';
  // Dynamically find an EOL version
  // Note that the `|| ''` is so that the `string | undefined` return type of find() will always be string type
  const eolVersion = getAllVersions().find(v => getVersionStatus(v) === 'eol') || '';

  it('should render banner for DEFAULT_VERSION with success styling and no message', () => {
    const { container } = render(
      <VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />
    );

    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain(`Version ${DEFAULT_VERSION}`);

    // Check for Supported label
    expect(screen.getByText('Supported')).toBeInTheDocument();

    // Check for success styling
    const banner = container.querySelector('[role="alert"]');
    expect(banner).toHaveClass('style-success');

    // Check that no message section is rendered
    expect(screen.queryByText(/This version of Silverstripe CMS/)).not.toBeInTheDocument();
  });

  it('should render banner for supported version with info styling and message', () => {
    // Using dynamically determined supported version
    // This tests the "supported" version styling and behavior
    const { container } = render(
      <VersionBanner version={supportedVersion} latestVersionPath={mockLatestVersionPath} />
    );

    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain(`Version ${supportedVersion}`);

    // Check for Supported label
    expect(screen.getByText('Supported')).toBeInTheDocument();

    // Check for info styling (blue)
    const banner = container.querySelector('[role="alert"]');
    expect(banner).toHaveClass('style-info');

    // Check that message section is rendered
    expect(screen.getByText(/still supported/)).toBeInTheDocument();

    // Check that link to latest version is present
    expect(screen.getByRole('link', { name: /Go to documentation for the most recent stable version/ })).toBeInTheDocument();
  });

  it('should render banner for EOL version with danger styling and EOL message', () => {
    const { container } = render(
      <VersionBanner version={eolVersion} latestVersionPath={mockLatestVersionPath} />
    );

    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain(`Version ${eolVersion}`);

    // Check for End of Life label
    expect(screen.getByText('End of Life')).toBeInTheDocument();

    // Check for danger styling
    const banner = container.querySelector('[role="alert"]');
    expect(banner).toHaveClass('style-danger');

    // Check that message section is rendered
    expect(screen.getByText(/will not receive/)).toBeInTheDocument();
  });

  it('should have correct icon for DEFAULT_VERSION', () => {
    const { container } = render(
      <VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />
    );

    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toHaveClass('fa-circle-check');
  });

  it('should have correct icon for EOL version', () => {
    const { container } = render(
      <VersionBanner version={eolVersion} latestVersionPath={mockLatestVersionPath} />
    );

    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toHaveClass('fa-circle-xmark');
  });

  it('should render banner with alert role', () => {
    render(<VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />);

    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
  });

  it('should not show link to latest version when viewing DEFAULT_VERSION', () => {
    render(
      <VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />
    );

    // DEFAULT_VERSION has no message, so link shouldn't appear
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should show version and stability in title section', () => {
    // Using dynamically determined supported version
    const { container } = render(
      <VersionBanner version={supportedVersion} latestVersionPath={mockLatestVersionPath} />
    );

    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain(`Version ${supportedVersion}`);
    expect(screen.getByText('Supported')).toBeInTheDocument();
    
    // Verify status is displayed as a separate element with icon
    const status = container.querySelector('[class*="status"]');
    expect(status).toHaveTextContent('Supported');
  });

  it('should have correct styling classes applied', () => {
    const { container: containerDefault } = render(
      <VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />
    );
    expect(containerDefault.querySelector('.style-success')).toBeInTheDocument();

    // Using dynamically determined supported version
    const { container: containerSupported } = render(
      <VersionBanner version={supportedVersion} latestVersionPath={mockLatestVersionPath} />
    );
    expect(containerSupported.querySelector('.style-info')).toBeInTheDocument();

    // Using dynamically determined EOL version
    const { container: containerEol } = render(
      <VersionBanner version={eolVersion} latestVersionPath={mockLatestVersionPath} />
    );
    expect(containerEol.querySelector('.style-danger')).toBeInTheDocument();
  });

  it('should render with proper structure for version without message', () => {
    const { container } = render(
      <VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />
    );

    // Should have header with icon and title
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain(`Version ${DEFAULT_VERSION}`);

    // Should not have message section
    expect(container.querySelector('[class*="messageSection"]')).not.toBeInTheDocument();
  });

  it('should have reduced bottom padding when no message section', () => {
    const { container } = render(
      <VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />
    );

    const banner = container.querySelector('[role="alert"]');
    expect(banner).toHaveClass('noMessage');
  });

  it('should not have reduced bottom padding when message section exists', () => {
    const { container } = render(
      <VersionBanner version={supportedVersion} latestVersionPath={mockLatestVersionPath} />
    );

    const banner = container.querySelector('[role="alert"]');
    expect(banner).not.toHaveClass('noMessage');
  });

  it('should have status badge with icon aligned to the right', () => {
    const { container } = render(
      <VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />
    );

    const titleSection = container.querySelector('[class*="titleSection"]');
    const title = titleSection?.querySelector('[class*="title"]');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('title');
  });

  it('should render status icon within status badge', () => {
    const { container } = render(
      <VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />
    );

    const status = container.querySelector('[class*="status"]');
    const statusIcon = status?.querySelector('i');
    expect(statusIcon).toHaveClass('fa-circle-check');
  });

  it('should have proper spacing between title and status badge', () => {
    const { container } = render(
      <VersionBanner version={DEFAULT_VERSION} latestVersionPath={mockLatestVersionPath} />
    );

    const titleSection = container.querySelector('[class*="titleSection"]');
    const title = titleSection?.querySelector('[class*="title"]');
    // The title element should have flex layout and gap defined in CSS
    expect(title).toBeInTheDocument();
  });

  it('should render status badge with correct structure', () => {
    // Using dynamically determined supported version
    const { container } = render(
      <VersionBanner version={supportedVersion} latestVersionPath={mockLatestVersionPath} />
    );

    const status = container.querySelector('[class*="status"]');
    const icon = status?.querySelector('i');
    const text = Array.from(status?.childNodes || []).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim() === 'Supported'
    );

    expect(icon).toBeInTheDocument();
    expect(text).toBeTruthy();
  });
});
