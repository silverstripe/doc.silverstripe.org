/**
 * HTML utility functions for escaping and cleaning HTML content
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * The react parser doesn't like whitespace nodes in tags that require
 * specific DOM node children (like table cells, rows, etc.)
 */
export function cleanWhitespace(html: string): string {
  let cleanHtml = html;
  const tagPattern = '(?:table|tbody|thead|tfoot|tr|th|td)';
  const rxp = new RegExp(`(</?${tagPattern}>)\\s+(</?${tagPattern}>)`);
  while (rxp.test(cleanHtml)) {
    cleanHtml = cleanHtml.replace(rxp, (_, tag1, tag2) => `${tag1}${tag2}`);
  }
  return cleanHtml;
}

/**
 * Remove extra whitespace and normalize HTML
 * Useful for cleaning up markdown-generated HTML
 */
export function normalizeHtml(html: string): string {
  return html
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();
}
