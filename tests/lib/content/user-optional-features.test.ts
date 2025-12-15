import { getAllDocuments, getChildDocuments, clearDocumentCache } from '@/lib/content/get-document';

/**
 * Test user site optional features navigation
 * Ensures optional features appear as children of the Optional Features section in user context
 */
describe('User optional features navigation', () => {
  beforeEach(() => {
    clearDocumentCache();
    delete (global as any).__configCache;
  });

  afterEach(() => {
    // Reset to default context
    process.env.DOCS_CONTEXT = 'docs';
    clearDocumentCache();
  });

  describe('User context optional features hierarchy', () => {
    beforeEach(() => {
      process.env.DOCS_CONTEXT = 'user';
      clearDocumentCache();
    });

    it('should load 03_Optional_features section in user context', async () => {
      const documents = await getAllDocuments();
      
      // Find the Optional Features section from 03_Optional_features
      const optionalFeaturesSection = documents.find(
        doc => doc.slug === '/en/6/optional_features/' && doc.isIndex
      );
      
      expect(optionalFeaturesSection).toBeTruthy();
      expect(optionalFeaturesSection?.title).toBe('Optional Features');
      expect(optionalFeaturesSection?.category).toBe('user');
    });

    it('should have optional feature modules as children of Optional Features section', async () => {
      const documents = await getAllDocuments();
      
      // Find optional feature modules (linkfield, etc.)
      const linkfieldIndex = documents.find(
        doc => doc.slug === '/en/6/optional_features/linkfield/' && doc.isIndex
      );
      
      // In user context, optional features should be children of /en/6/optional_features/
      expect(linkfieldIndex).toBeTruthy();
      expect(linkfieldIndex?.parentSlug).toBe('/en/6/optional_features/');
      expect(linkfieldIndex?.category).toBe('user');
    });

    it('should have correct optionalFeature field set', async () => {
      const documents = await getAllDocuments();
      
      // Find linkfield documents
      const linkfieldDocs = documents.filter(
        doc => doc.slug.includes('/optional_features/linkfield/')
      );
      
      expect(linkfieldDocs.length).toBeGreaterThan(0);
      
      // All linkfield docs should have optionalFeature set
      linkfieldDocs.forEach(doc => {
        expect(doc.optionalFeature).toBe('linkfield');
      });
    });

    it('should return optional features as children of Optional Features section', async () => {
      const children = await getChildDocuments('/en/6/optional_features/');
      
      // Should include optional feature modules
      const childSlugs = children.map(c => c.slug);
      expect(childSlugs).toContain('/en/6/optional_features/linkfield/');
    });
  });

  describe('Docs context optional features hierarchy', () => {
    beforeEach(() => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();
    });

    it('should NOT load 03_Optional_features in docs context', async () => {
      const documents = await getAllDocuments();
      
      // In docs context, 03_Optional_features should be excluded (deprecated)
      const from03OptionalFeatures = documents.filter(
        doc => doc.filePath.includes('03_Optional_features')
      );
      
      expect(from03OptionalFeatures).toHaveLength(0);
    });

    it('should have optional_features index as child of version root in docs context', async () => {
      const documents = await getAllDocuments();
      
      // Find the optional_features index
      const optionalFeaturesIndex = documents.find(
        doc => doc.slug === '/en/6/optional_features/' && doc.isIndex
      );
      
      // In docs context, optional_features index is a root child
      expect(optionalFeaturesIndex).toBeTruthy();
      expect(optionalFeaturesIndex?.parentSlug).toBe('/en/6/');
      expect(optionalFeaturesIndex?.category).toBe('docs');
    });

    it('should have optional feature modules as children of optional_features index', async () => {
      const documents = await getAllDocuments();
      
      const linkfieldIndex = documents.find(
        doc => doc.slug === '/en/6/optional_features/linkfield/' && doc.isIndex
      );
      
      expect(linkfieldIndex).toBeTruthy();
      expect(linkfieldIndex?.parentSlug).toBe('/en/6/optional_features/');
    });
  });

  describe('Category field is correctly set', () => {
    it('should have user category for all docs in user context', async () => {
      process.env.DOCS_CONTEXT = 'user';
      clearDocumentCache();
      
      const documents = await getAllDocuments();
      
      expect(documents.length).toBeGreaterThan(0);
      documents.forEach(doc => {
        expect(doc.category).toBe('user');
      });
    });

    it('should have docs category for all docs in docs context', async () => {
      process.env.DOCS_CONTEXT = 'docs';
      clearDocumentCache();
      
      const documents = await getAllDocuments();
      
      expect(documents.length).toBeGreaterThan(0);
      documents.forEach(doc => {
        expect(doc.category).toBe('docs');
      });
    });
  });
});
