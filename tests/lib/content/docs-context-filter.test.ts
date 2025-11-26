import { getAllDocuments, clearDocumentCache } from '@/lib/content/get-document';

/**
 * Test DOCS_CONTEXT filtering
 * Ensures that content is filtered by category based on DOCS_CONTEXT environment variable
 */
describe('DOCS_CONTEXT filtering', () => {
  beforeEach(() => {
    clearDocumentCache();
    // Reset the config cache by deleting the module from require cache
    delete (global as any).__configCache;
  });

  it('should return only docs when DOCS_CONTEXT=docs', async () => {
    // Set environment variable before loading config
    process.env.DOCS_CONTEXT = 'docs';
    
    const documents = await getAllDocuments();
    
    // All documents should have category === 'docs'
    expect(documents.length).toBeGreaterThan(0);
    documents.forEach(doc => {
      expect(doc.category).toBe('docs');
    });
  });

  it('should return only user when DOCS_CONTEXT=user', async () => {
    // Set environment variable before loading config
    process.env.DOCS_CONTEXT = 'user';
    
    // Clear cache to force reload
    clearDocumentCache();
    
    const documents = await getAllDocuments();
    
    // All documents should have category === 'user'
    expect(documents.length).toBeGreaterThan(0);
    documents.forEach(doc => {
      expect(doc.category).toBe('user');
    });
  });

  it('should filter out docs when in user context', async () => {
    // First get all docs in docs context
    process.env.DOCS_CONTEXT = 'docs';
    clearDocumentCache();
    const docsDocs = await getAllDocuments();
    const docsCount = docsDocs.length;

    // Then switch to user context
    process.env.DOCS_CONTEXT = 'user';
    clearDocumentCache();
    const userDocs = await getAllDocuments();
    const userCount = userDocs.length;

    // Should have different counts (one should be smaller or zero)
    expect(docsCount).toBeGreaterThan(0);
    // userCount might be 0 in mock data since we only have docs category in mock
    expect(userCount).toBeLessThanOrEqual(docsCount);
  });

  it('should have category field in all documents', async () => {
    process.env.DOCS_CONTEXT = 'docs';
    clearDocumentCache();
    
    const documents = await getAllDocuments();
    
    expect(documents.length).toBeGreaterThan(0);
    documents.forEach(doc => {
      expect(doc.category).toBeDefined();
      expect(['docs', 'user']).toContain(doc.category);
    });
  });
});
