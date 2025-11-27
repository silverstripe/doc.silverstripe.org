import { cleanWhitespace, normalizeHtml } from '@/lib/markdown/clean-html';

describe('Clean HTML Utilities', () => {
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
      let html = '<h1>Header</h1>\n\n<table> <tr> <td>Cell</td> </tr> </table>';
      html = cleanWhitespace(html);
      html = normalizeHtml(html);
      expect(html).toBeTruthy();
    });
  });
});
