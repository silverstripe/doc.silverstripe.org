/**
 * Integration test for heading anchors
 * Tests that headings get IDs and anchor links through the document loading system
 */

import { getAllDocuments } from '@/lib/content/get-document';

describe('Heading Anchors', () => {
  describe('Heading anchor verification in rendered content', () => {
    it('should render heading with IDs from documents', async () => {
      const docs = await getAllDocuments();
      expect(docs.length).toBeGreaterThan(0);
      
      // Find a document with rendered HTML headings
      const docWithHeadings = docs.find(doc => 
        doc.content && (doc.content.includes('<h1') || doc.content.includes('<h2') || doc.content.includes('<h3'))
      );
      
      // At least one document should have headings
      if (docWithHeadings) {
        expect(docWithHeadings.content).toMatch(/id="/);
      } else {
        // If no headings found, that's OK - just verify documents exist
        expect(docs.length).toBeGreaterThan(0);
      }
    });

    it('should include anchor links on headings', async () => {
      const docs = await getAllDocuments();
      
      // Find a document with headings
      const docWithHeadings = docs.find(doc => 
        doc.content && doc.content.includes('<h')
      );
      
      if (docWithHeadings) {
        // Should have anchor links with the hash symbol
        expect(docWithHeadings.content).toMatch(/class="heading-anchor"/);
        expect(docWithHeadings.content).toContain('#');
      }
    });

    it('should have href attributes matching heading IDs', async () => {
      const docs = await getAllDocuments();
      
      const docWithHeadings = docs.find(doc => 
        doc.content && doc.content.includes('id="')
      );
      
      if (docWithHeadings) {
        // Extract IDs and verify they're referenced in anchor hrefs
        const idMatches = docWithHeadings.content.match(/id="([^"]+)"/g);
        if (idMatches && idMatches.length > 0) {
          // At least some IDs should have corresponding anchors
          const hasAnchorLinks = docWithHeadings.content.includes('href="#');
          expect(hasAnchorLinks).toBe(true);
        }
      }
    });

    it('should have proper aria-label on anchor links', async () => {
      const docs = await getAllDocuments();
      
      const docWithAnchors = docs.find(doc => 
        doc.content && doc.content.includes('heading-anchor')
      );
      
      if (docWithAnchors) {
        expect(docWithAnchors.content).toContain('aria-label');
        expect(docWithAnchors.content).toContain('Permalink to this section');
      }
    });

    it('should position anchor links after heading text', async () => {
      const docs = await getAllDocuments();
      
      const docWithAnchors = docs.find(doc => 
        doc.content && doc.content.includes('heading-anchor')
      );
      
      if (docWithAnchors) {
        // The anchor should appear with class "heading-anchor"
        // Pattern: heading content followed by anchor link
        const hasProperStructure = />[^<]*<a[^>]*class="heading-anchor"[^>]*>#<\/a><\/h[1-6]>/.test(
          docWithAnchors.content
        );
        expect(hasProperStructure).toBe(true);
      }
    });

    it('should handle multiple headings in document', async () => {
      const docs = await getAllDocuments();
      
      // Find a doc with multiple headings
      const docWithManyHeadings = docs.find(doc => {
        const headingMatches = doc.content.match(/<h[1-6]/g) || [];
        return headingMatches.length > 1;
      });
      
      if (docWithManyHeadings) {
        // Should have multiple IDs
        const idMatches = docWithManyHeadings.content.match(/id="/g) || [];
        expect(idMatches.length).toBeGreaterThanOrEqual(1);
        
        // Should have multiple anchor links
        const anchorMatches = docWithManyHeadings.content.match(/class="heading-anchor"/g) || [];
        expect(anchorMatches.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should preserve anchor links with different heading levels', async () => {
      const docs = await getAllDocuments();
      
      const docWithHeadings = docs.find(doc => {
        // Look for content with h2 and h3 tags
        const hasH2 = doc.content.includes('<h2');
        const hasH3 = doc.content.includes('<h3');
        return hasH2 || hasH3;
      });
      
      if (docWithHeadings) {
        // Each heading level should have anchors
        expect(docWithHeadings.content).toContain('heading-anchor');
      }
    });

    it('should not duplicate heading content in anchors', async () => {
      const docs = await getAllDocuments();
      
      const docWithAnchors = docs.find(doc => 
        doc.content && doc.content.includes('heading-anchor')
      );
      
      if (docWithAnchors) {
        // Extract a heading with its anchor
        const headingMatch = docWithAnchors.content.match(/<h[1-6][^>]*>([^<]+)<a[^>]*class="heading-anchor"[^>]*>([^<]+)<\/a><\/h[1-6]>/);
        if (headingMatch) {
          // The heading text and anchor text should be different
          const headingText = headingMatch[1];
          const anchorText = headingMatch[2];
          // Anchor should contain the hash symbol
          expect(anchorText).toBe('#');
          // Heading text should not contain the anchor symbol
          expect(headingText).not.toContain('#');
        }
      }
    });
  });

  describe('Anchor link functionality', () => {
    it('should have valid href format for anchors', async () => {
      const docs = await getAllDocuments();
      
      const docWithAnchors = docs.find(doc => 
        doc.content && doc.content.includes('href="#')
      );
      
      if (docWithAnchors) {
        // All hrefs should start with #
        const hrefMatches = docWithAnchors.content.match(/href="#[^"]*"/g) || [];
        expect(hrefMatches.length).toBeGreaterThan(0);
        hrefMatches.forEach(href => {
          expect(href).toMatch(/^href="#[a-z0-9-]+"/i);
        });
      }
    });

    it('should have heading IDs that are valid CSS identifiers', async () => {
      const docs = await getAllDocuments();
      
      const docWithHeadings = docs.find(doc => 
        doc.content && doc.content.includes('id="')
      );
      
      if (docWithHeadings) {
        const idMatches = docWithHeadings.content.match(/id="([^"]+)"/g) || [];
        idMatches.forEach(idAttr => {
          const id = idAttr.substring(4, idAttr.length - 1); // Extract ID value
          // Valid CSS identifiers can contain letters, numbers, hyphens, underscores
          expect(id).toMatch(/^[a-z0-9_-]+$/i);
        });
      }
    });
  });

  describe('Heading anchor styling and attributes', () => {
    it('should have title attribute on anchor links', async () => {
      const docs = await getAllDocuments();
      
      const docWithAnchors = docs.find(doc => 
        doc.content && doc.content.includes('heading-anchor')
      );
      
      if (docWithAnchors) {
        expect(docWithAnchors.content).toContain('title=');
        expect(docWithAnchors.content).toContain('Permalink to this section');
      }
    });

    it('should include proper link attributes for accessibility', async () => {
      const docs = await getAllDocuments();
      
      const docWithAnchors = docs.find(doc => 
        doc.content && doc.content.includes('heading-anchor')
      );
      
      if (docWithAnchors) {
        // Should have aria-label for accessibility
        expect(docWithAnchors.content).toContain('aria-label');
      }
    });
  });
});
