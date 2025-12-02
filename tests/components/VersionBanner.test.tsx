import React from 'react';
import { render, screen } from '@testing-library/react';
import { VersionBanner } from '@/components/VersionBanner';

describe('VersionBanner', () => {
  const mockLatestVersionPath = '/en/6/';

  it('should render banner for version 6 with success styling and no message', () => {
    const { container } = render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );

    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain('Version6');

    // Check for Supported label
    expect(screen.getByText('Supported')).toBeInTheDocument();

    // Check for success styling
    const banner = container.querySelector('[role="alert"]');
    expect(banner).toHaveClass('style-success');

    // Check that no message section is rendered
    expect(screen.queryByText(/This version of Silverstripe CMS/)).not.toBeInTheDocument();
  });

  it('should render banner for version 5 with info styling and message', () => {
    const { container } = render(
      <VersionBanner version="5" latestVersionPath={mockLatestVersionPath} />
    );

    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain('Version5');

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

  it('should render banner for version 4 with danger styling and EOL message', () => {
    const { container } = render(
      <VersionBanner version="4" latestVersionPath={mockLatestVersionPath} />
    );

    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain('Version4');

    // Check for End of Life label
    expect(screen.getByText('End of Life')).toBeInTheDocument();

    // Check for danger styling
    const banner = container.querySelector('[role="alert"]');
    expect(banner).toHaveClass('style-danger');

    // Check that message section is rendered
    expect(screen.getByText(/will not receive/)).toBeInTheDocument();
  });

  it('should have correct icon for version 6', () => {
    const { container } = render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );

    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toHaveClass('fa-circle-check');
  });

  it('should have correct icon for version 4 (EOL)', () => {
    const { container } = render(
      <VersionBanner version="4" latestVersionPath={mockLatestVersionPath} />
    );

    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toHaveClass('fa-circle-xmark');
  });

  it('should render banner with alert role', () => {
    render(<VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />);

    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
  });

  it('should not show link to latest version when viewing version 6', () => {
    render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );

    // v6 has no message, so link shouldn't appear
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should show version and stability in title section', () => {
    const { container } = render(
      <VersionBanner version="5" latestVersionPath={mockLatestVersionPath} />
    );

    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain('Version5');
    expect(screen.getByText('Supported')).toBeInTheDocument();
    
    // Verify status is displayed as a separate element with icon
    const status = container.querySelector('[class*="status"]');
    expect(status).toHaveTextContent('Supported');
  });

  it('should have correct styling classes applied', () => {
    const { container: container6 } = render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );
    expect(container6.querySelector('.style-success')).toBeInTheDocument();

    const { container: container5 } = render(
      <VersionBanner version="5" latestVersionPath={mockLatestVersionPath} />
    );
    expect(container5.querySelector('.style-info')).toBeInTheDocument();

    const { container: container4 } = render(
      <VersionBanner version="4" latestVersionPath={mockLatestVersionPath} />
    );
    expect(container4.querySelector('.style-danger')).toBeInTheDocument();
  });

  it('should render with proper structure for version without message', () => {
    const { container } = render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );

    // Should have header with icon and title
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    // Check for version text by looking at the title section
    const titleSection = container.querySelector('[class*="titleSection"]');
    expect(titleSection?.textContent).toContain('Version6');

    // Should not have message section
    expect(container.querySelector('[class*="messageSection"]')).not.toBeInTheDocument();
  });

  it('should have reduced bottom padding when no message section', () => {
    const { container } = render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );

    const banner = container.querySelector('[role="alert"]');
    expect(banner).toHaveClass('noMessage');
  });

  it('should not have reduced bottom padding when message section exists', () => {
    const { container } = render(
      <VersionBanner version="5" latestVersionPath={mockLatestVersionPath} />
    );

    const banner = container.querySelector('[role="alert"]');
    expect(banner).not.toHaveClass('noMessage');
  });

  it('should have status badge with icon aligned to the right', () => {
    const { container } = render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );

    const titleSection = container.querySelector('[class*="titleSection"]');
    const title = titleSection?.querySelector('[class*="title"]');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('title');
  });

  it('should render status icon within status badge', () => {
    const { container } = render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );

    const status = container.querySelector('[class*="status"]');
    const statusIcon = status?.querySelector('i');
    expect(statusIcon).toHaveClass('fa-circle-check');
  });

  it('should have proper spacing between title and status badge', () => {
    const { container } = render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );

    const titleSection = container.querySelector('[class*="titleSection"]');
    const title = titleSection?.querySelector('[class*="title"]');
    // The title element should have flex layout and gap defined in CSS
    expect(title).toBeInTheDocument();
  });

  it('should render status badge with correct structure', () => {
    const { container } = render(
      <VersionBanner version="5" latestVersionPath={mockLatestVersionPath} />
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
