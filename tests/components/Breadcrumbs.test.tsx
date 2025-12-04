import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NavNode } from '@/types/types';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => (
    <a href={href}>{children}</a>
  );
});

describe('Breadcrumbs', () => {
  const mockNavTree: NavNode[] = [
    {
      slug: '/en/6/01_getting_started/',
      title: 'Getting Started',
      isIndex: false,
      isActive: false,
      hasVisibleChildren: true,
      children: [
        {
          slug: '/en/6/01_getting_started/01_installation/',
          title: 'Installation',
          isIndex: false,
          isActive: false,
          hasVisibleChildren: false,
          children: [],
        },
        {
          slug: '/en/6/01_getting_started/02_configuration/',
          title: 'Configuration',
          isIndex: false,
          isActive: false,
          hasVisibleChildren: true,
          children: [
            {
              slug: '/en/6/01_getting_started/02_configuration/01_basic/',
              title: 'Basic Setup',
              isIndex: false,
              isActive: false,
              hasVisibleChildren: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      slug: '/en/6/02_developer_guides/',
      title: 'Developer Guides',
      isIndex: false,
      isActive: false,
      hasVisibleChildren: false,
      children: [],
    },
  ];

  describe('rendering', () => {
    it('should render only Home (non-link) on home page', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const home = screen.getByText('Home');
      expect(home).toBeInTheDocument();
      expect(home.tagName).toBe('SPAN');
      expect(container.querySelector('a')).not.toBeInTheDocument();
    });

    it('should not show Home link for single level breadcrumb', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/"
          version="6"
          navTree={mockNavTree}
        />
      );

      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      const links = screen.queryAllByRole('link');
      expect(links.length).toBe(0);
    });

    it('should render nested breadcrumbs without Home link', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/01_installation/"
          version="6"
          navTree={mockNavTree}
        />
      );

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      expect(screen.getByText('Installation')).toBeInTheDocument();
    });

    it('should render deeply nested breadcrumbs without Home link', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/02_configuration/01_basic/"
          version="6"
          navTree={mockNavTree}
        />
      );

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      expect(screen.getByText('Configuration')).toBeInTheDocument();
      expect(screen.getByText('Basic Setup')).toBeInTheDocument();
    });

    it('should render separators between breadcrumbs', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/01_installation/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const separators = container.querySelectorAll('span');
      const separatorElements = Array.from(separators).filter(
        (el) => el.textContent === '/'
      );

      expect(separatorElements.length).toBeGreaterThan(0);
    });
  });

  describe('links', () => {
    it('should not have any links for single level (non-Home) breadcrumbs', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const links = screen.queryAllByRole('link');
      expect(links.length).toBe(0);
    });

    it('should not have links when on Home page', () => {
      render(
        <Breadcrumbs
          slug="/en/6/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const links = screen.queryAllByRole('link');
      expect(links.length).toBe(0);
    });

    it('should not make non-current breadcrumbs clickable when only one level deep', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const links = screen.queryAllByRole('link');
      expect(links.length).toBe(0);
    });

    it('should not make current breadcrumb a link', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/01_installation/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const currentBreadcrumb = screen.getByText('Installation');
      expect(currentBreadcrumb.tagName).not.toBe('A');
    });
  });

  describe('accessibility', () => {
    it('should have breadcrumb navigation landmark', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const nav = container.querySelector('nav[aria-label="Breadcrumb"]');
      expect(nav).toBeInTheDocument();
    });

    it('should use ordered list for breadcrumbs', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const ol = container.querySelector('ol');
      expect(ol).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty nav tree gracefully when not on home page', () => {
      render(
        <Breadcrumbs
          slug="/en/6/some-page/"
          version="6"
          navTree={[]}
        />
      );

      // Should not show Home when not on home page
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('should show Home when on home page with empty nav tree', () => {
      render(
        <Breadcrumbs
          slug="/en/6/"
          version="6"
          navTree={[]}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should use version from props to build home page', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const home = screen.getByText('Home');
      expect(home).toBeInTheDocument();
      // Home should be a span when on home page, not a link
      expect(home.tagName).toBe('SPAN');
    });

    it('should handle unknown slug paths without Home link', () => {
      render(
        <Breadcrumbs
          slug="/en/6/unknown/path/"
          version="6"
          navTree={mockNavTree}
        />
      );

      // Should not render Home when not on home page
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('should return null when no breadcrumbs available (non-home, no nav nodes)', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/unknown-page/"
          version="6"
          navTree={[]}
        />
      );

      // Should not render anything when there are no breadcrumbs and not on home
      const nav = container.querySelector('nav[aria-label="Breadcrumb"]');
      expect(nav).not.toBeInTheDocument();
    });
  });

  describe('with optional features', () => {
    const optionalFeatureNavTree: NavNode[] = [
      {
        slug: '/en/6/optional_features/',
        title: 'Optional Features',
        isIndex: false,
        isActive: false,
        hasVisibleChildren: true,
        children: [
          {
            slug: '/en/6/optional_features/linkfield/',
            title: 'Link Field',
            isIndex: true,
            isActive: false,
            hasVisibleChildren: true,
            children: [
              {
                slug: '/en/6/optional_features/linkfield/01_usage/',
                title: 'Usage',
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

    it('should render breadcrumbs for optional features without Home link', () => {
      render(
        <Breadcrumbs
          slug="/en/6/optional_features/linkfield/01_usage/"
          version="6"
          navTree={optionalFeatureNavTree}
        />
      );

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.getByText('Optional Features')).toBeInTheDocument();
      expect(screen.getByText('Link Field')).toBeInTheDocument();
      expect(screen.getByText('Usage')).toBeInTheDocument();
    });
  });

  describe('styling classes', () => {
    it('should apply correct CSS classes', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/01_installation/"
          version="6"
          navTree={mockNavTree}
        />
      );

      expect(container.querySelector('.breadcrumbs')).toBeInTheDocument();
      expect(container.querySelector('.list')).toBeInTheDocument();
      expect(container.querySelectorAll('.item').length).toBeGreaterThan(0);
      expect(container.querySelector('.current')).toBeInTheDocument();
    });

    it('should apply link class to non-current breadcrumbs when deeply nested', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/02_configuration/01_basic/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const links = container.querySelectorAll('a[href]');
      expect(links.length).toBeGreaterThan(0);
    });

    it('should apply current class to current breadcrumb', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/01_installation/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const breadcrumbsList = container.querySelector('ol');
      const items = breadcrumbsList?.querySelectorAll('li');
      const lastItem = items?.[items.length - 1];
      const currentElement = lastItem?.querySelector('span');
      
      expect(currentElement).toBeInTheDocument();
      expect(currentElement).toHaveTextContent('Installation');
    });

    it('should apply separator class between nested breadcrumbs', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/02_configuration/01_basic/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const breadcrumbsList = container.querySelector('ol');
      const separatorSpans = breadcrumbsList?.querySelectorAll('span');
      const separators = Array.from(separatorSpans || []).filter(span => span.textContent === '/');
      
      expect(separators.length).toBeGreaterThan(0);
      separators.forEach((separator) => {
        expect(separator).toHaveTextContent('/');
      });
    });

    it('should not have separators when only Home is shown', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const breadcrumbsList = container.querySelector('ol');
      const separatorSpans = breadcrumbsList?.querySelectorAll('span');
      const separators = Array.from(separatorSpans || []).filter(span => span.textContent === '/');
      
      expect(separators.length).toBe(0);
    });
  });
});
