import {
  buildSlugFromParams,
  extractVersionAndSlug,
  getAvailableVersions
} from '@/lib/routing';

describe('Routing Utilities', () => {
  describe('buildSlugFromParams', () => {
    it('should build root version slug', () => {
      const slug = buildSlugFromParams({ version: '6' });
      expect(slug).toBe('/en/6/');
    });

    it('should build single-level slug', () => {
      const slug = buildSlugFromParams({ version: '6', slug: ['getting-started'] });
      expect(slug).toBe('/en/6/getting-started/');
    });

    it('should build multi-level slug', () => {
      const slug = buildSlugFromParams({
        version: '6',
        slug: ['developer-guides', 'model', 'data-types']
      });
      expect(slug).toBe('/en/6/developer-guides/model/data-types/');
    });

    it('should handle empty slug array', () => {
      const slug = buildSlugFromParams({ version: '6', slug: [] });
      expect(slug).toBe('/en/6/');
    });

    it('should work with v5', () => {
      const slug = buildSlugFromParams({ version: '5', slug: ['getting-started'] });
      expect(slug).toBe('/en/5/getting-started/');
    });
  });

  describe('extractVersionAndSlug', () => {
    it('should extract version and slug from full slug', () => {
      const { version, slug } = extractVersionAndSlug('/en/6/getting-started/');
      expect(version).toBe('6');
      expect(slug).toEqual(['getting-started']);
    });

    it('should extract multiple slug parts', () => {
      const { version, slug } = extractVersionAndSlug('/en/6/developer-guides/model/data-types/');
      expect(version).toBe('6');
      expect(slug).toEqual(['developer-guides', 'model', 'data-types']);
    });

    it('should handle slug without trailing slash', () => {
      const { version, slug } = extractVersionAndSlug('/en/6/getting-started');
      expect(version).toBe('6');
      expect(slug).toEqual(['getting-started']);
    });

    it('should handle slug without leading slash', () => {
      const { version, slug } = extractVersionAndSlug('en/6/getting-started/');
      expect(version).toBe('6');
      expect(slug).toEqual(['getting-started']);
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
      expect(versions).toContain('5');
      expect(versions).toContain('6');
    });

    it('should return array', () => {
      const versions = getAvailableVersions();
      expect(Array.isArray(versions)).toBe(true);
    });
  });
});
