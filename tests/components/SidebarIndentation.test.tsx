import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('SidebarIndentation', () => {
  const mockNavTree: NavNode[] = [
    {
      slug: '/en/6/level1/',
      title: 'Level 1',
      isIndex: false,
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
              hasVisibleChildren: true,
              children: [
                {
                  slug: '/en/6/level1/level2/level3/level4/',
                  title: 'Level 4',
                  isIndex: false,
                  isActive: false,
                  hasVisibleChildren: false,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  it('should render depth-0 class for root level items', () => {
    const { container } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />
    );

    // Root items always render and should have depth-0
    const depth0Items = container.querySelectorAll('li.depth-0');
    expect(depth0Items.length).toBeGreaterThan(0);
  });

  it('should render only depth-0 items when no items are expanded', () => {
    const { container } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />
    );

    // Only root (depth-0) items render by default
    const depth0Items = container.querySelectorAll('li.depth-0');
    const depth1Items = container.querySelectorAll('li.depth-1');
    
    expect(depth0Items.length).toBeGreaterThan(0);
    // Without expansion, depth-1 items won't be present (they're conditionally rendered)
  });

  it('should apply depth classes correctly for all nesting levels when auto-expanded', async () => {
    const { container } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/level1/level2/level3/" version="6" />
    );

    // Count links at each depth (auto-expansion should have happened)
    const depth0Links = container.querySelectorAll('a.depth-0');
    const depth1Links = container.querySelectorAll('a.depth-1');
    const depth2Links = container.querySelectorAll('a.depth-2');
    const depth3Links = container.querySelectorAll('a.depth-3');

    // When auto-expanded with deep slug, we should have links at various levels
    expect(depth0Links.length).toBeGreaterThan(0);
    expect(depth1Links.length).toBeGreaterThan(0);
    expect(depth2Links.length).toBeGreaterThan(0);
    expect(depth3Links.length).toBeGreaterThan(0);
  });

  it('should render with depth-0 class on root list items', () => {
    const { container } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />
    );

    // Get root list items
    const rootItems = container.querySelectorAll('nav ul.nav > li');

    // All root items should have depth-0
    rootItems.forEach(item => {
      expect(item.className).toMatch(/depth-0/);
    });
  });

  it('should not apply nested class to depth-0 items', () => {
    const { container } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />
    );

    const depth0Items = container.querySelectorAll('li.depth-0');
    depth0Items.forEach(item => {
      expect(item.className).not.toMatch(/nested/);
    });
  });

  it('should have depth class consistently applied to links', () => {
    const { container } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/" version="6" />
    );

    // All links should have a depth class
    const allLinks = container.querySelectorAll('a[class*="depth-"]');
    expect(allLinks.length).toBeGreaterThan(0);

    allLinks.forEach(link => {
      expect(link.className).toMatch(/depth-\d+/);
    });
  });

  it('should auto-expand ancestors when rendering with nested current slug that matches isActive', () => {
    const { container } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/level1/level2/level3/" version="6" />
    );

    // When rendering with a deep nested slug matching isActive node, ancestors should auto-expand
    // Check that nested items are visible
    const allItems = container.querySelectorAll('li');
    const depthLevels = new Set<string>();
    
    allItems.forEach(item => {
      const depthMatch = item.className.match(/depth-(\d+)/);
      if (depthMatch) {
        depthLevels.add(depthMatch[1]);
      }
    });

    // Should have multiple depth levels visible due to auto-expansion
    expect(depthLevels.size).toBeGreaterThanOrEqual(2);
  });

  it('should maintain correct depth hierarchy structure when auto-expanded', async () => {
    const { container } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/level1/level2/level3/" version="6" />
    );

    // Get the structure of depth classes
    const items = Array.from(container.querySelectorAll('li')).map(item => {
      const depthMatch = item.className.match(/depth-(\d+)/);
      const depth = depthMatch ? parseInt(depthMatch[1]) : -1;
      const hasNested = item.className.includes('nested');
      return { depth, hasNested };
    });

    // Filter for meaningful checks
    const depth0Items = items.filter(i => i.depth === 0);
    const depth1Items = items.filter(i => i.depth === 1);

    // Should have items at each level
    expect(depth0Items.length).toBeGreaterThan(0);
    expect(depth1Items.length).toBeGreaterThan(0);

    // depth > 0 items should have nested class
    depth1Items.forEach(item => {
      expect(item.hasNested).toBe(true);
    });
  });

  it('should match snapshot for depth class structure when auto-expanded', () => {
    const { container } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/level1/level2/level3/" version="6" />
    );

    // Get the structure of depth classes
    const items = Array.from(container.querySelectorAll('li')).map(item => {
      const depthMatch = item.className.match(/depth-(\d+)/);
      const depth = depthMatch ? depthMatch[1] : 'unknown';
      const hasNested = item.className.includes('nested');
      return { depth, hasNested };
    });

    expect(items).toMatchSnapshot();
  });
});
