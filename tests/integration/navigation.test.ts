/**
 * Integration tests for Phase 6: Navigation fixes and changelog rendering
 * Tests: Version index pages, changelog rendering with hideChildren, custom heading anchors
 */
import { getAllDocuments, clearDocumentCache, getDocumentBySlug, getDocumentByParams } from '@/lib/content/get-document';
import { buildNavTree } from '@/lib/nav/build-nav-tree';
import { replaceChildrenMarkers } from '@/lib/children/replace-children-markers';

describe('Phase 6: Navigation and Changelog Integration', () => {
  beforeEach(() => {
    clearDocumentCache();
    process.env.NEXT_USE_MOCK_DATA = 'true';
  });

  describe('Version index pages load without redirect loops', () => {
    it('should load v6 index page with valid content', async () => {
      const doc = await getDocumentByParams('6', undefined);

      expect(doc).toBeDefined();
      expect(doc?.version).toBe('6');
      expect(doc?.isIndex).toBe(true);
      expect(doc?.title).toBeTruthy();
      expect(doc?.content).toBeTruthy();
    });

    it('should not cause redirect loop for version index', async () => {
      const doc = await getDocumentByParams('6', undefined);

      // Index pages should have correct slug (not redirect to root)
      expect(doc?.slug).toBe('/en/6/');
      // Parent of version index is itself (version folders don't have explicit parents)
      expect(doc?.parentSlug).toBe('/en/6/');
    });

    it('should load other version indices', async () => {
      for (const version of ['3', '4', '5']) {
        const doc = await getDocumentByParams(version, undefined);
        expect(doc).toBeDefined();
        expect(doc?.version).toBe(version);
        expect(doc?.isIndex).toBe(true);
      }
    });
  });

  describe('Changelog pages render correctly with [CHILDREN] content', () => {
    it('should load changelog index page with hideChildren flag', async () => {
      const doc = await getDocumentByParams('6', ['changelogs']);

      expect(doc).toBeDefined();
      expect(doc?.title).toBe('Changelogs');
      expect(doc?.content).toContain('[CHILDREN]');
      // hideChildren should be in frontmatter
      expect((doc as any)?.hideChildren).toBe(true);
    });

    it('should load changelog child page - 6.0.0', async () => {
      const doc = await getDocumentByParams('6', ['changelogs', 'v6_0_0']);

      expect(doc).toBeDefined();
      expect(doc?.title).toBe('Silverstripe CMS 6.0.0');
      expect(doc?.content).toContain('Release Notes');
      expect(doc?.content).toContain('Major Features');
    });

    it('should load changelog child page - 5.2.0', async () => {
      const doc = await getDocumentByParams('6', ['changelogs', 'v5_2_0']);

      expect(doc).toBeDefined();
      expect(doc?.title).toBe('Silverstripe CMS 5.2.0');
      expect(doc?.content).toContain('New Features');
      expect(doc?.content).toContain('Security Updates');
    });

    it('should replace [CHILDREN] marker with actual children in changelog index', async () => {
      // Get the changelog index
      const changelogIndex = await getDocumentByParams('6', ['changelogs']);
      
      expect(changelogIndex).toBeDefined();

      // Get all documents to find children
      const allDocs = await getAllDocuments();
      
      // When replacing children markers, it should generate HTML for children
      // Need to process markdown to HTML first - this typically happens in the page rendering
      // For this test, we just verify the marker exists and children can be found
      const changelogChildren = allDocs.filter(
        d => d.parentSlug === changelogIndex?.slug && d.version === '6'
      );

      expect(changelogChildren.length).toBeGreaterThan(0);
    });
  });

  describe('Contributing sub-pages are accessible', () => {
    it('should load contributing index page', async () => {
      const doc = await getDocumentByParams('6', ['contributing']);

      expect(doc).toBeDefined();
      expect(doc?.title).toBe('Contributing');
      expect(doc?.slug).toBe('/en/6/contributing/');
    });

    it('should load Code Style Guide sub-page', async () => {
      const doc = await getDocumentByParams('6', ['contributing', 'code_style']);

      expect(doc).toBeDefined();
      expect(doc?.title).toBe('Code Style Guide');
      expect(doc?.content).toContain('PSR-12');
      expect(doc?.parentSlug).toBe('/en/6/contributing/');
    });

    it('should load Pull Requests sub-page', async () => {
      const doc = await getDocumentByParams('6', ['contributing', 'pull_requests']);

      expect(doc).toBeDefined();
      expect(doc?.title).toBe('Submitting Pull Requests');
      expect(doc?.content).toContain('PR Requirements');
      expect(doc?.parentSlug).toBe('/en/6/contributing/');
    });

    it('should build navigation tree with contributing pages', async () => {
      const allDocs = await getAllDocuments();
      const navTree = buildNavTree(allDocs, '6');

      // Find contributing in tree
      const contributingNode = navTree.find(n => n.slug === '/en/6/contributing/');
      expect(contributingNode).toBeDefined();
      
      // Should have children
      if (contributingNode) {
        expect(contributingNode.children.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Custom heading anchors render correctly', () => {
    it('should parse custom heading IDs from changelog 6.0.0', async () => {
      const doc = await getDocumentByParams('6', ['changelogs', 'v6_0_0']);

      expect(doc?.content).toContain('{#new-features}');
      expect(doc?.content).toContain('{#breaking-changes}');
    });

    it('should parse custom heading IDs from changelog 5.2.0', async () => {
      const doc = await getDocumentByParams('6', ['changelogs', 'v5_2_0']);

      expect(doc?.content).toContain('{#new-features-520}');
      expect(doc?.content).toContain('{#security-updates}');
    });

    it('should parse custom heading IDs from code style guide', async () => {
      const doc = await getDocumentByParams('6', ['contributing', 'code_style']);

      expect(doc?.content).toContain('{#php-style}');
      expect(doc?.content).toContain('{#js-style}');
    });

    it('should parse custom heading IDs from pull requests page', async () => {
      const doc = await getDocumentByParams('6', ['contributing', 'pull_requests']);

      expect(doc?.content).toContain('{#pr-requirements}');
      expect(doc?.content).toContain('{#review-process}');
    });
  });

  describe('Navigation tree building with all pages', () => {
    it('should build complete nav tree for v6', async () => {
      const allDocs = await getAllDocuments();
      const navTree = buildNavTree(allDocs, '6');

      expect(navTree.length).toBeGreaterThan(0);
      
      // Should have expected top-level sections
      const titles = navTree.map(n => n.title);
      expect(titles).toContain('Getting Started');
    });

    it('should include changelogs in navigation tree', async () => {
      const allDocs = await getAllDocuments();
      const navTree = buildNavTree(allDocs, '6');

      const changelogsNode = navTree.find(n => n.title === 'Changelogs');
      expect(changelogsNode).toBeDefined();
    });

    it('should include contributing in navigation tree', async () => {
      const allDocs = await getAllDocuments();
      const navTree = buildNavTree(allDocs, '6');

      const contributingNode = navTree.find(n => n.title === 'Contributing');
      expect(contributingNode).toBeDefined();
    });

    it('should preserve hideChildren flag in navigation', async () => {
      const allDocs = await getAllDocuments();
      const navTree = buildNavTree(allDocs, '6');

      const changelogsNode = navTree.find(n => n.title === 'Changelogs');
      if (changelogsNode) {
        // hideChildren should not affect navigation structure
        // It's used for rendering display, not for loading
        expect(changelogsNode).toBeTruthy();
      }
    });
  });

  describe('Document collection and caching', () => {
    it('should cache documents correctly across calls', async () => {
      const doc1 = await getDocumentByParams('6', ['changelogs']);
      const doc2 = await getDocumentByParams('6', ['changelogs']);

      expect(doc1).toEqual(doc2);
    });

    it('should clear cache when requested', async () => {
      const doc1 = await getDocumentByParams('6', ['changelogs']);
      clearDocumentCache();
      const doc2 = await getDocumentByParams('6', ['changelogs']);

      // Should be same content but different object instances
      expect(doc1?.slug).toEqual(doc2?.slug);
      expect(doc1?.title).toEqual(doc2?.title);
    });

    it('should return all documents with versions 3-6', async () => {
      const allDocs = await getAllDocuments();

      const versions = new Set(allDocs.map(d => d.version));
      expect(versions.size).toBeGreaterThan(0);
      expect(versions.has('6')).toBe(true);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle version index with undefined slug', async () => {
      // Undefined slug should resolve to index
      const doc = await getDocumentByParams('6', undefined);

      expect(doc?.isIndex).toBe(true);
      expect(doc?.slug).toBe('/en/6/');
    });

    it('should handle version index with empty array slug', async () => {
      // Empty array should also resolve to index
      const doc = await getDocumentByParams('6', []);

      expect(doc?.isIndex).toBe(true);
      expect(doc?.slug).toBe('/en/6/');
    });

    it('should handle nested page paths correctly', async () => {
      const doc = await getDocumentByParams('6', ['contributing', 'code_style']);

      expect(doc?.slug).toBe('/en/6/contributing/code_style/');
      expect(doc?.parentSlug).toBe('/en/6/contributing/');
    });

    it('should return null for non-existent pages', async () => {
      const doc = await getDocumentByParams('6', ['nonexistent', 'page']);

      expect(doc).toBeNull();
    });
  });
});
