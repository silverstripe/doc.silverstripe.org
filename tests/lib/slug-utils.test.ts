import {
  normalizeSlug,
  normalizeSlugForComparison,
  buildSlugFromParams,
  extractVersionAndSlug,
  getAvailableVersions
} from '@/lib/slug-utils';

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

describe('Routing Utilities', () => {
  describe('buildSlugFromParams', () => {
    it('should build root version slug', () => {
      const slug = buildSlugFromParams({ version: '6' });
      expect(slug).toBe('/en/6/');
    });

    it('should build single-level slug', () => {
      const slug = buildSlugFromParams({ version: '6', slug: ['getting_started'] });
      expect(slug).toBe('/en/6/getting_started/');
    });

    it('should build multi-level slug', () => {
      const slug = buildSlugFromParams({
        version: '6',
        slug: ['developer_guides', 'model', 'data_types']
      });
      expect(slug).toBe('/en/6/developer_guides/model/data_types/');
    });

    it('should handle empty slug array', () => {
      const slug = buildSlugFromParams({ version: '6', slug: [] });
      expect(slug).toBe('/en/6/');
    });

    it('should work with v5', () => {
      const slug = buildSlugFromParams({ version: '5', slug: ['getting_started'] });
      expect(slug).toBe('/en/5/getting_started/');
    });
  });

  describe('extractVersionAndSlug', () => {
    it('should extract version and slug from full slug', () => {
      const { version, slug } = extractVersionAndSlug('/en/6/getting_started/');
      expect(version).toBe('6');
      expect(slug).toEqual(['getting_started']);
    });

    it('should extract multiple slug parts', () => {
      const { version, slug } = extractVersionAndSlug('/en/6/developer_guides/model/data_types/');
      expect(version).toBe('6');
      expect(slug).toEqual(['developer_guides', 'model', 'data_types']);
    });

    it('should handle slug without trailing slash', () => {
      const { version, slug } = extractVersionAndSlug('/en/6/getting_started');
      expect(version).toBe('6');
      expect(slug).toEqual(['getting_started']);
    });

    it('should handle slug without leading slash', () => {
      const { version, slug } = extractVersionAndSlug('en/6/getting_started/');
      expect(version).toBe('6');
      expect(slug).toEqual(['getting_started']);
    });

    it('should extract root version', () => {
      const { version, slug } = extractVersionAndSlug('/en/6/');
      expect(version).toBe('6');
      expect(slug).toEqual([]);
    });
  });

  describe('getAvailableVersions', () => {
    it('should return available versions', () => {
      const versions = getAvailableVersions();
      expect(versions).toContain('3');
      expect(versions).toContain('4');
      expect(versions).toContain('5');
      expect(versions).toContain('6');
    });

    it('should return array', () => {
      const versions = getAvailableVersions();
      expect(Array.isArray(versions)).toBe(true);
    });
  });
});
