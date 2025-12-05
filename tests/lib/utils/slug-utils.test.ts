import {
  normalizeSlug,
  normalizeSlugForComparison,
  buildSlugFromParams,
  extractVersionAndSlug,
  getAvailableVersions,
  doesSlugExistInVersion,
  getFallbackSlugForVersion,
  extractVersionAndFeatureFromSlug,
} from '@/lib/utils/slug-utils';
import { DocumentNode } from '@/types/types';

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

describe('doesSlugExistInVersion', () => {
  const mockDocs: DocumentNode[] = [
    {
      slug: '/en/6/getting-started/',
      version: '6',
      filePath: 'index.md',
      fileTitle: 'Getting Started',
      fileAbsolutePath: '/path/to/index.md',
      isIndex: true,
      parentSlug: '/en/6/',
      title: 'Getting Started',
      content: 'content',
      category: 'docs',
    },
    {
      slug: '/en/6/api/index/',
      version: '6',
      filePath: 'api/index.md',
      fileTitle: 'API',
      fileAbsolutePath: '/path/to/api/index.md',
      isIndex: true,
      parentSlug: '/en/6/',
      title: 'API',
      content: 'content',
      category: 'docs',
    },
    {
      slug: '/en/5/getting-started/',
      version: '5',
      filePath: 'index.md',
      fileTitle: 'Getting Started',
      fileAbsolutePath: '/path/to/index.md',
      isIndex: true,
      parentSlug: '/en/5/',
      title: 'Getting Started',
      content: 'content',
      category: 'docs',
    },
  ];

  it('returns true for existing slug in version', () => {
    const result = doesSlugExistInVersion('/en/6/getting-started/', mockDocs, '6');
    expect(result).toBe(true);
  });

  it('returns false for non-existing slug in version', () => {
    const result = doesSlugExistInVersion('/en/6/nonexistent/', mockDocs, '6');
    expect(result).toBe(false);
  });

  it('returns false when slug exists in different version', () => {
    const result = doesSlugExistInVersion('/en/5/api/index/', mockDocs, '6');
    expect(result).toBe(false);
  });

  it('performs case-insensitive match', () => {
    const result = doesSlugExistInVersion('/en/6/Getting-Started/', mockDocs, '6');
    expect(result).toBe(true);
  });

  it('handles slugs without trailing slash', () => {
    const result = doesSlugExistInVersion('/en/6/api/index', mockDocs, '6');
    expect(result).toBe(true);
  });
});

describe('getFallbackSlugForVersion', () => {
  const mockDocs: DocumentNode[] = [
    {
      slug: '/en/6/getting-started/',
      version: '6',
      filePath: 'index.md',
      fileTitle: 'Getting Started',
      fileAbsolutePath: '/path/to/index.md',
      isIndex: true,
      parentSlug: '/en/6/',
      title: 'Getting Started',
      content: 'content',
      category: 'docs',
    },
    {
      slug: '/en/5/getting-started/',
      version: '5',
      filePath: 'index.md',
      fileTitle: 'Getting Started',
      fileAbsolutePath: '/path/to/index.md',
      isIndex: true,
      parentSlug: '/en/5/',
      title: 'Getting Started',
      content: 'content',
      category: 'docs',
    },
    {
      slug: '/en/5/admin-interface/',
      version: '5',
      filePath: 'index.md',
      fileTitle: 'Admin Interface',
      fileAbsolutePath: '/path/to/index.md',
      isIndex: true,
      parentSlug: '/en/5/',
      title: 'Admin Interface',
      content: 'content',
      category: 'docs',
    },
  ];

  it('returns equivalent path if it exists in target version', () => {
    const result = getFallbackSlugForVersion('/en/6/getting-started/', '5', mockDocs);
    expect(result).toBe('/en/5/getting-started/');
  });

  it('returns root version if path does not exist in target version', () => {
    const result = getFallbackSlugForVersion('/en/6/api-docs/', '5', mockDocs);
    expect(result).toBe('/en/5/');
  });

  it('handles pages unique to target version', () => {
    const result = getFallbackSlugForVersion('/en/6/admin-interface/', '5', mockDocs);
    expect(result).toBe('/en/5/admin-interface/');
  });

  it('handles versions with different content', () => {
    const result = getFallbackSlugForVersion('/en/5/nonexistent-v5-page/', '6', mockDocs);
    expect(result).toBe('/en/6/');
  });
});

describe('extractVersionAndFeatureFromSlug', () => {
  it('extracts version from core docs slug', () => {
    const result = extractVersionAndFeatureFromSlug('/en/6/getting-started/');
    expect(result.version).toBe('6');
    expect(result.optionalFeature).toBeNull();
  });

  it('extracts version and optional feature from feature slug', () => {
    const result = extractVersionAndFeatureFromSlug('/en/6/optional_features/linkfield/');
    expect(result.version).toBe('6');
    expect(result.optionalFeature).toBe('linkfield');
  });

  it('extracts version and nested optional feature path', () => {
    const result = extractVersionAndFeatureFromSlug('/en/6/optional_features/linkfield/configuration/');
    expect(result.version).toBe('6');
    expect(result.optionalFeature).toBe('linkfield');
  });

  it('handles v5 paths', () => {
    const result = extractVersionAndFeatureFromSlug('/en/5/getting-started/');
    expect(result.version).toBe('5');
    expect(result.optionalFeature).toBeNull();
  });

  it('defaults to v6 for invalid paths', () => {
    const result = extractVersionAndFeatureFromSlug('/invalid/');
    expect(result.version).toBe('6');
    expect(result.optionalFeature).toBeNull();
  });
});
