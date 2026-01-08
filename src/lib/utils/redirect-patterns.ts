/**
 * Pattern matching logic for URL redirects.
 * Handles three cases:
 * 1. /en/slug-path -> /en/{version}/slug-path (missing version after /en/)
 * 2. /slug-path -> /en/{version}/slug-path (missing /en/ prefix entirely)
 * 3. /{version}/slug-path -> /en/{version}/slug-path (missing /en/ prefix with version)
 */

/**
 * Match pathname against redirect patterns and return the redirect location.
 * Returns null if no patterns match.
 *
 * @param pathname - The URL pathname to test
 * @param defaultVersion - The default version to use when version is missing
 * @returns Redirect location as a string, or null if no match
 */
export function matchRedirectPattern(
  pathname: string,
  defaultVersion: string,
): string | null {
  // Pattern 1: /en/slug-path -> /en/{version}/slug-path
  // Match /en/ followed by at least one character that is not a /,
  // but exclude paths that already have a version
  const match1 = pathname.match(/^\/en\/([^/].+)/);
  if (match1 && !/^\/en\/[0-9]+\//.test(pathname)) {
    return `/en/${defaultVersion}/${match1[1]}`;
  }

  // Pattern 2: /slug-path -> /en/{version}/slug-path
  // Match paths that don't start with /en/ but start with /
  // followed by at least one character that is not /
  const match2 = pathname.match(/^\/([^/].+)/);
  if (match2 && !/^\/en\//.test(pathname)) {
    // Pattern 3 check: if pathname matches /{version}/slug-path,
    // add /en/ prefix
    const match3 = pathname.match(/^\/([0-9]+)\/.+/);
    if (match3) {
      return `/en${pathname}`;
    }
    // Otherwise, treat as Pattern 2: add /en/{version}/ prefix
    return `/en/${defaultVersion}/${match2[1]}`;
  }

  return null;
}
