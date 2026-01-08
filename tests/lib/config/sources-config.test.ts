import { getSourceConfig, buildGithubEditUrl } from '../../../sources-config';

describe('Sources Config (Shared Functions)', () => {
  describe('getSourceConfig with docs category', () => {
    it('should return main docs config for version 6', () => {
      const config = getSourceConfig('6', undefined, 'docs');
      expect(config).toEqual({
        repo: 'developer-docs',
        owner: 'silverstripe',
        branch: '6.1',
        docsPath: 'en'
      });
    });

    it('should return main docs config for version 5', () => {
      const config = getSourceConfig('5', undefined, 'docs');
      expect(config).toEqual({
        repo: 'developer-docs',
        owner: 'silverstripe',
        branch: '5.4',
        docsPath: 'en'
      });
    });

    it('should return optional feature config for linkfield v6 (docs)', () => {
      const config = getSourceConfig('6', 'linkfield', 'docs');
      expect(config).toEqual({
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '5.1',
        docsPath: 'docs/en',
        excludePath: 'docs/en/userguide'
      });
    });

    it('should return optional feature config for linkfield v5 (docs)', () => {
      const config = getSourceConfig('5', 'linkfield', 'docs');
      expect(config).toEqual({
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '4.2',
        docsPath: 'docs/en',
        excludePath: 'docs/en/userguide'
      });
    });

    it('should return null for unknown version (docs)', () => {
      const config = getSourceConfig('99', undefined, 'docs');
      expect(config).toBeNull();
    });

    it('should return null for unknown optional feature (docs)', () => {
      const config = getSourceConfig('6', 'unknown-feature', 'docs');
      expect(config).toBeNull();
    });
  });

  describe('getSourceConfig with user category', () => {
    it('should return main user config for version 6', () => {
      const config = getSourceConfig('6', undefined, 'user');
      expect(config).toEqual({
        repo: 'silverstripe-userhelp-content',
        owner: 'silverstripe',
        branch: '6',
        docsPath: 'docs/en'
      });
    });

    it('should return main user config for version 5', () => {
      const config = getSourceConfig('5', undefined, 'user');
      expect(config).toEqual({
        repo: 'silverstripe-userhelp-content',
        owner: 'silverstripe',
        branch: '5',
        docsPath: 'docs/en'
      });
    });

    it('should return optional feature config for linkfield v6 (user)', () => {
      const config = getSourceConfig('6', 'linkfield', 'user');
      expect(config).toEqual({
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '5',
        docsPath: 'docs/en/userguide'
      });
    });

    it('should return optional feature config for advancedworkflow v6 (user)', () => {
      const config = getSourceConfig('6', 'advancedworkflow', 'user');
      expect(config).toEqual({
        repo: 'silverstripe-advancedworkflow',
        owner: 'symbiote',
        branch: '5',
        docsPath: 'docs/en/userguide'
      });
    });

    it('should return null for unknown version (user)', () => {
      const config = getSourceConfig('99', undefined, 'user');
      expect(config).toBeNull();
    });

    it('should return null for unknown optional feature (user)', () => {
      const config = getSourceConfig('6', 'unknown-feature', 'user');
      expect(config).toBeNull();
    });
  });

  describe('buildGithubEditUrl with docs category', () => {
    it('should build correct URL for main docs v6', () => {
      const url = buildGithubEditUrl('6', '02_Developer_Guides/index.md', undefined, 'docs');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/6.1/en/02_Developer_Guides/index.md'
      );
    });

    it('should build correct URL for main docs v5', () => {
      const url = buildGithubEditUrl('5', '02_Developer_Guides/index.md', undefined, 'docs');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/5.4/en/02_Developer_Guides/index.md'
      );
    });

    it('should build correct URL for optional feature linkfield v6 (docs)', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'linkfield', 'docs');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-linkfield/blob/5.1/docs/en/index.md'
      );
    });

    it('should build correct URL for optional feature linkfield v5 (docs)', () => {
      const url = buildGithubEditUrl('5', 'index.md', 'linkfield', 'docs');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-linkfield/blob/4.2/docs/en/index.md'
      );
    });

    it('should handle advancedworkflow with correct branch for v6 (docs)', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'advancedworkflow', 'docs');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-advancedworkflow/blob/7.1/docs/en/index.md'
      );
    });

    it('should handle fluent with correct owner for v6 (docs)', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'fluent', 'docs');
      expect(url).toBe(
        'https://github.com/tractorcow-farm/silverstripe-fluent/blob/8.1/docs/en/index.md'
      );
    });

    it('should return fallback for unknown version (docs)', () => {
      const url = buildGithubEditUrl('99', 'index.md', undefined, 'docs');
      expect(url).toBe('#');
    });
  });

  describe('buildGithubEditUrl with user category', () => {
    it('should build correct URL for main user help v6', () => {
      const url = buildGithubEditUrl('6', 'getting-started/index.md', undefined, 'user');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/6/docs/en/getting-started/index.md'
      );
    });

    it('should build correct URL for main user help v5', () => {
      const url = buildGithubEditUrl('5', 'getting-started/index.md', undefined, 'user');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/5/docs/en/getting-started/index.md'
      );
    });

    it('should build correct URL for optional feature linkfield v6 (user)', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'linkfield', 'user');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-linkfield/blob/5/docs/en/userguide/index.md'
      );
    });

    it('should build correct URL for optional feature advancedworkflow v6 (user)', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'advancedworkflow', 'user');
      expect(url).toBe(
        'https://github.com/symbiote/silverstripe-advancedworkflow/blob/5/docs/en/userguide/index.md'
      );
    });

    it('should handle nested paths for optional features (user)', () => {
      const url = buildGithubEditUrl('6', 'guide/section/index.md', 'userforms', 'user');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userforms/blob/7/docs/en/userguide/guide/section/index.md'
      );
    });

    it('should return fallback for unknown version (user)', () => {
      const url = buildGithubEditUrl('99', 'index.md', undefined, 'user');
      expect(url).toBe('#');
    });
  });

  describe('Path normalization', () => {
    it('should handle backslashes in file paths (docs)', () => {
      const url = buildGithubEditUrl('6', '02_Developer_Guides\\index.md', undefined, 'docs');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/6.1/en/02_Developer_Guides/index.md'
      );
    });

    it('should handle leading/trailing slashes (docs)', () => {
      const url = buildGithubEditUrl('6', '/02_Developer_Guides/index.md/', undefined, 'docs');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/6.1/en/02_Developer_Guides/index.md'
      );
    });

    it('should handle backslashes in file paths (user)', () => {
      const url = buildGithubEditUrl('6', 'guide\\section\\index.md', undefined, 'user');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/6/docs/en/guide/section/index.md'
      );
    });

    it('should handle leading/trailing slashes (user)', () => {
      const url = buildGithubEditUrl('6', '/guide/section/index.md/', undefined, 'user');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/6/docs/en/guide/section/index.md'
      );
    });
  });

  describe('Version edge cases', () => {
    it('should handle version 4 (docs)', () => {
      const config = getSourceConfig('4', undefined, 'docs');
      expect(config?.branch).toBe('4.13');
    });

    it('should handle version 3 (docs)', () => {
      const config = getSourceConfig('3', undefined, 'docs');
      expect(config?.branch).toBe('3');
    });

    it('should handle version 4 (user)', () => {
      const config = getSourceConfig('4', undefined, 'user');
      expect(config?.branch).toBe('4');
    });

    it('should handle version 3 (user)', () => {
      const config = getSourceConfig('3', undefined, 'user');
      expect(config?.branch).toBe('3');
    });
  });
});
