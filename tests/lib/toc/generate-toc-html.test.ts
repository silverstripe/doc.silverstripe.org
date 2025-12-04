/**
 * Tests for generateTocHtml and insertTocAfterH1 functions
 */

import { generateTocHtml, insertTocAfterH1 } from '@/lib/toc/generate-toc-html';
import type { TocHeading } from '@/lib/toc/extract-headings';

describe('generateTocHtml', () => {
  describe('basic TOC generation', () => {
    it('should generate HTML for headings', () => {
      const headings: TocHeading[] = [
        { id: 'first', text: 'First Section', level: 2 },
        { id: 'second', text: 'Second Section', level: 2 },
      ];

      const html = generateTocHtml(headings);

      expect(html).toContain('class="toc"');
      expect(html).toContain('aria-label="Table of contents"');
      expect(html).toContain('class="toc-title"');
      expect(html).toContain('On this page');
      expect(html).toContain('href="#first"');
      expect(html).toContain('href="#second"');
      expect(html).toContain('First Section');
      expect(html).toContain('Second Section');
    });

    it('should return empty string for empty headings array', () => {
      const html = generateTocHtml([]);

      expect(html).toBe('');
    });

    it('should include data-level attributes for indentation', () => {
      const headings: TocHeading[] = [
        { id: 'h2', text: 'H2 Heading', level: 2 },
        { id: 'h3', text: 'H3 Heading', level: 3 },
        { id: 'h4', text: 'H4 Heading', level: 4 },
      ];

      const html = generateTocHtml(headings);

      expect(html).toContain('data-level="2"');
      expect(html).toContain('data-level="3"');
      expect(html).toContain('data-level="4"');
    });
  });

  describe('HTML escaping', () => {
    it('should escape HTML entities in heading text', () => {
      const headings: TocHeading[] = [
        { id: 'test', text: 'Using <div> & "quotes"', level: 2 },
      ];

      const html = generateTocHtml(headings);

      expect(html).toContain('&lt;div&gt;');
      expect(html).toContain('&amp;');
      expect(html).toContain('&quot;quotes&quot;');
      expect(html).not.toContain('<div>');
    });

    it('should escape special characters in IDs', () => {
      const headings: TocHeading[] = [
        { id: 'test"id', text: 'Test', level: 2 },
      ];

      const html = generateTocHtml(headings);

      expect(html).toContain('href="#test&quot;id"');
    });
  });

  describe('structure', () => {
    it('should generate proper nav element with list', () => {
      const headings: TocHeading[] = [
        { id: 'test', text: 'Test', level: 2 },
      ];

      const html = generateTocHtml(headings);

      expect(html).toMatch(/<nav class="toc"[^>]*>/);
      expect(html).toContain('<h2 class="toc-title">');
      expect(html).toContain('<ul class="toc-list">');
      expect(html).toContain('<li class="toc-item"');
      expect(html).toContain('<a href="#test" class="toc-link">');
      expect(html).toContain('</nav>');
    });
  });
});

describe('insertTocAfterH1', () => {
  describe('basic insertion', () => {
    it('should insert TOC after closing H1 tag', () => {
      const content = '<h1 id="title">Page Title</h1><p>Content here.</p>';
      const tocHtml = '<nav class="toc">TOC</nav>';

      const result = insertTocAfterH1(content, tocHtml);

      expect(result).toBe('<h1 id="title">Page Title</h1>\n<nav class="toc">TOC</nav><p>Content here.</p>');
    });

    it('should handle H1 with anchor links', () => {
      const content = '<h1 id="title">Title<a class="heading-anchor">#</a></h1><p>Text</p>';
      const tocHtml = '<nav class="toc">TOC</nav>';

      const result = insertTocAfterH1(content, tocHtml);

      expect(result).toContain('</h1>\n<nav class="toc">TOC</nav>');
      expect(result).toContain('<p>Text</p>');
    });

    it('should handle uppercase H1 tag', () => {
      const content = '<H1>Title</H1><p>Content</p>';
      const tocHtml = '<nav class="toc">TOC</nav>';

      const result = insertTocAfterH1(content, tocHtml);

      expect(result).toContain('</H1>\n<nav class="toc">TOC</nav>');
    });
  });

  describe('edge cases', () => {
    it('should return original content when TOC is empty', () => {
      const content = '<h1>Title</h1><p>Content</p>';

      const result = insertTocAfterH1(content, '');

      expect(result).toBe(content);
    });

    it('should prepend TOC when no H1 found', () => {
      const content = '<h2>Section</h2><p>Content</p>';
      const tocHtml = '<nav class="toc">TOC</nav>';

      const result = insertTocAfterH1(content, tocHtml);

      expect(result).toBe('<nav class="toc">TOC</nav><h2>Section</h2><p>Content</p>');
    });

    it('should handle content with only H1', () => {
      const content = '<h1>Just Title</h1>';
      const tocHtml = '<nav class="toc">TOC</nav>';

      const result = insertTocAfterH1(content, tocHtml);

      expect(result).toBe('<h1>Just Title</h1>\n<nav class="toc">TOC</nav>');
    });

    it('should only match first H1 if multiple exist', () => {
      const content = '<h1>First</h1><h1>Second</h1>';
      const tocHtml = '<nav class="toc">TOC</nav>';

      const result = insertTocAfterH1(content, tocHtml);

      expect(result).toBe('<h1>First</h1>\n<nav class="toc">TOC</nav><h1>Second</h1>');
    });
  });
});
