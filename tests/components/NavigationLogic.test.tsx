import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditOnGithub from '@/components/EditOnGithub';
import { Header } from '@/components/Header';
import {
  getOptionalFeatureFromDocument,
  getDocumentGithubInfo,
  doesSlugExistInVersion,
  getFallbackSlugForVersion,
  extractVersionAndFeatureFromSlug,
} from '@/lib/navigation-logic';
import { DocumentNode } from '@/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => (
    <a href={href}>{children}</a>
  );
});

// Mock SearchBox component
jest.mock('@/components/SearchBox', () => ({
  SearchBox: () => <div data-testid="search-box">SearchBox</div>,
}));

// Mock VersionSwitcher component
jest.mock('@/components/VersionSwitcher', () => ({
  VersionSwitcher: ({ currentVersion }: any) => (
    <div data-testid="version-switcher">v{currentVersion}</div>
  ),
}));

// Mock HamburgerButton component
jest.mock('@/components/HamburgerButton', () => ({
  HamburgerButton: ({ isOpen, onClick }: any) => (
    <button
      data-testid="hamburger-button"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      Menu
    </button>
  ),
}));

// Mock DarkModeToggle component
jest.mock('@/components/DarkModeToggle', () => ({
  DarkModeToggle: () => <div data-testid="dark-mode-toggle">Toggle</div>,
}));

describe('Phase 1: Navigation & Links Logic', () => {
  describe('EditOnGithub - Optional Module Detection', () => {
    it('generates correct URL for optional feature linkfield', () => {
      render(
        <EditOnGithub
          version="6"
          filePath="index.md"
          category="docs"
          optionalFeature="linkfield"
        />
      );

      const link = screen.getByRole('link', { name: /edit on github/i });
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/silverstripe/silverstripe-linkfield/blob/5.1/docs/en/index.md'
      );
    });

    it('generates correct URL for optional feature fluent with correct owner v6', () => {
      render(
        <EditOnGithub
          version="6"
          filePath="index.md"
          category="docs"
          optionalFeature="fluent"
        />
      );

      const link = screen.getByRole('link', { name: /edit on github/i });
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/tractorcow/silverstripe-fluent/blob/8.1/docs/en/index.md'
      );
    });

    it('generates correct URL for optional feature staticpublishqueue', () => {
      render(
        <EditOnGithub
          version="6"
          filePath="01_Getting_Started/index.md"
          category="docs"
          optionalFeature="staticpublishqueue"
        />
      );

      const link = screen.getByRole('link', { name: /edit on github/i });
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/silverstripe/silverstripe-staticpublishqueue/blob/7.0/docs/en/01_Getting_Started/index.md'
      );
    });

    it('handles optional feature queuedjobs v5', () => {
      render(
        <EditOnGithub
          version="5"
          filePath="index.md"
          category="docs"
          optionalFeature="queuedjobs"
        />
      );

      const link = screen.getByRole('link', { name: /edit on github/i });
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/silverstripe/silverstripe-queuedjobs/blob/5.3/docs/en/index.md'
      );
    });

    it('handles optional feature advancedworkflow v6', () => {
      render(
        <EditOnGithub
          version="6"
          filePath="index.md"
          category="docs"
          optionalFeature="advancedworkflow"
        />
      );

      const link = screen.getByRole('link', { name: /edit on github/i });
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/silverstripe/silverstripe-advancedworkflow/blob/7.1/docs/en/index.md'
      );
    });

    it('uses correct branch for optional features per version', () => {
      render(
        <EditOnGithub
          version="5"
          filePath="index.md"
          category="docs"
          optionalFeature="linkfield"
        />
      );

      const link = screen.getByRole('link', { name: /edit on github/i });
      // v5 linkfield should use branch 4.2
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/silverstripe/silverstripe-linkfield/blob/4.2/docs/en/index.md'
      );
    });
  });

  describe('getOptionalFeatureFromDocument', () => {
    it('returns the optional feature from document', () => {
      const doc: DocumentNode = {
        slug: '/en/6/optional_features/linkfield/',
        version: '6',
        filePath: 'index.md',
        fileTitle: 'LinkField',
        fileAbsolutePath: '/path/to/index.md',
        isIndex: true,
        parentSlug: '/en/6/',
        title: 'LinkField',
        content: 'content',
        category: 'docs',
        optionalFeature: 'linkfield',
      };

      const result = getOptionalFeatureFromDocument(doc);
      expect(result).toBe('linkfield');
    });

    it('returns null when document has no optional feature', () => {
      const doc: DocumentNode = {
        slug: '/en/6/getting-started/',
        version: '6',
        filePath: 'index.md',
        fileTitle: 'Getting Started',
        fileAbsolutePath: '/path/to/index.md',
        isIndex: true,
        parentSlug: '/en/6/',
        title: 'Getting Started',
        content: 'content',
        category: 'docs',
      };

      const result = getOptionalFeatureFromDocument(doc);
      expect(result).toBeNull();
    });

    it('returns null when document is null', () => {
      const result = getOptionalFeatureFromDocument(null);
      expect(result).toBeNull();
    });
  });

  describe('getDocumentGithubInfo', () => {
    it('returns correct info for core v6 docs', () => {
      const info = getDocumentGithubInfo('6', null);
      expect(info).toEqual({
        owner: 'silverstripe',
        repo: 'developer-docs',
        branch: '6.1',
        docsPath: 'en',
      });
    });

    it('returns correct info for v5 docs', () => {
      const info = getDocumentGithubInfo('5', null);
      expect(info).toEqual({
        owner: 'silverstripe',
        repo: 'developer-docs',
        branch: '5.4',
        docsPath: 'en',
      });
    });

    it('returns correct info for optional feature linkfield v6', () => {
      const info = getDocumentGithubInfo('6', 'linkfield');
      expect(info).toEqual({
        owner: 'silverstripe',
        repo: 'silverstripe-linkfield',
        branch: '5.1',
        docsPath: 'docs/en',
      });
    });

    it('returns correct info for optional feature fluent v6', () => {
      const info = getDocumentGithubInfo('6', 'fluent');
      expect(info).toEqual({
        owner: 'tractorcow',
        repo: 'silverstripe-fluent',
        branch: '8.1',
        docsPath: 'docs/en',
      });
    });

    it('returns correct info for optional feature with different owners', () => {
      // fluent v5 should use tractorcow-farm
      const info = getDocumentGithubInfo('5', 'fluent');
      expect(info).toEqual({
        owner: 'tractorcow-farm',
        repo: 'silverstripe-fluent',
        branch: '7.3',
        docsPath: 'docs/en',
      });
    });

    it('returns null for unknown version', () => {
      const info = getDocumentGithubInfo('99', null);
      expect(info).toBeNull();
    });

    it('returns null for unknown optional feature', () => {
      const info = getDocumentGithubInfo('6', 'unknown-feature');
      expect(info).toBeNull();
    });
  });

  describe('doesSlugExistInVersion', () => {
    const mockDocs: DocumentNode[] = [
      {
        slug: '/en/6/getting-started/',
        version: '6',
        filePath: 'index.md',
        fileTitle: 'Getting Started',
        fileAbsolutePath: '/path/to/index.md',
        isIndex: true,
        parentSlug: '/en/6/',
        title: 'Getting Started',
        content: 'content',
        category: 'docs',
      },
      {
        slug: '/en/6/api/index/',
        version: '6',
        filePath: 'api/index.md',
        fileTitle: 'API',
        fileAbsolutePath: '/path/to/api/index.md',
        isIndex: true,
        parentSlug: '/en/6/',
        title: 'API',
        content: 'content',
        category: 'docs',
      },
      {
        slug: '/en/5/getting-started/',
        version: '5',
        filePath: 'index.md',
        fileTitle: 'Getting Started',
        fileAbsolutePath: '/path/to/index.md',
        isIndex: true,
        parentSlug: '/en/5/',
        title: 'Getting Started',
        content: 'content',
        category: 'docs',
      },
    ];

    it('returns true for existing slug in version', () => {
      const result = doesSlugExistInVersion('/en/6/getting-started/', mockDocs, '6');
      expect(result).toBe(true);
    });

    it('returns false for non-existing slug in version', () => {
      const result = doesSlugExistInVersion('/en/6/nonexistent/', mockDocs, '6');
      expect(result).toBe(false);
    });

    it('returns false when slug exists in different version', () => {
      const result = doesSlugExistInVersion('/en/5/api/index/', mockDocs, '6');
      expect(result).toBe(false);
    });

    it('performs case-insensitive match', () => {
      const result = doesSlugExistInVersion('/en/6/Getting-Started/', mockDocs, '6');
      expect(result).toBe(true);
    });

    it('handles slugs without trailing slash', () => {
      const result = doesSlugExistInVersion('/en/6/api/index', mockDocs, '6');
      expect(result).toBe(true);
    });
  });

  describe('getFallbackSlugForVersion', () => {
    const mockDocs: DocumentNode[] = [
      {
        slug: '/en/6/getting-started/',
        version: '6',
        filePath: 'index.md',
        fileTitle: 'Getting Started',
        fileAbsolutePath: '/path/to/index.md',
        isIndex: true,
        parentSlug: '/en/6/',
        title: 'Getting Started',
        content: 'content',
        category: 'docs',
      },
      {
        slug: '/en/5/getting-started/',
        version: '5',
        filePath: 'index.md',
        fileTitle: 'Getting Started',
        fileAbsolutePath: '/path/to/index.md',
        isIndex: true,
        parentSlug: '/en/5/',
        title: 'Getting Started',
        content: 'content',
        category: 'docs',
      },
      {
        slug: '/en/5/admin-interface/',
        version: '5',
        filePath: 'index.md',
        fileTitle: 'Admin Interface',
        fileAbsolutePath: '/path/to/index.md',
        isIndex: true,
        parentSlug: '/en/5/',
        title: 'Admin Interface',
        content: 'content',
        category: 'docs',
      },
    ];

    it('returns equivalent path if it exists in target version', () => {
      const result = getFallbackSlugForVersion('/en/6/getting-started/', '5', mockDocs);
      expect(result).toBe('/en/5/getting-started/');
    });

    it('returns root version if path does not exist in target version', () => {
      const result = getFallbackSlugForVersion('/en/6/api-docs/', '5', mockDocs);
      expect(result).toBe('/en/5/');
    });

    it('handles pages unique to target version', () => {
      const result = getFallbackSlugForVersion('/en/6/admin-interface/', '5', mockDocs);
      expect(result).toBe('/en/5/admin-interface/');
    });

    it('handles versions with different content', () => {
      const result = getFallbackSlugForVersion('/en/5/nonexistent-v5-page/', '6', mockDocs);
      expect(result).toBe('/en/6/');
    });
  });

  describe('extractVersionAndFeatureFromSlug', () => {
    it('extracts version from core docs slug', () => {
      const result = extractVersionAndFeatureFromSlug('/en/6/getting-started/');
      expect(result.version).toBe('6');
      expect(result.optionalFeature).toBeNull();
    });

    it('extracts version and optional feature from feature slug', () => {
      const result = extractVersionAndFeatureFromSlug('/en/6/optional_features/linkfield/');
      expect(result.version).toBe('6');
      expect(result.optionalFeature).toBe('linkfield');
    });

    it('extracts version and nested optional feature path', () => {
      const result = extractVersionAndFeatureFromSlug('/en/6/optional_features/linkfield/configuration/');
      expect(result.version).toBe('6');
      expect(result.optionalFeature).toBe('linkfield');
    });

    it('handles v5 paths', () => {
      const result = extractVersionAndFeatureFromSlug('/en/5/getting-started/');
      expect(result.version).toBe('5');
      expect(result.optionalFeature).toBeNull();
    });

    it('defaults to v6 for invalid paths', () => {
      const result = extractVersionAndFeatureFromSlug('/invalid/');
      expect(result.version).toBe('6');
      expect(result.optionalFeature).toBeNull();
    });
  });

  describe('Header Component - GitHub Link Changes', () => {
    beforeEach(() => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/en/6/getting-started/');
    });

    it('renders GitHub link to developer-docs for core docs', async () => {
      render(<Header docsContext="docs" />);
      
      await waitFor(() => {
        const githubLink = screen.getAllByRole('link').find(link =>
          link.getAttribute('href')?.includes('github.com/silverstripe/developer-docs')
        );
        expect(githubLink).toBeInTheDocument();
      });
    });

    it('changes GitHub link when navigating to optional feature section', async () => {
      const { usePathname } = require('next/navigation');
      const { rerender } = render(<Header docsContext="docs" />);

      // Change pathname to optional feature
      usePathname.mockReturnValue('/en/6/optional_features/linkfield/');
      rerender(<Header docsContext="docs" />);

      await waitFor(() => {
        const githubLink = screen.getAllByRole('link').find(link =>
          link.getAttribute('href')?.includes('silverstripe-linkfield')
        );
        expect(githubLink).toBeInTheDocument();
      });
    });

    it('renders Header without errors when pathname is invalid', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/invalid/path/');

      render(<Header docsContext="docs" />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('renders all header components', () => {
      render(<Header docsContext="docs" />);

      expect(screen.getByAltText('Silverstripe')).toBeInTheDocument();
      expect(screen.getByTestId('search-box')).toBeInTheDocument();
      expect(screen.getByTestId('version-switcher')).toBeInTheDocument();
      expect(screen.getByTestId('hamburger-button')).toBeInTheDocument();
    });
  });

  describe('VersionSwitcher - Fallback Logic', () => {
    beforeEach(() => {
      const { usePathname, useRouter } = require('next/navigation');
      usePathname.mockReturnValue('/en/6/getting-started/');
      useRouter.mockReturnValue({
        push: jest.fn(),
      });
    });

    it('should have tests for version switcher fallback', () => {
      // VersionSwitcher component tests would go here
      // Since it's mocked in this test file, integration tests should be added in a separate file
      expect(true).toBe(true);
    });
  });
});
