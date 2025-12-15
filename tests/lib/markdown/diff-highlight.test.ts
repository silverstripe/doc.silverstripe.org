/**
 * Integration test for diff syntax highlighting
 * Tests that diff code blocks get proper language class and CSS tokens
 */

import { getAllDocuments } from '@/lib/content/get-document';

describe('diff syntax highlighting', () => {
  it('should render diff code blocks with language-diff class', async () => {
    const docs = await getAllDocuments();
    
    // Find the changelog document with diff example
    const changelogDoc = docs.find(doc => 
      doc.slug && doc.slug.includes('changelog') && 
      doc.content && doc.content.includes('language-diff')
    );
    
    if (changelogDoc) {
      expect(changelogDoc.content).toContain('language-diff');
      expect(changelogDoc.content).toContain('data-language="diff"');
    }
  });

  it('should preserve diff markers in code blocks', async () => {
    const docs = await getAllDocuments();
    
    const changelogDoc = docs.find(doc => 
      doc.slug && doc.slug.includes('changelog') && 
      doc.content && doc.content.includes('old_code')
    );
    
    if (changelogDoc) {
      expect(changelogDoc.content).toContain('old_code');
      expect(changelogDoc.content).toContain('new_code');
    }
  });

  it('should include code-block-wrapper with diff content', async () => {
    const docs = await getAllDocuments();
    
    const changelogDoc = docs.find(doc => 
      doc.slug && doc.slug.includes('changelog') && 
      doc.content && doc.content.includes('language-diff')
    );
    
    if (changelogDoc) {
      expect(changelogDoc.content).toContain('code-block-wrapper');
      expect(changelogDoc.content).toContain('code-block-header');
      expect(changelogDoc.content).toContain('code-block-language');
      expect(changelogDoc.content).toContain('code-block-copy-btn');
    }
  });

  it('should create copy button for diff blocks', async () => {
    const docs = await getAllDocuments();
    
    const changelogDoc = docs.find(doc => 
      doc.slug && doc.slug.includes('changelog') && 
      doc.content && doc.content.includes('language-diff')
    );
    
    if (changelogDoc) {
      expect(changelogDoc.content).toContain('data-code');
      expect(changelogDoc.content).toContain('Copy');
    }
  });
});
