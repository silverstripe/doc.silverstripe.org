import React from 'react';
import { render, screen } from '@testing-library/react';
import { VersionBanner } from '@/components/VersionBanner';

describe('VersionBanner', () => {
  const mockLatestVersionPath = '/en/6/';

  it('should render banner for version 6 with success styling and no message', () => {
    const { container } = render(
      <VersionBanner version="6" latestVersionPath={mockLatestVersionPath} />
    );

    // Check for version text
    expect(screen.getByText(/Version 6/)).toBeInTheDocument();

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

    // Check for version text
    expect(screen.getByText(/Version 5/)).toBeInTheDocument();

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

    // Check for version text
    expect(screen.getByText(/Version 4/)).toBeInTheDocument();

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
    expect(icon).toHaveTextContent('✓');
  });

  it('should have correct icon for version 4 (EOL)', () => {
    const { container } = render(
      <VersionBanner version="4" latestVersionPath={mockLatestVersionPath} />
    );

    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toHaveTextContent('✕');
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
    render(
      <VersionBanner version="5" latestVersionPath={mockLatestVersionPath} />
    );

    const title = screen.getByText(/Version 5/);
    expect(title).toBeInTheDocument();
    expect(title.textContent).toContain('Supported');
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
    expect(screen.getByText(/Version 6/)).toBeInTheDocument();

    // Should not have message section
    expect(container.querySelector('[class*="messageSection"]')).not.toBeInTheDocument();
  });

  it('should render with proper structure for version with message', () => {
    const { container } = render(
      <VersionBanner version="5" latestVersionPath={mockLatestVersionPath} />
    );

    // Should have header with icon and title
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByText(/Version 5/)).toBeInTheDocument();

    // Should have message section
    expect(container.querySelector('[class*="messageSection"]')).toBeInTheDocument();
  });
});
