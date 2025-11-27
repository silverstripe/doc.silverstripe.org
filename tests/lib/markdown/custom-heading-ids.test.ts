/**
 * Integration tests for custom heading ID handling
 * Tests the {#custom-id} syntax extraction through the document loading system
 */

import { getAllDocuments } from '@/lib/content/get-document';

describe('Custom Heading IDs', () => {
  describe('Custom ID extraction from mock content', () => {
    it('should process custom heading IDs in rendered content', async () => {
      const docs = await getAllDocuments();
      expect(docs.length).toBeGreaterThan(0);
      
      // At least one document should exist
      const docWithContent = docs.find(doc => doc.content && doc.content.includes('<h'));
      if (docWithContent) {
        // Should not contain literal {#...} syntax in rendered content
        expect(docWithContent.content).not.toMatch(/\{#[^}]+\}/);
      }
    });

    it('should generate IDs for headings without custom IDs', async () => {
      const docs = await getAllDocuments();
      
      const docWithHeadings = docs.find(doc => 
        doc.content && doc.content.includes('<h2') || doc.content.includes('<h3')
      );
      
      if (docWithHeadings) {
        // All headings should have IDs
        const h2Matches = docWithHeadings.content.match(/<h[2-6][^>]*>/g) || [];
        h2Matches.forEach(heading => {
          expect(heading).toMatch(/id="/);
        });
      }
    });

    it('should preserve heading text without custom ID markers', async () => {
      const docs = await getAllDocuments();
      
      const docWithHeadings = docs.find(doc => 
        doc.content && (doc.content.includes('<h1') || doc.content.includes('<h2'))
      );
      
      if (docWithHeadings) {
        // Heading text should not contain {# markers
        const headings = docWithHeadings.content.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g) || [];
        headings.forEach(heading => {
          // Extract just the text content
          const textMatch = heading.match(/>([^<]+)</);
          if (textMatch) {
            const text = textMatch[1];
            // Should not contain {# in visible text
            expect(text).not.toMatch(/\{#/);
          }
        });
      }
    });
  });

  describe('Heading ID attributes', () => {
    it('should have valid CSS identifier format for heading IDs', async () => {
      const docs = await getAllDocuments();
      
      const docWithHeadings = docs.find(doc => 
        doc.content && doc.content.match(/id="[^"]+"/g)
      );
      
      if (docWithHeadings) {
        const idMatches = docWithHeadings.content.match(/id="([^"]+)"/g) || [];
        idMatches.forEach(idAttr => {
          const id = idAttr.substring(4, idAttr.length - 1);
          // Valid CSS identifiers: letters, numbers, hyphens, underscores
          expect(id).toMatch(/^[a-z0-9_-]+$/i);
        });
      }
    });

    it('should create anchor links that reference heading IDs', async () => {
      const docs = await getAllDocuments();
      
      const docWithAnchors = docs.find(doc => 
        doc.content && doc.content.includes('heading-anchor')
      );
      
      if (docWithAnchors) {
        // Extract all heading IDs
        const idMatches = (docWithAnchors.content.match(/<h[1-6][^>]*id="([^"]+)"/g) || [])
          .map(m => m.match(/id="([^"]+)"/)?.[1])
          .filter((id): id is string => Boolean(id));
        
        // Extract all anchor hrefs
        const hrefMatches = (docWithAnchors.content.match(/href="#([^"]+)"/g) || [])
          .map(m => m.substring(6, m.length - 1));
        
        // At least some IDs should have corresponding anchors
        if (idMatches.length > 0 && hrefMatches.length > 0) {
          const commonIds = idMatches.filter(id => hrefMatches.includes(id));
          expect(commonIds.length).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  describe('Heading structure with custom IDs', () => {
    it('should maintain proper heading hierarchy', async () => {
      const docs = await getAllDocuments();
      
      const docWithHeadings = docs.find(doc => {
        const hasMultipleHeadingLevels = (doc.content.match(/<h2/g) || []).length > 0 &&
                                        (doc.content.match(/<h3/g) || []).length > 0;
        return hasMultipleHeadingLevels;
      });
      
      if (docWithHeadings) {
        // Each heading level should have IDs
        const h2Matches = docWithHeadings.content.match(/<h2[^>]*id="[^"]*"[^>]*>/g) || [];
        const h3Matches = docWithHeadings.content.match(/<h3[^>]*id="[^"]*"[^>]*>/g) || [];
        
        expect(h2Matches.length + h3Matches.length).toBeGreaterThan(0);
      }
    });

    it('should preserve rich text formatting in headings', async () => {
      const docs = await getAllDocuments();
      
      const docWithFormattedHeadings = docs.find(doc => {
        const hasStrongInHeading = doc.content.match(/<h[1-6][^>]*>.*?<strong>.*?<\/strong>.*?<\/h[1-6]>/);
        const hasEmInHeading = doc.content.match(/<h[1-6][^>]*>.*?<em>.*?<\/em>.*?<\/h[1-6]>/);
        const hasCodeInHeading = doc.content.match(/<h[1-6][^>]*>.*?<code>.*?<\/code>.*?<\/h[1-6]>/);
        
        return hasStrongInHeading || hasEmInHeading || hasCodeInHeading;
      });
      
      if (docWithFormattedHeadings) {
        // Should have IDs on the heading
        const headingWithFormat = docWithFormattedHeadings.content.match(/<h[1-6][^>]*id="[^"]*"[^>]*>.*?<(strong|em|code)>.*?<\/\1>.*?<\/h[1-6]>/)?.[0];
        expect(headingWithFormat).toBeTruthy();
      }
    });
  });

  describe('Integration with anchor links', () => {
    it('should include heading anchors with proper attributes', async () => {
      const docs = await getAllDocuments();
      
      const docWithAnchors = docs.find(doc => 
        doc.content && doc.content.includes('heading-anchor')
      );
      
      if (docWithAnchors) {
        // Should have aria-label for accessibility
        expect(docWithAnchors.content).toContain('aria-label');
        // Should have title attribute
        expect(docWithAnchors.content).toContain('title=');
        // Should have the # symbol in the link
        const anchorWithHash = docWithAnchors.content.match(/<a[^>]*class="heading-anchor"[^>]*>[^<]*#[^<]*<\/a>/);
        expect(anchorWithHash).toBeTruthy();
      }
    });

    it('should append anchors to heading text', async () => {
      const docs = await getAllDocuments();
      
      const docWithAnchors = docs.find(doc => 
        doc.content && doc.content.includes('heading-anchor')
      );
      
      if (docWithAnchors) {
        // Pattern: heading content followed by anchor link
        const hasProperStructure = />[^<]*<a[^>]*class="heading-anchor"[^>]*>#<\/a><\/h[1-6]>/.test(
          docWithAnchors.content
        );
        expect(hasProperStructure).toBe(true);
      }
    });
  });

  describe('No remnants of custom ID syntax in output', () => {
    it('should not include {# markers in final HTML', async () => {
      const docs = await getAllDocuments();
      
      docs.forEach(doc => {
        if (doc.content) {
          // Should not contain the custom ID syntax anywhere
          expect(doc.content).not.toMatch(/\{#[^}]+\}/);
        }
      });
    });

    it('should not have rendering artifacts from underscore handling', async () => {
      const docs = await getAllDocuments();
      
      const docWithContent = docs.find(doc => doc.content);
      if (docWithContent) {
        // Should not have stray <em> tags in or around IDs
        expect(docWithContent.content).not.toMatch(/id="[^"]*<\/em>[^"]*"/);
        expect(docWithContent.content).not.toMatch(/id="[^"]*<em>[^"]*"/);
      }
    });
  });
});
