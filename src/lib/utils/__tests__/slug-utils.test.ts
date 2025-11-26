import { normalizeSlug, normalizeSlugForComparison } from '../slug-utils';

describe('normalizeSlug', () => {
  it('adds leading slash if missing', () => {
    expect(normalizeSlug('en/docs/page')).toBe('/en/docs/page/');
  });

  it('keeps leading slash if present', () => {
    expect(normalizeSlug('/en/docs/page')).toBe('/en/docs/page/');
  });

  it('adds trailing slash if missing', () => {
    expect(normalizeSlug('en/docs/page')).toBe('/en/docs/page/');
  });

  it('keeps trailing slash if present', () => {
    expect(normalizeSlug('/en/docs/page/')).toBe('/en/docs/page/');
  });

  it('handles just a slash', () => {
    expect(normalizeSlug('/')).toBe('/');
  });

  it('handles empty string', () => {
    expect(normalizeSlug('')).toBe('/');
  });

  it('normalizes paths with multiple segments', () => {
    expect(normalizeSlug('en/v5/getting-started/index')).toBe('/en/v5/getting-started/index/');
  });

  it('handles paths with double slashes', () => {
    expect(normalizeSlug('/en//docs//page/')).toBe('/en//docs//page/');
  });
});

describe('normalizeSlugForComparison', () => {
  it('normalizes and converts to lowercase', () => {
    expect(normalizeSlugForComparison('/EN/DOCS/PAGE')).toBe('/en/docs/page/');
  });

  it('handles mixed case with normalization', () => {
    expect(normalizeSlugForComparison('En/DoCs/Page')).toBe('/en/docs/page/');
  });

  it('maintains leading and trailing slashes while lowercasing', () => {
    expect(normalizeSlugForComparison('/PATH/TO/RESOURCE')).toBe('/path/to/resource/');
  });

  it('converts to lowercase consistently', () => {
    const slug1 = normalizeSlugForComparison('/EN/V5/GettingStarted');
    const slug2 = normalizeSlugForComparison('/en/v5/gettingstarted');
    expect(slug1).toBe(slug2);
  });
});
