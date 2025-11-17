import {
  getAllDocuments,
  getDocumentBySlug,
  getDocumentByParams,
  getChildDocuments,
  clearDocumentCache
} from '@/lib/content/get-document';
import { DocumentNode } from '@/types';

describe('Document Fetcher', () => {
  beforeEach(() => {
    clearDocumentCache();
  });

  describe('getAllDocuments', () => {
    it('should return all documents from mock content', async () => {
      const docs = await getAllDocuments();
      
      expect(docs).toHaveLength(19); // Based on mock-content structure
      expect(docs[0]).toHaveProperty('slug');
      expect(docs[0]).toHaveProperty('version');
      expect(docs[0]).toHaveProperty('title');
      expect(docs[0]).toHaveProperty('content');
    });

    it('should include v5 and v6 documents', async () => {
      const docs = await getAllDocuments();
      
      const v5Docs = docs.filter(d => d.version === '5');
      const v6Docs = docs.filter(d => d.version === '6');
      
      expect(v5Docs.length).toBeGreaterThan(0);
      expect(v6Docs.length).toBeGreaterThan(0);
    });

    it('should cache documents on subsequent calls', async () => {
      const docs1 = await getAllDocuments();
      const docs2 = await getAllDocuments();
      
      // Should return same references (cached)
      expect(docs1).toEqual(docs2);
    });
  });

  describe('getDocumentBySlug', () => {
    it('should find root index by slug /en/6/', async () => {
      const doc = await getDocumentBySlug('/en/6/');
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toBe('/en/6/');
      expect(doc?.isIndex).toBe(true);
      expect(doc?.version).toBe('6');
    });

    it('should find nested page by slug', async () => {
      const doc = await getDocumentBySlug('/en/6/getting-started/installation/');
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toBe('/en/6/getting-started/installation/');
    });

    it('should find optional features nested pages', async () => {
      const doc = await getDocumentBySlug('/en/6/optional-features/linkfield/');
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toBe('/en/6/optional-features/linkfield/');
    });

    it('should be case-insensitive', async () => {
      const doc1 = await getDocumentBySlug('/en/6/getting-started/');
      const doc2 = await getDocumentBySlug('/en/6/GETTING-STARTED/');
      const doc3 = await getDocumentBySlug('/en/6/Getting-Started/');
      
      expect(doc1).toBeTruthy();
      expect(doc2).toBeTruthy();
      expect(doc3).toBeTruthy();
      expect(doc1?.slug).toBe(doc2?.slug);
      expect(doc2?.slug).toBe(doc3?.slug);
    });

    it('should return null for non-existent slug', async () => {
      const doc = await getDocumentBySlug('/en/6/does-not-exist/');
      
      expect(doc).toBeNull();
    });

    it('should handle slugs with or without leading slash', async () => {
      const doc1 = await getDocumentBySlug('/en/6/getting-started/');
      const doc2 = await getDocumentBySlug('en/6/getting-started/');
      
      expect(doc1?.slug).toBe(doc2?.slug);
    });

    it('should handle slugs with or without trailing slash', async () => {
      const doc1 = await getDocumentBySlug('/en/6/getting-started/');
      const doc2 = await getDocumentBySlug('/en/6/getting-started');
      
      expect(doc1?.slug).toBe(doc2?.slug);
    });

    it('should find v5 documents', async () => {
      const doc = await getDocumentBySlug('/en/5/getting-started/');
      
      expect(doc).toBeTruthy();
      expect(doc?.version).toBe('5');
    });
  });

  describe('getDocumentByParams', () => {
    it('should reconstruct slug from version and slug array', async () => {
      const doc = await getDocumentByParams('6', ['getting-started', 'installation']);
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toBe('/en/6/getting-started/installation/');
    });

    it('should handle root version page', async () => {
      const doc = await getDocumentByParams('6', undefined);
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toBe('/en/6/');
    });

    it('should handle empty slug array', async () => {
      const doc = await getDocumentByParams('6', []);
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toBe('/en/6/');
    });

    it('should handle deeply nested optional features', async () => {
      const doc = await getDocumentByParams('6', [
        'optional-features',
        'linkfield',
        'configuration',
        'basic'
      ]);
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toContain('/optional-features/linkfield');
    });
  });

  describe('getChildDocuments', () => {
    it('should return children of a parent slug', async () => {
      const children = await getChildDocuments('/en/6/getting-started/');
      
      expect(children.length).toBeGreaterThan(0);
      expect(children[0].parentSlug).toBe('/en/6/getting-started/');
    });

    it('should return empty array for parent with no children', async () => {
      const doc = await getDocumentBySlug('/en/6/');
      if (doc) {
        // Find a leaf page with no children
        const leaf = await getDocumentBySlug('/en/6/getting-started/installation/');
        if (leaf) {
          const children = await getChildDocuments(leaf.slug);
          expect(children).toEqual([]);
        }
      }
    });

    it('should respect hideSelf flag', async () => {
      const children = await getChildDocuments('/en/6/');
      
      // Should not include documents with hideSelf flag
      const allWithoutCheck = await getAllDocuments();
      const hidden = allWithoutCheck.filter(d => d.hideSelf && d.parentSlug === '/en/6/');
      
      const visibleSlugs = children.map(c => c.slug);
      hidden.forEach(h => {
        expect(visibleSlugs).not.toContain(h.slug);
      });
    });
  });

  describe('document structure', () => {
    it('should have consistent DocumentNode structure', async () => {
      const docs = await getAllDocuments();
      const doc = docs[0];
      
      expect(doc).toHaveProperty('slug');
      expect(doc).toHaveProperty('version');
      expect(doc).toHaveProperty('filePath');
      expect(doc).toHaveProperty('fileTitle');
      expect(doc).toHaveProperty('fileAbsolutePath');
      expect(doc).toHaveProperty('isIndex');
      expect(doc).toHaveProperty('parentSlug');
      expect(doc).toHaveProperty('title');
      expect(doc).toHaveProperty('content');
      expect(doc).toHaveProperty('category');
    });

    it('should strip numeric prefixes from paths', async () => {
      const doc = await getDocumentBySlug('/en/6/getting-started/');
      
      // The slug should not contain numeric prefixes
      expect(doc?.slug).not.toMatch(/\/\d+[-_]/);
    });

    it('should convert underscores to hyphens in slugs', async () => {
      const docs = await getAllDocuments();
      
      // Check that no underscores exist in slugs
      docs.forEach(doc => {
        expect(doc.slug).not.toContain('_');
      });
    });

    it('should have lowercase slugs', async () => {
      const docs = await getAllDocuments();
      
      docs.forEach(doc => {
        const pathPart = doc.slug.replace(/^\/en\/\d+\//, '').replace(/\/$/, '');
        expect(pathPart).toBe(pathPart.toLowerCase());
      });
    });
  });
});
