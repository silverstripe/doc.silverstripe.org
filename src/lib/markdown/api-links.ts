/**
 * Utilities for handling API documentation links in markdown
 * Supports formats: [api:Class], [api:Class::method()], [api:Class->property]
 */

import { getDefaultVersion } from '@/lib/versions/version-utils';

/**
 * Get the current version from context (used during markdown processing)
 * This will be provided by the processor
 */
let currentVersion = getDefaultVersion();

export function setCurrentVersion(version: string): void {
  currentVersion = version;
}

export function getCurrentVersion(): string {
  return currentVersion;
}

/**
 * Rewrite an API link href to the api.silverstripe.org URL
 * Handles class names with namespaces and URL encodes them properly
 * @example api:SilverStripe\ORM\DataList -> https://api.silverstripe.org/search/lookup?q=SilverStripe%5CORM%5CDataList&version=6
 * @example api:SilverStripe\ORM\DataList::filter() -> https://api.silverstripe.org/search/lookup?q=SilverStripe%5CORM%5CDataList::filter()&version=6
 * @example api:SilverStripe\ORM\DataList->count -> https://api.silverstripe.org/search/lookup?q=SilverStripe%5CORM%5CDataList->count&version=6
 */
export function rewriteAPILink(link: string, version?: string): string {
  const match = link.match(/^api:(.*)/);
  if (!match) {
    return link;
  }

  let query = match[1];
  const versionToUse = version || getCurrentVersion();

  // First decode any pre-encoded characters to avoid double-encoding
  // This handles cases where backslashes were already encoded as %5C
  try {
    query = decodeURIComponent(query);
  } catch {
    // If decoding fails (malformed encoding), use original query
  }

  // Encode the query, but preserve :: -> () and backslashes
  // Use a custom encoder that only encodes what we need
  const encodedQuery = query
    .split('')
    .map((char) => {
      if (char === '\\') return '%5C';
      if (char === ' ') return '%20';
      if (char === '$') return '%24';
      // Don't encode these - they're valid in URLs and we want to preserve them
      if (/[a-zA-Z0-9_:\-().<>]/.test(char)) return char;
      return encodeURIComponent(char);
    })
    .join('');

  return `https://api.silverstripe.org/search/lookup?q=${encodedQuery}&version=${versionToUse}`;
}

/**
 * Convert shorthand [api:Something] syntax to proper markdown links
 * Handles variations with :: (methods) and -> (properties)
 * @example [api:SilverStripe\ORM\DataList] ->
 *   [SilverStripe\ORM\DataList](api:SilverStripe\ORM\DataList)
 * @example [api:SilverStripe\ORM\DataList::filter()] ->
 *   [SilverStripe\ORM\DataList::filter()](api:SilverStripe\ORM\DataList::filter())
 */
export function cleanApiTags(markdown: string): string {
  // Match [api:...] but only if not followed by (
  // This regex captures the api query and ensures we don't process [api:...](...)
  return markdown.replace(
    /\[api:(.*?)\](?!\()/g,
    (_, query) => `[${query}](api:${query})`,
  );
}
