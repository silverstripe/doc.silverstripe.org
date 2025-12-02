import { generateSlug, generateSlugFromFullPath } from '../slug-generator';

describe('slug-generator', () => {
  describe('generateSlug', () => {
    it('generates basic slug with version', () => {
      const slug = generateSlug('01_Getting_Started', 'v6');
      expect(slug).toBe('/en/6/getting_started/');
    });

    it('strips numeric prefixes from path segments', () => {
      const slug = generateSlug('01_getting_started/02_installation', 'v6');
      expect(slug).toBe('/en/6/getting_started/installation/');
    });

    it('converts to lowercase', () => {
      const slug = generateSlug('01_Getting_Started/02_Installation', 'v6');
      expect(slug).toBe('/en/6/getting_started/installation/');
    });

    it('preserves underscores', () => {
      const slug = generateSlug('advanced_options', 'v6');
      expect(slug).toBe('/en/6/advanced_options/');
    });

    it('handles version without v prefix', () => {
      const slug = generateSlug('getting_started', '6');
      expect(slug).toBe('/en/6/getting_started/');
    });

    it('handles version with v prefix', () => {
      const slug = generateSlug('getting_started', 'v5');
      expect(slug).toBe('/en/5/getting_started/');
    });

    it('supports optional features path', () => {
      const slug = generateSlug(
        'optional_features/linkfield/02_configuration',
        'v6',
        'optional_features',
      );
      expect(slug).toContain('/en/6/optional_features');
      expect(slug).toContain('linkfield');
    });

    it('handles deeply nested paths', () => {
      const slug = generateSlug(
        '01_Getting_Started/02_Advanced_Installation/03_Docker',
        'v6',
      );
      expect(slug).toBe('/en/6/getting_started/advanced_installation/docker/');
    });

    it('handles empty path', () => {
      const slug = generateSlug('', 'v6');
      expect(slug).toBe('/en/6/');
    });

    it('preserves path separator agnostic processing', () => {
      const slug1 = generateSlug('01_getting/02_started', 'v6');
      expect(slug1).toBe('/en/6/getting/started/');
    });
  });

  describe('generateSlugFromFullPath', () => {
    it('extracts directory from path and generates slug', () => {
      // This is a utility that extracts the directory and generates a slug
      // It's primarily for index files where the slug is the directory
      const slug = generateSlugFromFullPath(
        '01_Getting_Started/index.md',
        'v6',
      );
      expect(slug).toBe('/en/6/getting_started/');
    });

    it('generates slug from nested index path', () => {
      const slug = generateSlugFromFullPath(
        '02_developer_guides/01_model/index.md',
        'v6',
      );
      expect(slug).toBe('/en/6/developer_guides/model/');
    });

    it('supports optional parameter', () => {
      const slug = generateSlugFromFullPath(
        'optional_features/linkfield/02_configuration/index.md',
        'v6',
        'optional_features',
      );
      expect(slug).toContain('/en/6/optional_features');
    });

    it('handles non-index files by using their directory', () => {
      // For non-index files, generateSlugFromFullPath uses the directory
      // which means the filename is lost
      const slug = generateSlugFromFullPath(
        '01_getting_started/readme.md',
        'v6',
      );
      expect(slug).toBe('/en/6/getting_started/');
    });
  });

  describe('case-insensitive routing', () => {
    it('treats different capitalizations identically', () => {
      const slug1 = generateSlug('01_Getting_Started/02_Installation', 'v6');
      const slug2 = generateSlug('01_getting_started/02_installation', 'v6');
      const slug3 = generateSlug('01_GETTING_STARTED/02_INSTALLATION', 'v6');

      expect(slug1).toBe(slug2);
      expect(slug2).toBe(slug3);
      expect(slug1).toBe('/en/6/getting_started/installation/');
    });
  });
});
