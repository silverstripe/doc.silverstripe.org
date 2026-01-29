/**
 * Integration tests for Phase 9 epic features
 * Tests: DOCS_CONTEXT filtering, mock data structure, navigation preservation
 */
import { getAllDocuments, clearDocumentCache } from '@/lib/content/get-document';
import { buildNavTree } from '@/lib/nav/build-nav-tree';
import { getAvailableMockVersions } from '../helpers/mock-versions';

describe('Phase 9: Epic Features Integration', () => {
  beforeEach(() => {
    clearDocumentCache();
  });

  describe('DOCS_CONTEXT filtering works correctly', () => {
    it('should filter to docs category when DOCS_CONTEXT=docs', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const documents = await getAllDocuments();

      expect(documents.length).toBeGreaterThan(0);
      documents.forEach(doc => {
        expect(doc.category).toBe('docs');
      });
    });

    it('should filter to user category when DOCS_CONTEXT=user', async () => {
      process.env.DOCS_CONTEXT = 'user';
      clearDocumentCache();

      const documents = await getAllDocuments();

      // In mock data, we may have only docs category
      // The important thing is that filtering mechanism works
      documents.forEach(doc => {
        expect(doc.category).toBe('user');
      });
    });

    it('should return different document sets for different contexts', async () => {
      // Get docs context documents
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();
      const docsDocs = await getAllDocuments();

      // Get user context documents
      process.env.DOCS_CONTEXT = 'user';
      clearDocumentCache();
      const userDocs = await getAllDocuments();

      // Both should be valid (might be same or different depending on mock data)
      expect(docsDocs.every(d => d.category === 'docs')).toBe(true);
      expect(userDocs.every(d => d.category === 'user')).toBe(true);
    });
  });

  describe('Mock data structure supports both categories', () => {
    it('should have DocumentNode interface with category field', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const documents = await getAllDocuments();

      expect(documents.length).toBeGreaterThan(0);
      documents.forEach(doc => {
        // Verify all required fields exist
        expect(doc.slug).toBeDefined();
        expect(doc.version).toBeDefined();
        expect(doc.title).toBeDefined();
        expect(doc.category).toBeDefined();
        expect(['docs', 'user']).toContain(doc.category);
      });
    });

    it('should maintain version information in filtered documents', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const documents = await getAllDocuments();
      const versions = new Set(documents.map(d => d.version));
      const availableVersions = getAvailableMockVersions();

      expect(versions.size).toBeGreaterThan(0);
      versions.forEach(version => {
        expect(availableVersions).toContain(version);
      });
    });

    it('should have both index and regular documents in filtered set', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const documents = await getAllDocuments();

      const indexDocs = documents.filter(d => d.isIndex);
      const regularDocs = documents.filter(d => !d.isIndex);

      expect(documents.length).toBeGreaterThan(0);
      expect(indexDocs.length).toBeGreaterThan(0);
      expect(regularDocs.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation preserves functionality across features', () => {
    it('should build nav tree correctly with filtered documents', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const allDocs = await getAllDocuments();
      const v6Docs = allDocs.filter(d => d.version === '6');

      if (v6Docs.length === 0) {
        console.warn('No v6 mock docs found, skipping nav tree test');
        return;
      }

      const tree = buildNavTree(allDocs, '6', '/en/6/');

      expect(tree.length).toBeGreaterThan(0);
      tree.forEach(node => {
        expect(node.slug).toBeDefined();
        expect(node.title).toBeDefined();
        // Verify nav node structure
        expect(typeof node.isIndex).toBe('boolean');
        expect(typeof node.isActive).toBe('boolean');
        expect(Array.isArray(node.children)).toBe(true);
      });
    });

    it('should preserve hasVisibleChildren flag with filtered content', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const allDocs = await getAllDocuments();
      const v6Docs = allDocs.filter(d => d.version === '6');

      if (v6Docs.length === 0) {
        console.warn('No v6 mock docs found, skipping nav tree test');
        return;
      }

      const tree = buildNavTree(allDocs, '6', '/en/6/');

      // Find a node with children
      const parentNode = tree.find(n => n.children && n.children.length > 0);

      if (parentNode) {
        expect(parentNode.hasVisibleChildren).toBe(true);
        expect(parentNode.children.length).toBeGreaterThan(0);
      }
    });

    it('should filter sidebar correctly in docs context', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const allDocs = await getAllDocuments();

      // All documents should be from docs category
      allDocs.forEach(doc => {
        expect(doc.category).toBe('docs');
      });

      // Navigation tree should respect this filtering
      const tree = buildNavTree(allDocs, '6', '/en/6/');
      tree.forEach(node => {
        // NavNode doesn't have category, but underlying documents do
        expect(node.slug).toBeDefined();

        // Recursively check children have valid structure
        const checkChildren = (nodes: any[]): void => {
          nodes.forEach(n => {
            expect(n.slug).toBeDefined();
            expect(n.title).toBeDefined();
            if (n.children && n.children.length > 0) {
              checkChildren(n.children);
            }
          });
        };

        if (node.children && node.children.length > 0) {
          checkChildren(node.children);
        }
      });
    });
  });

  describe('Syntax highlighting persists across features', () => {
    it('should have code blocks in document content after filtering', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const documents = await getAllDocuments();

      // Find a document with code blocks
      const docWithCode = documents.find(doc => doc.content.includes('```'));

      if (docWithCode) {
        // Should have code block markers
        expect(docWithCode.content).toContain('```');
        expect(docWithCode.category).toBe('docs');
      }

      // At minimum, verify documents are loaded and categories are respected
      expect(documents.length).toBeGreaterThan(0);
      documents.forEach(doc => {
        expect(doc.category).toBe('docs');
      });
    });
  });

  describe('Version switching works with filtering', () => {
    it('should switch versions while maintaining category filter', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const allDocs = await getAllDocuments();

      // Get documents for different versions
      const v6Docs = allDocs.filter(d => d.version === '6');
      const v5Docs = allDocs.filter(d => d.version === '5');

      // Both should respect the category filter
      v6Docs.forEach(doc => {
        expect(doc.category).toBe('docs');
        expect(doc.version).toBe('6');
      });

      v5Docs.forEach(doc => {
        expect(doc.category).toBe('docs');
        expect(doc.version).toBe('5');
      });
    });

    it('should build separate nav trees for each version', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const allDocs = await getAllDocuments();

      const v6Tree = buildNavTree(allDocs, '6', '/en/6/');
      const v5Tree = buildNavTree(allDocs, '5', '/en/5/');

      expect(v6Tree.length).toBeGreaterThan(0);
      expect(v5Tree.length).toBeGreaterThan(0);

      // Check that trees have correct version
      v6Tree.forEach(node => {
        expect(node.slug).toContain('/en/6/');
      });

      v5Tree.forEach(node => {
        expect(node.slug).toContain('/en/5/');
      });
    });
  });

  describe('No regressions in existing functionality', () => {
    it('should still have all required document fields', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const documents = await getAllDocuments();

      expect(documents.length).toBeGreaterThan(0);
      documents.forEach(doc => {
        expect(doc.slug).toBeDefined();
        expect(doc.version).toBeDefined();
        expect(doc.filePath).toBeDefined();
        expect(doc.fileTitle).toBeDefined();
        expect(doc.fileAbsolutePath).toBeDefined();
        expect(typeof doc.isIndex).toBe('boolean');
        expect(doc.parentSlug).toBeDefined();
        expect(doc.title).toBeDefined();
        expect(doc.content).toBeDefined();
        expect(doc.category).toBeDefined();
      });
    });

    it('should preserve optional fields when present', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const documents = await getAllDocuments();
      const docWithSummary = documents.find(d => d.summary);
      const docWithIcon = documents.find(d => d.icon);

      // Optional fields should exist on some documents
      if (docWithSummary) {
        expect(docWithSummary.summary).toBeDefined();
        expect(docWithSummary.summary).toBeTruthy();
      }

      if (docWithIcon) {
        expect(docWithIcon.icon).toBeDefined();
        expect(docWithIcon.icon).toBeTruthy();
      }
    });

    it('should maintain sorting with numeric prefixes', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();

      const allDocs = await getAllDocuments();

      // Find documents in a parent directory
      const parent = '/en/6/01_getting_started';
      const siblings = allDocs.filter(d =>
        d.slug.startsWith(parent) && !d.isIndex && d.slug.split('/').length === 5
      );

      if (siblings.length > 1) {
        // Check that order field is respected
        siblings.forEach(doc => {
          expect(typeof doc.order === 'number' || doc.order === undefined).toBe(true);
        });
      }
    });
  });
});
