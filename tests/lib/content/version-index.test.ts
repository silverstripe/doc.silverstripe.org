import {
  getAllDocuments,
  getDocumentBySlug,
  getDocumentByParams,
  clearDocumentCache
} from '@/lib/content/get-document';

/**
 * Tests specifically for version index pages
 * Ensures version root pages (/en/6/, /en/5/, etc.) are properly loaded
 * to prevent redirect loops during static builds
 */
describe('Version Index Pages', () => {
  beforeEach(() => {
    clearDocumentCache();
  });

  describe('getDocumentByParams for version root', () => {
    it('should return the v6 index document when slug is undefined', async () => {
      const doc = await getDocumentByParams('6', undefined);
      
      expect(doc).not.toBeNull();
      expect(doc?.slug).toBe('/en/6/');
      expect(doc?.version).toBe('6');
      expect(doc?.isIndex).toBe(true);
    });

    it('should return the v5 index document when slug is undefined', async () => {
      const doc = await getDocumentByParams('5', undefined);
      
      expect(doc).not.toBeNull();
      expect(doc?.slug).toBe('/en/5/');
      expect(doc?.version).toBe('5');
      expect(doc?.isIndex).toBe(true);
    });

    it('should return the v4 index document when slug is undefined', async () => {
      const doc = await getDocumentByParams('4', undefined);
      
      expect(doc).not.toBeNull();
      expect(doc?.slug).toBe('/en/4/');
      expect(doc?.version).toBe('4');
      expect(doc?.isIndex).toBe(true);
    });

    it('should return the v3 index document when slug is undefined', async () => {
      const doc = await getDocumentByParams('3', undefined);
      
      expect(doc).not.toBeNull();
      expect(doc?.slug).toBe('/en/3/');
      expect(doc?.version).toBe('3');
      expect(doc?.isIndex).toBe(true);
    });

    it('should return the v6 index document when slug is empty array', async () => {
      const doc = await getDocumentByParams('6', []);
      
      expect(doc).not.toBeNull();
      expect(doc?.slug).toBe('/en/6/');
      expect(doc?.version).toBe('6');
    });
  });

  describe('getDocumentBySlug for version root', () => {
    it('should return correct document for /en/6/', async () => {
      const doc = await getDocumentBySlug('/en/6/');
      
      expect(doc).not.toBeNull();
      expect(doc?.slug).toBe('/en/6/');
      expect(doc?.version).toBe('6');
      expect(doc?.isIndex).toBe(true);
      expect(doc?.title).toBeTruthy();
    });

    it('should return correct document for /en/5/', async () => {
      const doc = await getDocumentBySlug('/en/5/');
      
      expect(doc).not.toBeNull();
      expect(doc?.slug).toBe('/en/5/');
      expect(doc?.version).toBe('5');
    });

    it('should handle version root slugs with or without trailing slash', async () => {
      const doc1 = await getDocumentBySlug('/en/6/');
      const doc2 = await getDocumentBySlug('/en/6');
      
      expect(doc1?.slug).toBe(doc2?.slug);
    });
  });

  describe('version index documents in getAllDocuments', () => {
    it('should include index documents for all versions', async () => {
      const docs = await getAllDocuments();
      
      const v6Index = docs.find(d => d.slug === '/en/6/');
      const v5Index = docs.find(d => d.slug === '/en/5/');
      const v4Index = docs.find(d => d.slug === '/en/4/');
      const v3Index = docs.find(d => d.slug === '/en/3/');
      
      expect(v6Index).toBeTruthy();
      expect(v5Index).toBeTruthy();
      expect(v4Index).toBeTruthy();
      expect(v3Index).toBeTruthy();
    });

    it('should have version index documents with correct category', async () => {
      const docs = await getAllDocuments();
      
      const v6Index = docs.find(d => d.slug === '/en/6/');
      expect(v6Index?.category).toBe('docs');
    });
  });
});
