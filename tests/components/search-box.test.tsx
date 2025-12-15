import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchBox } from '@/components/SearchBox';

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/6/getting_started',
}));

jest.mock('@docsearch/react', () => ({
  DocSearch: ({ appId, apiKey, indices }: any) => (
    <div
      data-testid="docsearch"
      data-app-id={appId}
      data-api-key={apiKey}
      data-indices={JSON.stringify(indices)}
    >
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
      NEXT_PUBLIC_DOCSEARCH_INDEX: 'test-index',
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
    const docSearchEl = getByTestId('docsearch');
    expect(docSearchEl).toBeInTheDocument();

    // Verify indices prop is correctly formatted
    const indicesData = JSON.parse(docSearchEl.getAttribute('data-indices') || '[]');
    expect(indicesData).toHaveLength(1);
    expect(indicesData[0]).toEqual({
      name: 'test-index',
      searchParameters: {
        facetFilters: ['version:6'],
        hitsPerPage: 5,
      },
    });
  });
});
