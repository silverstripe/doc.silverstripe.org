import '@testing-library/jest-dom';

// Ensure tests use mock data
process.env.NEXT_USE_MOCK_DATA = 'true';

// Mock window.scrollTo for tests
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: () => {},
  });
}
