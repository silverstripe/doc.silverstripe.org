'use client';

import { DocSearch } from '@docsearch/react';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { getDefaultVersion } from '@/lib/versions/version-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@docsearch/css';

/**
 * Extracts the current version from the pathname
 */
function getVersionFromPathname(pathname: string): string {
  // pathname format: /en/{version}/{path}
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length >= 2 && parts[0] === 'en') {
    return parts[1];
  }
  return getDefaultVersion();
}

/**
 * Converts an absolute URL to a relative URL for Next.js navigation
 */
function makeUrlRelative(url: string): string {
  try {
    const a = document.createElement('a');
    a.href = url;
    return `${a.pathname}${a.hash}`;
  } catch {
    return url;
  }
}

/**
 * Search box component using Algolia DocSearch
 * Displays as a search input that opens a modal with results
 */
export function SearchBox() {
  const pathname = usePathname();
  const currentVersion = getVersionFromPathname(pathname);

  const appId = process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID;
  const apiKey = process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY;
  const indexName = process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME;

  // If not configured, don't render
  if (!appId || !apiKey || !indexName) {
    return null;
  }

  const handleNavigate = useCallback(({ itemUrl }: { itemUrl: string }) => {
    const relativeUrl = makeUrlRelative(itemUrl);
    window.location.href = relativeUrl;
  }, []);

  return (
    <DocSearch
      appId={appId}
      indexName={indexName}
      apiKey={apiKey}
      disableUserPersonalization
      searchParameters={{
        facetFilters: [`version:${currentVersion}`],
        hitsPerPage: 5,
      }}
      navigator={{
        navigate: handleNavigate,
      }}
      hitComponent={({ hit, children }) => {
        const relativeUrl = makeUrlRelative(hit.url);
        return (
          <a
            href={relativeUrl}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = relativeUrl;
            }}
          >
            {children}
          </a>
        );
      }}
    />
  );
}
