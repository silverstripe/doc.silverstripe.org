import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Sidebar } from '@/components/Sidebar';
import { NavNode } from '@/types';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => (
    <a href={href} className={className} onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
});

describe('Sidebar', () => {
  const mockNavTree: NavNode[] = [
    {
      slug: '/en/6/getting-started/',
      title: 'Getting Started',
      isIndex: true,
      isActive: false,
      hasVisibleChildren: true,
      children: [
        {
          slug: '/en/6/getting-started/installation/',
          title: 'Installation',
          isIndex: false,
          isActive: false,
          hasVisibleChildren: false,
          children: [],
        },
      ],
    },
    {
      slug: '/en/6/developer-guides/',
      title: 'Developer Guides',
      isIndex: true,
      isActive: false,
      hasVisibleChildren: false,
      children: [],
    },
  ];

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render navigation items', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Developer Guides')).toBeInTheDocument();
  });

  it('should render toggle buttons for items with children', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    const toggles = screen.getAllByRole('button');
    expect(toggles.length).toBeGreaterThan(0);
  });

  it('should expand/collapse children on toggle click', async () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    // Installation should not be visible initially (not expanded)
    let installation = screen.queryByText('Installation');
    expect(installation).not.toBeInTheDocument();

    // Click the toggle
    const toggles = screen.getAllByRole('button');
    fireEvent.click(toggles[0]);

    // Installation should now be visible
    await waitFor(() => {
      installation = screen.getByText('Installation');
      expect(installation).toBeInTheDocument();
    });
  });

  it('should auto-expand parent of active page', async () => {
    const activeTree: NavNode[] = [
      {
        slug: '/en/6/getting-started/',
        title: 'Getting Started',
        isIndex: true,
        isActive: false,
        hasVisibleChildren: true,
        children: [
          {
            slug: '/en/6/getting-started/installation/',
            title: 'Installation',
            isIndex: false,
            isActive: true,
            hasVisibleChildren: false,
            children: [],
          },
        ],
      },
    ];

    render(<Sidebar navTree={activeTree} currentSlug="/en/6/getting-started/installation/" version="6" />);

    // Installation should be visible because parent is auto-expanded
    await waitFor(() => {
      expect(screen.getByText('Installation')).toBeInTheDocument();
    });
  });

  it('should mark active page with active class', async () => {
    const activeTree: NavNode[] = [
      {
        slug: '/en/6/getting-started/',
        title: 'Getting Started',
        isIndex: true,
        isActive: true,
        hasVisibleChildren: false,
        children: [],
      },
    ];

    render(<Sidebar navTree={activeTree} currentSlug="/en/6/getting-started/" version="6" />);

    const activeLink = screen.getByText('Getting Started');
    expect(activeLink).toHaveClass('active');
  });

  it('should persist expanded state to localStorage', async () => {
    const { rerender } = render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    // Expand first item
    const toggles = screen.getAllByRole('button');
    fireEvent.click(toggles[0]);

    // Check localStorage was updated
    await waitFor(() => {
      const stored = localStorage.getItem('sidebar_state_v6');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored || '[]');
      expect(parsed).toContain('/en/6/getting-started/');
    });

    // Rerender and verify it's still expanded
    rerender(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    await waitFor(() => {
      expect(screen.getByText('Installation')).toBeInTheDocument();
    });
  });

  it('should use version-specific localStorage key', async () => {
    const { rerender } = render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    // Expand first item
    let toggles = screen.getAllByRole('button');
    fireEvent.click(toggles[0]);

    await waitFor(() => {
      const stored = localStorage.getItem('sidebar_state_v6');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored || '[]');
      expect(parsed.length).toBeGreaterThan(0);
    });

    // Switch to v5 and verify separate storage
    const v5Tree: NavNode[] = [
      {
        slug: '/en/5/getting-started/',
        title: 'Getting Started v5',
        isIndex: true,
        isActive: false,
        hasVisibleChildren: true,
        children: [
          {
            slug: '/en/5/getting-started/setup/',
            title: 'Setup',
            isIndex: false,
            isActive: false,
            hasVisibleChildren: false,
            children: [],
          },
        ],
      },
    ];

    rerender(<Sidebar navTree={v5Tree} currentSlug="/en/5/" version="5" />);

    // v5 should not have anything expanded initially (empty array in localStorage)
    expect(screen.queryByText('Setup')).not.toBeInTheDocument();
    const v5Stored = localStorage.getItem('sidebar_state_v5');
    expect(v5Stored).toBe('[]'); // Empty array since nothing was toggled
  });

  it('should render links with correct href', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/en/6/getting-started/');
    expect(links[1]).toHaveAttribute('href', '/en/6/developer-guides/');
  });

  it('should handle empty nav tree', () => {
    render(<Sidebar navTree={[]} currentSlug="/en/6/" version="6" />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav.querySelector('li')).not.toBeInTheDocument();
  });

  it('should not render toggle for items without children', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    const devGuidesLink = screen.getByText('Developer Guides');
    const parent = devGuidesLink.closest('li');
    
    // Should have spacer instead of toggle (just verify no button for items without children)
    const toggle = parent?.querySelector('button');
    expect(toggle).not.toBeInTheDocument();
  });
});
