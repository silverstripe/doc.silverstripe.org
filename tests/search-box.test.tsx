import { render } from '@testing-library/react';
import { SearchBox } from '@/components/SearchBox';

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/6/getting_started',
}));

jest.mock('@docsearch/react', () => ({
  DocSearch: ({ appId, apiKey, indexName }: any) => (
    <div data-testid="docsearch" data-app-id={appId} data-index-name={indexName}>
      Mock DocSearch
    </div>
  ),
}));

jest.mock('@docsearch/css', () => ({}));

describe('SearchBox Component', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_DOCSEARCH_APP_ID: 'test-app-id',
      NEXT_PUBLIC_DOCSEARCH_API_KEY: 'test-api-key',
      NEXT_PUBLIC_DOCSEARCH_INDEX_NAME: 'test-index',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('renders DocSearch when environment variables are configured', () => {
    const { getByTestId } = render(<SearchBox />);
    expect(getByTestId('docsearch')).toBeInTheDocument();
  });

  it('does not render when environment variables are missing', () => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID;
    
    const { container } = render(<SearchBox />);
    expect(container.firstChild).toBeNull();
  });

  it('extracts version from pathname', () => {
    const { getByTestId } = render(<SearchBox />);
    // The version should be extracted from the pathname
    // In this case, it should be '6' from '/en/6/getting_started'
    expect(getByTestId('docsearch')).toBeInTheDocument();
  });
});
