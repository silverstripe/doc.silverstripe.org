/**
 * HTML cleanup utilities
 * Ported from Gatsby utils for consistent rendering
 */

/**
 * Removes the <em> tags caused by underscores in the {#id_with_underscores}
 * Used when headers contain IDs with underscores
 */
export function cleanHeaders(html: string): string {
  return html.replace(
    /<h([0-9])>(.*?)(\{#.*?<\/?em>.*?})/g,
    (_, level, title, tag) => `<h${level}>${title} ${tag.replace(/<\/?em>/g, '_')}`
  );
}

/**
 * The react parser doesn't like whitespace nodes in tags that require
 * specific DOM node children (like table cells, rows, etc.)
 */
export function cleanWhitespace(html: string): string {
  let cleanHtml = html;
  const rxp = /(\<\/?(?:table|tbody|thead|tfoot|tr|th|td)\>)\s+(\<\/?(?:table|tbody|thead|tfoot|tr|th|td)\>)/;
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
