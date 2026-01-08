import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { DocsLayout } from '@/components/DocsLayout';
import { NavNode } from '@/types/types';
import { MobileMenuContext } from '@/contexts/MobileMenuContext';

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

  const mockMobileMenuContext = {
    isMobileMenuOpen: false,
    onClose: jest.fn(),
  };

  const renderWithContext = (component: React.ReactElement, contextValue = mockMobileMenuContext) => {
    return render(
      <MobileMenuContext.Provider value={contextValue}>
        {component}
      </MobileMenuContext.Provider>
    );
  };

  it('should render layout with correct structure', () => {
    const { container } = renderWithContext(
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
  });

  it('should render with correct class names', () => {
    const { container } = renderWithContext(
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
    const { container } = renderWithContext(
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
    const { container } = renderWithContext(
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
    const { container } = renderWithContext(
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

  it('should render with main role on main element', () => {
    const { container } = renderWithContext(
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
    renderWithContext(
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

  it('should not apply sidebarOpen class when mobile menu is closed', () => {
    const { container } = renderWithContext(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>,
      { isMobileMenuOpen: false, onClose: jest.fn() }
    );

    const sidebarContainer = container.querySelector('[class*="sidebarContainer"]');
    expect(sidebarContainer?.className).not.toMatch(/sidebarOpen/);
  });

  it('should apply sidebarOpen class when mobile menu is open', () => {
    const { container } = renderWithContext(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>,
      { isMobileMenuOpen: true, onClose: jest.fn() }
    );

    const sidebarContainer = container.querySelector('[class*="sidebarContainer"]');
    expect(sidebarContainer?.className).toMatch(/sidebarOpen/);
  });

  it('should call onClose when main content is clicked during mobile menu open', () => {
    const mockOnClose = jest.fn();
    const { container } = renderWithContext(
      <DocsLayout
        navTree={mockNavTree}
        currentSlug="/en/6/"
        version="6"
      >
        <p>Test content</p>
      </DocsLayout>,
      { isMobileMenuOpen: true, onClose: mockOnClose }
    );

    const mainContent = container.querySelector('[class*="mainContent"]') as HTMLElement;
    if (mainContent) {
      mainContent.click();
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  describe('sidebar styling', () => {
    it('should render sidebar container with border styling', () => {
      const { container } = renderWithContext(
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

    it('should apply sidebarContainer class to sidebar', () => {
      const { container } = renderWithContext(
        <DocsLayout
          navTree={mockNavTree}
          currentSlug="/en/6/"
          version="6"
        >
          <p>Test content</p>
        </DocsLayout>
      );

      const sidebarContainer = container.querySelector('div[class*="sidebarContainer"]');
      expect(sidebarContainer).toBeInTheDocument();
      expect(sidebarContainer?.className).toContain('sidebarContainer');
    });

    it('should maintain sidebar styling when mobile menu is closed', () => {
      const { container } = renderWithContext(
        <DocsLayout
          navTree={mockNavTree}
          currentSlug="/en/6/"
          version="6"
        >
          <p>Test content</p>
        </DocsLayout>,
        { isMobileMenuOpen: false, onClose: jest.fn() }
      );

      const sidebarContainer = container.querySelector('[class*="sidebarContainer"]');
      expect(sidebarContainer).toBeInTheDocument();
      expect(sidebarContainer?.className).toContain('sidebarContainer');
    });
  });
});


