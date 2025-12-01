import { getConfig } from '@/lib/config';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default docs context when DOCS_CONTEXT is not set', () => {
    delete process.env.DOCS_CONTEXT;
    const config = getConfig();
    expect(config.docsContext).toBe('docs');
  });

  it('should use DOCS_CONTEXT from environment', () => {
    process.env.DOCS_CONTEXT = 'user';
    const config = getConfig();
    expect(config.docsContext).toBe('user');
  });

  it('should return empty strings for Docsearch config when not set', () => {
    delete process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID;
    delete process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY;
    delete process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME;
    const config = getConfig();
    expect(config.docsearchAppId).toBe('');
    expect(config.docsearchApiKey).toBe('');
    expect(config.docsearchIndexName).toBe('');
  });

  it('should use mock data when NEXT_USE_MOCK_DATA is true', () => {
    process.env.NEXT_USE_MOCK_DATA = 'true';
    const config = getConfig();
    expect(config.useMockData).toBe(true);
  });

  it('should not use mock data by default', () => {
    delete process.env.NEXT_USE_MOCK_DATA;
    const config = getConfig();
    expect(config.useMockData).toBe(false);
  });
});
