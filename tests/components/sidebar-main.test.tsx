import React from 'react';
import '@testing-library/jest-dom';
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

  it('should render navigation items', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" />);

    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Developer Guides')).toBeInTheDocument();
  });

  it('should render toggle buttons for items with children', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" />);

    const toggles = screen.getAllByRole('button');
    expect(toggles.length).toBeGreaterThan(0);
  });

  it('should expand/collapse children on toggle click', async () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" />);

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

    render(<Sidebar navTree={activeTree} currentSlug="/en/6/getting_started/installation/" />);

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

    render(<Sidebar navTree={activeTree} currentSlug="/en/6/getting_started/" />);

    const activeLink = screen.getByText('Getting Started');
    expect(activeLink).toHaveClass('active');
  });





  it('should render links with correct href', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/en/6/getting_started/');
    expect(links[1]).toHaveAttribute('href', '/en/6/developer_guides/');
  });

  it('should handle empty nav tree', () => {
    render(<Sidebar navTree={[]} currentSlug="/en/6/" />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav.querySelector('li')).not.toBeInTheDocument();
  });

  it('should not render toggle for items without children', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" />);

    const devGuidesLink = screen.getByText('Developer Guides');
    const parent = devGuidesLink.closest('li');
    
    // Should have spacer instead of toggle (just verify no button for items without children)
    const toggle = parent?.querySelector('button');
    expect(toggle).not.toBeInTheDocument();
  });

  it('should render nested items with correct depth classes - auto-expanded only', () => {
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
                isActive: true,
                hasVisibleChildren: false,
                children: [],
              },
            ],
          },
        ],
      },
    ];

    render(<Sidebar navTree={deepTree} currentSlug="/en/6/level1/level2/level3/" />);

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

    render(<Sidebar navTree={autoExpandTree} currentSlug="/en/6/parent/active_child/" />);

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
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/" />);

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
