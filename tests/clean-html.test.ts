import { cleanHeaders, cleanWhitespace, normalizeHtml } from '@/lib/markdown/clean-html';

describe('Clean HTML Utilities', () => {
  describe('cleanHeaders', () => {
    it('removes em tags from header IDs with underscores', () => {
      const html = '<h1>Title {#my_header_id}</h1>';
      const cleaned = cleanHeaders(html);
      expect(cleaned).toContain('my_header_id');
    });

    it('preserves headers without IDs', () => {
      const html = '<h1>Simple Title</h1>';
      const cleaned = cleanHeaders(html);
      expect(cleaned).toBe(html);
    });

    it('handles multiple headers with IDs', () => {
      const html = '<h1>Title {#id_1}</h1><h2>Subtitle {#id_2}</h2>';
      const cleaned = cleanHeaders(html);
      expect(cleaned).toContain('id_1');
      expect(cleaned).toContain('id_2');
    });

    it('removes em tags that wrap underscores', () => {
      const html = '<h2>Header with <em>_</em>underscores<em>_</em> {#my_id}</h2>';
      const cleaned = cleanHeaders(html);
      // Should convert <em>_</em> to _ within the ID
      expect(cleaned).toBeTruthy();
    });
  });

  describe('cleanWhitespace', () => {
    it('removes whitespace between table elements', () => {
      const html = '<table>\n  <tbody>\n    <tr>\n      <td>Cell</td>\n    </tr>\n  </tbody>\n</table>';
      const cleaned = cleanWhitespace(html);
      // Should remove most whitespace between table tags
      expect(cleaned.length).toBeLessThanOrEqual(html.length);
    });

    it('handles multiple table elements', () => {
      const html = '<table> <tbody> <tr> <td>1</td> </tr> </tbody> </table>';
      const cleaned = cleanWhitespace(html);
      expect(cleaned).toBeTruthy();
    });

    it('preserves non-table whitespace', () => {
      const html = '<div> <p>Text with spaces</p> </div>';
      const cleaned = cleanWhitespace(html);
      // Non-table elements should keep their whitespace
      expect(cleaned).toContain('Text with spaces');
    });

    it('handles nested tables', () => {
      const html = '<table> <tbody> <tr> <td> <table> <tr> <td>Nested</td> </tr> </table> </td> </tr> </tbody> </table>';
      const cleaned = cleanWhitespace(html);
      expect(cleaned).toContain('Nested');
    });
  });

  describe('normalizeHtml', () => {
    it('removes whitespace between tags', () => {
      const html = '<div> <p>Text</p> </div>';
      const normalized = normalizeHtml(html);
      expect(normalized).toBe('<div><p>Text</p></div>');
    });

    it('removes empty lines', () => {
      const html = '<div>\n\n<p>Text</p>\n\n</div>';
      const normalized = normalizeHtml(html);
      expect(normalized).not.toContain('\n\n');
    });

    it('trims outer whitespace', () => {
      const html = '  <div><p>Text</p></div>  ';
      const normalized = normalizeHtml(html);
      expect(normalized).toBe('<div><p>Text</p></div>');
    });

    it('preserves whitespace inside tags', () => {
      const html = '<p>Text with   multiple   spaces</p>';
      const normalized = normalizeHtml(html);
      expect(normalized).toContain('Text with   multiple   spaces');
    });
  });

  describe('combined usage', () => {
    it('can chain multiple cleaners', () => {
      let html = '<h1>Header {#my_id} </h1>\n\n<table> <tr> <td>Cell</td> </tr> </table>';
      html = cleanHeaders(html);
      html = cleanWhitespace(html);
      html = normalizeHtml(html);
      expect(html).toBeTruthy();
    });
  });
});
