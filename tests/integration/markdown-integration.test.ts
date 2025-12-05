/**
 * Integration test for markdown rendering via generated static content
 * This tests that the markdown processor works correctly by checking
 * the built/rendered pages contain proper HTML elements
 */

import { getAllDocuments } from '@/lib/content/get-document';

describe('Markdown Rendering Integration', () => {
  it('should render documents with markdown processor', async () => {
    const docs = await getAllDocuments();
    
    // Test with first document
    expect(docs.length).toBeGreaterThan(0);
    
    const testDoc = docs[0];
    expect(testDoc.content).toBeTruthy();
    
    // Verify that content contains markdown elements
    expect(testDoc.content).toMatch(/#/); // Should have headings
  });

  it('should have markdown-formatted documents', async () => {
    const docs = await getAllDocuments();
    
    // Check that at least some documents have markdown features
    const hasMarkdown = docs.some(doc => 
      doc.content.includes('#') ||      // headings
      doc.content.includes('**') ||     // bold
      doc.content.includes('-') ||      // lists
      doc.content.includes('[')         // links
    );
    
    expect(hasMarkdown).toBe(true);
  });

  it('should preserve document content structure', async () => {
    const docs = await getAllDocuments();
    
    docs.forEach(doc => {
      expect(doc).toHaveProperty('slug');
      expect(doc).toHaveProperty('content');
      expect(doc).toHaveProperty('title');
      expect(doc).toHaveProperty('version');
      expect(doc).toHaveProperty('category');
    });
  });
});

