import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
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

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/en/6/'),
}));

// Mock components with external dependencies
jest.mock('@/components/SearchBox', () => ({
  SearchBox: () => <div data-testid="search-box">SearchBox</div>,
}));

jest.mock('@/components/Github', () => ({
  Github: () => <a data-testid="github-link" href="#">GitHub</a>,
}));

jest.mock('@/components/DarkModeToggle', () => ({
  DarkModeToggle: () => <div data-testid="dark-mode-toggle">DarkModeToggle</div>,
}));

describe('Sidebar', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/en/6/');
  });

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

  it('should render navigation items', () => {
    render(<Sidebar navTree={mockNavTree} />);

    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Developer Guides')).toBeInTheDocument();
  });

  it('should render toggle buttons for items with children', () => {
    render(<Sidebar navTree={mockNavTree} />);

    const toggles = screen.getAllByRole('button');
    expect(toggles.length).toBeGreaterThan(0);
  });

  it('should expand/collapse children on toggle click', async () => {
    render(<Sidebar navTree={mockNavTree} />);

    // Installation should not be visible initially (not in ancestors)
    let installation = screen.queryByText('Installation');
    expect(installation).not.toBeInTheDocument();

    // Click the toggle to expand
    const toggles = screen.getAllByRole('button');
    fireEvent.click(toggles[0]);

    // Installation should now be visible
    await waitFor(() => {
      installation = screen.getByText('Installation');
      expect(installation).toBeInTheDocument();
    });
  });

  it('should auto-expand parent of active page', async () => {
    (usePathname as jest.Mock).mockReturnValue('/en/6/getting_started/installation/');
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
            isActive: false,
            hasVisibleChildren: false,
            children: [],
          },
        ],
      },
    ];

    render(<Sidebar navTree={activeTree} />);

    // Installation should be visible because parent is auto-expanded
    await waitFor(() => {
      expect(screen.getByText('Installation')).toBeInTheDocument();
    });
  });

  it('should mark active page with active class', async () => {
    (usePathname as jest.Mock).mockReturnValue('/en/6/getting_started/');
    const activeTree: NavNode[] = [
      {
        slug: '/en/6/getting_started/',
        title: 'Getting Started',
        isIndex: true,
        isActive: false,
        hasVisibleChildren: false,
        children: [],
      },
    ];

    render(<Sidebar navTree={activeTree} />);

    const activeLink = screen.getByText('Getting Started');
    expect(activeLink).toHaveClass('active');
  });

  it('should render links with correct href', () => {
    render(<Sidebar navTree={mockNavTree} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/en/6/getting_started/');
    expect(links[1]).toHaveAttribute('href', '/en/6/developer_guides/');
  });

  it('should handle empty nav tree', () => {
    render(<Sidebar navTree={[]} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav.querySelector('li')).not.toBeInTheDocument();
  });

  it('should not render toggle for items without children', () => {
    render(<Sidebar navTree={mockNavTree} />);

    const devGuidesLink = screen.getByText('Developer Guides');
    const parent = devGuidesLink.closest('li');

    // Should have spacer instead of toggle (just verify no button for items without children)
    const toggle = parent?.querySelector('button');
    expect(toggle).not.toBeInTheDocument();
  });

  it('should render nested items with correct depth classes - auto-expanded only', () => {
    (usePathname as jest.Mock).mockReturnValue('/en/6/level1/level2/level3/');
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

    render(<Sidebar navTree={deepTree} />);

    // Level 2 and 3 should be auto-expanded (ancestors of active node)
    expect(screen.getByText('Level 2')).toBeInTheDocument();
    expect(screen.getByText('Level 3')).toBeInTheDocument();

    // Verify level 2 li has nested class for proper indentation
    const level2Link = screen.getByText('Level 2');
    const level2Li = level2Link.closest('li');
    expect(level2Li).toHaveClass('nested');

    // Verify level 3 li has nested class
    const level3Link = screen.getByText('Level 3');
    const level3Li = level3Link.closest('li');
    expect(level3Li).toHaveClass('nested');
  });

  it('should not apply animation class on initial mount for expanded items', async () => {
    (usePathname as jest.Mock).mockReturnValue('/en/6/parent/active_child/');
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
            isActive: false,
            hasVisibleChildren: false,
            children: [],
          },
        ],
      },
    ];

    render(<Sidebar navTree={autoExpandTree} />);

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
    render(<Sidebar navTree={mockNavTree} />);

    const toggles = screen.getAllByRole('button');
    const baseToggle = toggles[0];

    // Base level toggle should not have depth classes
    expect(baseToggle).toHaveClass('navToggle');
    expect(baseToggle).not.toHaveClass('depth1');

    // Base level li should not have nested class
    const baseLi = baseToggle.closest('li');
    expect(baseLi).not.toHaveClass('nested');
  });
});
