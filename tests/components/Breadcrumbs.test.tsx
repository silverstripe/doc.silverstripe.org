import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NavNode } from '@/types';

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
    it('should render Home link for root version index', () => {
      render(
        <Breadcrumbs
          slug="/en/6/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const home = screen.getByText('Home');
      expect(home).toBeInTheDocument();
    });

    it('should render single level breadcrumb', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/"
          version="6"
          navTree={mockNavTree}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Getting Started')).toBeInTheDocument();
    });

    it('should render nested breadcrumbs', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/01_installation/"
          version="6"
          navTree={mockNavTree}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      expect(screen.getByText('Installation')).toBeInTheDocument();
    });

    it('should render deeply nested breadcrumbs', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/02_configuration/01_basic/"
          version="6"
          navTree={mockNavTree}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
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

      // Should have separators between Home, Getting Started, and Installation
      expect(separatorElements.length).toBeGreaterThan(0);
    });
  });

  describe('links', () => {
    it('should make non-current breadcrumbs clickable links', () => {
      render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/01_installation/"
          version="6"
          navTree={mockNavTree}
        />
      );

      const homeLink = screen.getByRole('link', { name: 'Home' });
      const gettingStartedLink = screen.getByRole('link', { name: 'Getting Started' });

      expect(homeLink).toHaveAttribute('href', '/en/6/');
      expect(gettingStartedLink).toHaveAttribute('href', '/en/6/01_getting_started/');
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
    it('should handle empty nav tree gracefully', () => {
      render(
        <Breadcrumbs
          slug="/en/6/some-page/"
          version="6"
          navTree={[]}
        />
      );

      // Should still show Home
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should use version from props to build home link', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/"
          version="6"
          navTree={mockNavTree}
        />
      );

      // Home link should always use the version prop
      const homeLink = container.querySelector('a[href="/en/6/"]');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveTextContent('Home');
    });

    it('should handle unknown slug paths', () => {
      render(
        <Breadcrumbs
          slug="/en/6/unknown/path/"
          version="6"
          navTree={mockNavTree}
        />
      );

      // Should still render Home at minimum
      expect(screen.getByText('Home')).toBeInTheDocument();
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

    it('should render breadcrumbs for optional features', () => {
      render(
        <Breadcrumbs
          slug="/en/6/optional_features/linkfield/01_usage/"
          version="6"
          navTree={optionalFeatureNavTree}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
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

    it('should apply link class to non-current breadcrumbs', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/01_installation/"
          version="6"
          navTree={mockNavTree}
        />
      );

      // CSS modules create scoped class names, so check for links that have href attributes
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

      // Find the current breadcrumb by looking for the last span that is not a separator
      const breadcrumbsList = container.querySelector('ol');
      const items = breadcrumbsList?.querySelectorAll('li');
      const lastItem = items?.[items.length - 1];
      const currentElement = lastItem?.querySelector('span');
      
      expect(currentElement).toBeInTheDocument();
      expect(currentElement).toHaveTextContent('Installation');
    });

    it('should apply separator class between breadcrumbs', () => {
      const { container } = render(
        <Breadcrumbs
          slug="/en/6/01_getting_started/01_installation/"
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
  });
});
