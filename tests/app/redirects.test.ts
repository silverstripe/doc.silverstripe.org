/**
 * Tests for redirect behavior across different URL patterns
 * Ensures that URLs missing language, version, or both redirect to the correct default path
 */

import { redirect } from 'next/navigation';
import { DEFAULT_VERSION } from '../../global-config';

// Mock Next.js redirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`);
  }),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

// Mock the document fetching
jest.mock('@/lib/content/get-document', () => ({
  getDocumentByParams: jest.fn(),
  getAllDocuments: jest.fn(() => Promise.resolve([])),
}));

// Mock markdown processor
jest.mock('@/lib/markdown/processor', () => ({
  markdownToHtmlWithCleanup: jest.fn(() => Promise.resolve('<div>Test content</div>')),
}));

// Mock children replacement
jest.mock('@/lib/children/replace-children-markers', () => ({
  replaceChildrenMarkers: jest.fn((html) => html),
}));

// Mock TOC
jest.mock('@/lib/toc/extract-headings', () => ({
  extractHeadings: jest.fn(() => []),
}));

jest.mock('@/lib/toc/generate-toc-html', () => ({
  generateTocHtml: jest.fn(() => ''),
  insertTocAfterH1: jest.fn((html) => html),
}));

// Mock nav tree
jest.mock('@/lib/nav/build-nav-tree', () => ({
  buildNavTree: jest.fn(() => []),
}));

// Mock metadata
jest.mock('@/lib/metadata/metadata', () => ({
  generatePageMetadata: jest.fn(() => ({ title: 'Test' })),
}));

describe('Route Redirects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Root redirect (src/app/page.tsx)', () => {
    it('should redirect / to /en/{DEFAULT_VERSION}/', async () => {
      const HomePage = (await import('@/app/page')).default;
      
      expect(() => HomePage()).toThrow(`NEXT_REDIRECT: /en/${DEFAULT_VERSION}/`);
      expect(redirect).toHaveBeenCalledWith(`/en/${DEFAULT_VERSION}/`);
      expect(redirect).toHaveBeenCalledTimes(1);
    });
  });

  describe('/en/ redirect (src/app/en/page.tsx)', () => {
    it('should redirect /en/ to /en/{DEFAULT_VERSION}/', async () => {
      const EnPage = (await import('@/app/en/page')).default;
      
      expect(() => EnPage()).toThrow(`NEXT_REDIRECT: /en/${DEFAULT_VERSION}/`);
      expect(redirect).toHaveBeenCalledWith(`/en/${DEFAULT_VERSION}/`);
      expect(redirect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Invalid version redirect (src/app/en/[version]/[[...slug]]/page.tsx)', () => {
    it('should redirect /en/contributing/code/ to /en/{DEFAULT_VERSION}/contributing/code/', async () => {
      const Page = (await import('@/app/en/[version]/[[...slug]]/page')).default;
      
      const props = {
        params: Promise.resolve({
          version: 'contributing',
          slug: ['code'],
        }),
      };

      await expect(Page(props)).rejects.toThrow(`NEXT_REDIRECT: /en/${DEFAULT_VERSION}/contributing/code/`);
      expect(redirect).toHaveBeenCalledWith(`/en/${DEFAULT_VERSION}/contributing/code/`);
      expect(redirect).toHaveBeenCalledTimes(1);
    });

    it('should redirect /en/getting-started/ to /en/{DEFAULT_VERSION}/getting-started/', async () => {
      const Page = (await import('@/app/en/[version]/[[...slug]]/page')).default;
      
      const props = {
        params: Promise.resolve({
          version: 'getting-started',
          slug: undefined,
        }),
      };

      await expect(Page(props)).rejects.toThrow(`NEXT_REDIRECT: /en/${DEFAULT_VERSION}/getting-started/`);
      expect(redirect).toHaveBeenCalledWith(`/en/${DEFAULT_VERSION}/getting-started/`);
      expect(redirect).toHaveBeenCalledTimes(1);
    });

    it('should redirect /en/lessons/building-modules/ to /en/{DEFAULT_VERSION}/lessons/building-modules/', async () => {
      const Page = (await import('@/app/en/[version]/[[...slug]]/page')).default;
      
      const props = {
        params: Promise.resolve({
          version: 'lessons',
          slug: ['building-modules'],
        }),
      };

      await expect(Page(props)).rejects.toThrow(`NEXT_REDIRECT: /en/${DEFAULT_VERSION}/lessons/building-modules/`);
      expect(redirect).toHaveBeenCalledWith(`/en/${DEFAULT_VERSION}/lessons/building-modules/`);
      expect(redirect).toHaveBeenCalledTimes(1);
    });

    it('should not redirect for valid version', async () => {
      const { getDocumentByParams } = await import('@/lib/content/get-document');
      (getDocumentByParams as jest.Mock).mockResolvedValueOnce({
        slug: '/en/6/test/',
        version: '6',
        title: 'Test',
        content: '# Test',
        category: 'docs',
      });

      const Page = (await import('@/app/en/[version]/[[...slug]]/page')).default;
      
      const props = {
        params: Promise.resolve({
          version: '6',
          slug: ['test'],
        }),
      };

      await Page(props);

      // Should not redirect for valid version
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe('Integration with DEFAULT_VERSION', () => {
    it('should use the current DEFAULT_VERSION value from global-config', () => {
      expect(DEFAULT_VERSION).toBe('6');
    });

    it('should dynamically adapt if DEFAULT_VERSION changes', async () => {
      const Page = (await import('@/app/en/[version]/[[...slug]]/page')).default;
      
      const props = {
        params: Promise.resolve({
          version: 'invalid-version',
          slug: ['test'],
        }),
      };

      await expect(Page(props)).rejects.toThrow('NEXT_REDIRECT');
      
      // The redirect should include whatever DEFAULT_VERSION is set to
      expect(redirect).toHaveBeenCalledWith(expect.stringContaining(`/en/${DEFAULT_VERSION}/`));
    });
  });
});
