import { rewriteAPILink } from './api-links';

/**
 * Rewrite API links in HTML to point to api.silverstripe.org
 * Converts href attributes with api: prefix to proper URLs
 * @example <a href="api:SilverStripe\ORM\DataList"> -> <a href="https://api.silverstripe.org/search/lookup?q=...">
 */
export function rewriteApiLinksInHtml(html: string, version: string): string {
  return html.replace(
    /href="api:([^"]+)"/g,
    (match, query) => {
      const newUrl = rewriteAPILink(`api:${query}`, version);
      return `href="${newUrl}" target="_blank" rel="noopener noreferrer"`;
    },
  );
}
