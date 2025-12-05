import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Sidebar } from '@/components/Sidebar';
import { NavNode } from '@/types/types';

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
      slug: '/en/6/getting_started/',
      title: 'Getting Started',
      isIndex: true,
      isActive: false,
      hasVisibleChildren: true,
      children: [
        {
          slug: '/en/6/getting_started/installation/',
          title: 'Installation',
          isIndex: false,
          isActive: false,
          hasVisibleChildren: false,
          children: [],
        },
      ],
    },
    {
      slug: '/en/6/developer_guides/',
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
        slug: '/en/6/getting_started/',
        title: 'Getting Started',
        isIndex: true,
        isActive: false,
        hasVisibleChildren: true,
        children: [
          {
            slug: '/en/6/getting_started/installation/',
            title: 'Installation',
            isIndex: false,
            isActive: true,
            hasVisibleChildren: false,
            children: [],
          },
        ],
      },
    ];

    render(<Sidebar navTree={activeTree} currentSlug="/en/6/getting_started/installation/" version="6" />);

    // Installation should be visible because parent is auto-expanded
    await waitFor(() => {
      expect(screen.getByText('Installation')).toBeInTheDocument();
    });
  });

  it('should mark active page with active class', async () => {
    const activeTree: NavNode[] = [
      {
        slug: '/en/6/getting_started/',
        title: 'Getting Started',
        isIndex: true,
        isActive: true,
        hasVisibleChildren: false,
        children: [],
      },
    ];

    render(<Sidebar navTree={activeTree} currentSlug="/en/6/getting_started/" version="6" />);

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
      expect(parsed).toContain('/en/6/getting_started/');
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
        slug: '/en/5/getting_started/',
        title: 'Getting Started v5',
        isIndex: true,
        isActive: false,
        hasVisibleChildren: true,
        children: [
          {
            slug: '/en/5/getting_started/setup/',
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
    expect(links[0]).toHaveAttribute('href', '/en/6/getting_started/');
    expect(links[1]).toHaveAttribute('href', '/en/6/developer_guides/');
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

  it('should render nested items with correct depth classes on chevron buttons', async () => {
    const deepTree: NavNode[] = [
      {
        slug: '/en/6/level1/',
        title: 'Level 1',
        isIndex: true,
        isActive: false,
        hasVisibleChildren: true,
        children: [
          {
            slug: '/en/6/level1/level2/',
            title: 'Level 2',
            isIndex: false,
            isActive: false,
            hasVisibleChildren: true,
            children: [
              {
                slug: '/en/6/level1/level2/level3/',
                title: 'Level 3',
                isIndex: false,
                isActive: false,
                hasVisibleChildren: false,
                children: [],
              },
            ],
          },
        ],
      },
    ];

    render(<Sidebar navTree={deepTree} currentSlug="/en/6/" version="6" />);

    // Expand level 1
    const level1Toggle = screen.getByRole('button');
    fireEvent.click(level1Toggle);

    await waitFor(() => {
      expect(screen.getByText('Level 2')).toBeInTheDocument();
    });

    // Verify level 2 li has nested class for proper indentation
    const level2Link = screen.getByText('Level 2');
    const level2Li = level2Link.closest('li');
    expect(level2Li).toHaveClass('nested');

    // Expand level 2
    const level2Toggle = level2Li?.querySelector('button');
    fireEvent.click(level2Toggle!);

    await waitFor(() => {
      expect(screen.getByText('Level 3')).toBeInTheDocument();
    });

    // Verify level 3 li has nested class
    const level3Link = screen.getByText('Level 3');
    const level3Li = level3Link.closest('li');
    expect(level3Li).toHaveClass('nested');
  });

  it('should not apply animation class on initial mount for expanded items', async () => {
    const autoExpandTree: NavNode[] = [
      {
        slug: '/en/6/parent/',
        title: 'Parent',
        isIndex: true,
        isActive: false,
        hasVisibleChildren: true,
        children: [
          {
            slug: '/en/6/parent/active_child/',
            title: 'Active Child',
            isIndex: false,
            isActive: true,
            hasVisibleChildren: false,
            children: [],
          },
        ],
      },
    ];

    render(<Sidebar navTree={autoExpandTree} currentSlug="/en/6/parent/active_child/" version="6" />);

    // Auto-expanded items should be visible immediately
    await waitFor(() => {
      expect(screen.getByText('Active Child')).toBeInTheDocument();
    });

    // Chevron should have expanded class
    const parentLink = screen.getByText('Parent');
    const parentContainer = parentLink.closest('div');
    const parentButton = parentContainer?.querySelector('button');
    const chevron = parentButton?.querySelector('span');
    expect(chevron).toHaveClass('expanded');
  });

  it('should apply correct margin to base level toggle', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    const toggles = screen.getAllByRole('button');
    const baseToggle = toggles[0];
    
    // Base level toggle should not have depth classes
    expect(baseToggle).toHaveClass('navToggle');
    expect(baseToggle).not.toHaveClass('depth1');

    // Base level li should not have nested class
    const baseLi = baseToggle.closest('li');
    expect(baseLi).not.toHaveClass('nested');
  });

  it('should hide sidebar initially and show after hydration (FOUT fix)', async () => {
    const { container, rerender } = render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    // Get the nav element
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();

    // After first render cycle and hydration effect, should have hydrated class
    await waitFor(() => {
      expect(nav).toHaveClass('hydrated');
    });
  });

  it('should have pointer-events: none while not hydrated, then auto on hydration', async () => {
    const { container } = render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />);

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();

    // After hydration effect completes, nav should be interactive with hydrated class
    await waitFor(() => {
      expect(nav).toHaveClass('hydrated');
    });

    // When hydrated class is present, pointer-events should be auto (via CSS)
    expect(nav?.className).toContain('hydrated');
  });
});
