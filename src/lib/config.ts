interface Config {
  docsContext: 'docs' | 'user';
  docsearchAppId: string;
  docsearchApiKey: string;
  docsearchIndexName: string;
  useMockData: boolean;
}

export function getConfig(): Config {
  return {
    docsContext: (process.env.DOCS_CONTEXT || 'docs') as 'docs' | 'user',
    docsearchAppId: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID || '',
    docsearchApiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY || '',
    docsearchIndexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME || '',
    useMockData: process.env.NEXT_USE_MOCK_DATA === 'true'
  };
}
