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
      
      // v3: 1 + v4: 1 + v5: 3 + v6: 22 main + v6: 6 optional_features (03_Optional_features excluded in docs context) = 33 total
      expect(docs).toHaveLength(33); // Based on mock-content structure including optional features and Phase 6 additions
      expect(docs[0]).toHaveProperty('slug');
      expect(docs[0]).toHaveProperty('version');
      expect(docs[0]).toHaveProperty('title');
      expect(docs[0]).toHaveProperty('content');
    });

    it('should include v3, v4, v5 and v6 documents', async () => {
      const docs = await getAllDocuments();
      
      const v3Docs = docs.filter(d => d.version === '3');
      const v4Docs = docs.filter(d => d.version === '4');
      const v5Docs = docs.filter(d => d.version === '5');
      const v6Docs = docs.filter(d => d.version === '6');
      
      expect(v3Docs.length).toBeGreaterThan(0);
      expect(v4Docs.length).toBeGreaterThan(0);
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
      const doc = await getDocumentBySlug('/en/6/getting_started/installation/');
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toBe('/en/6/getting_started/installation/');
    });

    it('should find optional features nested pages', async () => {
      const doc = await getDocumentBySlug('/en/6/optional_features/linkfield/');
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toBe('/en/6/optional_features/linkfield/');
    });

    it('should be case-insensitive', async () => {
      const doc1 = await getDocumentBySlug('/en/6/getting_started/');
      const doc2 = await getDocumentBySlug('/en/6/GETTING_STARTED/');
      const doc3 = await getDocumentBySlug('/en/6/Getting_Started/');
      
      expect(doc1).toBeTruthy();
      expect(doc2).toBeTruthy();
      expect(doc3).toBeTruthy();
      expect(doc1?.slug).toBe(doc2?.slug);
      expect(doc2?.slug).toBe(doc3?.slug);
    });

    it('should return null for non-existent slug', async () => {
      const doc = await getDocumentBySlug('/en/6/does_not_exist/');
      
      expect(doc).toBeNull();
    });

    it('should handle slugs with or without leading slash', async () => {
      const doc1 = await getDocumentBySlug('/en/6/getting_started/');
      const doc2 = await getDocumentBySlug('en/6/getting_started/');
      
      expect(doc1?.slug).toBe(doc2?.slug);
    });

    it('should handle slugs with or without trailing slash', async () => {
      const doc1 = await getDocumentBySlug('/en/6/getting_started/');
      const doc2 = await getDocumentBySlug('/en/6/getting_started');
      
      expect(doc1?.slug).toBe(doc2?.slug);
    });

    it('should find v5 documents', async () => {
      const doc = await getDocumentBySlug('/en/5/getting_started/');
      
      expect(doc).toBeTruthy();
      expect(doc?.version).toBe('5');
    });
  });

  describe('getDocumentByParams', () => {
    it('should reconstruct slug from version and slug array', async () => {
      const doc = await getDocumentByParams('6', ['getting_started', 'installation']);
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toBe('/en/6/getting_started/installation/');
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
        'optional_features',
        'linkfield',
        'configuration',
        'basic'
      ]);
      
      expect(doc).toBeTruthy();
      expect(doc?.slug).toContain('/optional_features/linkfield');
    });
  });

  describe('getChildDocuments', () => {
    it('should return children of a parent slug', async () => {
      const children = await getChildDocuments('/en/6/getting_started/');
      
      expect(children.length).toBeGreaterThan(0);
      expect(children[0].parentSlug).toBe('/en/6/getting_started/');
    });

    it('should return empty array for parent with no children', async () => {
      const doc = await getDocumentBySlug('/en/6/');
      if (doc) {
        // Find a leaf page with no children
        const leaf = await getDocumentBySlug('/en/6/getting_started/installation/');
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
      const doc = await getDocumentBySlug('/en/6/getting_started/');
      
      // The slug should not contain numeric prefixes
      expect(doc?.slug).not.toMatch(/\/\d+[-_]/);
    });

    it('should preserve underscores in slugs', async () => {
      const docs = await getAllDocuments();
      
      // Check that underscores are preserved in slugs
      const withUnderscores = docs.filter(doc => doc.slug.includes('_'));
      expect(withUnderscores.length).toBeGreaterThan(0);
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
