import type { DocsContext } from '@/types/types';

interface Config {
  docsContext: DocsContext;
  docsearchAppId: string;
  docsearchApiKey: string;
  docsearchIndexName: string;
  useMockData: boolean;
}

export function getConfig(): Config {
  return {
    docsContext: (process.env.DOCS_CONTEXT || 'docs') as DocsContext,
    docsearchAppId: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID || '',
    docsearchApiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY || '',
    docsearchIndexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX || '',
    useMockData: process.env.NEXT_USE_MOCK_DATA === 'true',
  };
}

/**
 * Returns true when all three Algolia DocSearch keys are present.
 * Use this to conditionally render the search UI.
 */
export function isSearchConfigured(): boolean {
  const { docsearchAppId, docsearchApiKey, docsearchIndexName } = getConfig();
  return !!(docsearchAppId && docsearchApiKey && docsearchIndexName);
}
