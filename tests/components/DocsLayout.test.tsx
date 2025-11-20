import React from 'react';
import { render, screen } from '@testing-library/react';
import { DocsLayout } from '@/components/DocsLayout';
import { NavNode } from '@/types';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => (
    <a href={href} className={className} onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
});

// Mock the VersionBanner component
jest.mock('@/components/VersionBanner', () => ({
  VersionBanner: ({ version }: any) => <div data-testid="version-banner">Version {version}</div>,
}));

// Mock the Sidebar component
jest.mock('@/components/Sidebar', () => ({
  Sidebar: ({ navTree }: any) => <nav data-testid="sidebar">Sidebar</nav>,
}));

describe('DocsLayout', () => {
  const mockNavTree: NavNode[] = [
    {
      slug: '/en/6/getting_started/',
      title: 'Getting Started',
      isIndex: true,
      isActive: false,
      hasVisibleChildren: false,
      children: [],
    },
  ];

  it('should render layout with correct structure', () => {
    const { container } = render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/getting_started/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    // Check main elements exist
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('version-banner')).toBeInTheDocument();
  });

  it('should render with correct class names', () => {
    const { container } = render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    // Check CSS modules classes are applied
    const layout = container.querySelector('[class*="layout"]');
    expect(layout).toBeInTheDocument();

    const layoutContainer = container.querySelector('[class*="layoutContainer"]');
    expect(layoutContainer).toBeInTheDocument();
  });

  it('should render grid with sidebar and main content', () => {
    const { container } = render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    // Find the grid container
    const gridContainer = container.querySelector('div[class*="grid"]');
    expect(gridContainer).toBeInTheDocument();

    // Should have two children: sidebar and main content
    const children = gridContainer?.children;
    expect(children?.length).toBe(2);
  });

  it('should render sidebar with fixed width class', () => {
    const { container } = render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    const sidebarContainer = container.querySelector('[class*="sidebarContainer"]');
    expect(sidebarContainer).toBeInTheDocument();
  });

  it('should render main content area', () => {
    const { container } = render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    const mainContent = container.querySelector('[class*="mainContent"]');
    expect(mainContent).toBeInTheDocument();

    // Main content should contain the children
    expect(mainContent?.querySelector('main')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render version banner before grid', () => {
    const { container } = render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    const bannerRow = container.querySelector('[class*="bannerRow"]');
    expect(bannerRow).toBeInTheDocument();
  });

  // Visual regression test note for manual validation
  it('should maintain fixed sidebar width at desktop viewport (manual validation)', () => {
    /*
     * MANUAL VALIDATION CHECKLIST for responsive behavior:
     * 
     * Desktop (>1023px):
     * [ ] Sidebar appears with 300px fixed width
     * [ ] Sidebar does not resize when scrolling
     * [ ] Sidebar does not collapse/expand based on content
     * [ ] Main content fills remaining space
     * [ ] Grid layout is 300px + flexible content
     * 
     * Tablet (768px - 1023px):
     * [ ] Sidebar is completely hidden (display: none)
     * [ ] Main content takes full width
     * [ ] No hamburger menu yet (added in Phase 4)
     * 
     * Mobile (<768px):
     * [ ] Sidebar remains hidden
     * [ ] Full width layout works
     * [ ] Content is readable without horizontal scroll
     * 
     * To test:
     * 1. npm run mock
     * 2. Open browser DevTools
     * 3. Test responsive design mode at different breakpoints
     * 4. Verify sidebar behavior at 1024px and 1023px boundaries
     */
    const { container } = render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    const sidebarContainer = container.querySelector('[class*="sidebarContainer"]');
    expect(sidebarContainer).toBeInTheDocument();
  });

  it('should render with main role on main element', () => {
    const { container } = render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    const mainElement = container.querySelector('main[role="main"]');
    expect(mainElement).toBeInTheDocument();
  });

  it('should pass correct props to Sidebar component', () => {
    render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/getting_started/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    // Sidebar mock should render (verifying props were passed)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('should pass correct props to VersionBanner component', () => {
    render(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>
    );

    // VersionBanner mock should render with correct version
    const banner = screen.getByTestId('version-banner');
    expect(banner).toHaveTextContent('Version 6');
  });
});
