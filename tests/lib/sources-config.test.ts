import { getSourceConfig, buildGithubEditUrl } from '@/lib/sources-config';

describe('Sources Config', () => {
  describe('getSourceConfig', () => {
    it('should return main docs config for version 6', () => {
      const config = getSourceConfig('6');
      expect(config).toEqual({
        repo: 'developer-docs',
        owner: 'silverstripe',
        branch: '6.1',
        docsPath: 'en'
      });
    });

    it('should return main docs config for version 5', () => {
      const config = getSourceConfig('5');
      expect(config).toEqual({
        repo: 'developer-docs',
        owner: 'silverstripe',
        branch: '5.4',
        docsPath: 'en'
      });
    });

    it('should return optional feature config for linkfield v6', () => {
      const config = getSourceConfig('6', 'linkfield');
      expect(config).toEqual({
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '5.1',
        docsPath: 'docs/en'
      });
    });

    it('should return optional feature config for linkfield v5', () => {
      const config = getSourceConfig('5', 'linkfield');
      expect(config).toEqual({
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '4.2',
        docsPath: 'docs/en'
      });
    });

    it('should return optional feature config', () => {
      const config = getSourceConfig('6', 'staticpublishqueue');
      expect(config).toEqual({
        repo: 'silverstripe-staticpublishqueue',
        owner: 'silverstripe',
        branch: '7.0',
        docsPath: 'docs/en'
      });
    });

    it('should return null for unknown version', () => {
      const config = getSourceConfig('99');
      expect(config).toBeNull();
    });

    it('should return null for unknown optional feature', () => {
      const config = getSourceConfig('6', 'unknown-feature');
      expect(config).toBeNull();
    });

    it('should handle version 4', () => {
      const config = getSourceConfig('4');
      expect(config?.branch).toBe('4.13');
    });

    it('should handle version 3', () => {
      const config = getSourceConfig('3');
      expect(config?.branch).toBe('3');
    });
  });

  describe('buildGithubEditUrl', () => {
    it('should build correct URL for main docs v6', () => {
      const url = buildGithubEditUrl('6', '02_Developer_Guides/index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/6.1/en/02_Developer_Guides/index.md'
      );
    });

    it('should build correct URL for main docs v5', () => {
      const url = buildGithubEditUrl('5', '02_Developer_Guides/index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/5.4/en/02_Developer_Guides/index.md'
      );
    });

    it('should build correct URL for optional feature linkfield v6', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'linkfield');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-linkfield/blob/5.1/docs/en/index.md'
      );
    });

    it('should build correct URL for optional feature linkfield v5', () => {
      const url = buildGithubEditUrl('5', 'index.md', 'linkfield');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-linkfield/blob/4.2/docs/en/index.md'
      );
    });

    it('should build correct URL for optional feature staticpublishqueue', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'staticpublishqueue');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-staticpublishqueue/blob/7.0/docs/en/index.md'
      );
    });

    it('should build correct URL for nested optional feature path', () => {
      const url = buildGithubEditUrl('6', '02_Configuration/index.md', 'staticpublishqueue');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-staticpublishqueue/blob/7.0/docs/en/02_Configuration/index.md'
      );
    });

    it('should handle advancedworkflow with correct branch for v6', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'advancedworkflow');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-advancedworkflow/blob/7.1/docs/en/index.md'
      );
    });

    it('should handle advancedworkflow with correct branch for v5', () => {
      const url = buildGithubEditUrl('5', 'index.md', 'advancedworkflow');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-advancedworkflow/blob/6.4/docs/en/index.md'
      );
    });

    it('should handle fluent with correct owner for v6', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'fluent');
      expect(url).toBe(
        'https://github.com/tractorcow/silverstripe-fluent/blob/8.1/docs/en/index.md'
      );
    });

    it('should handle fluent with correct owner for v5', () => {
      const url = buildGithubEditUrl('5', 'index.md', 'fluent');
      expect(url).toBe(
        'https://github.com/tractorcow-farm/silverstripe-fluent/blob/7.3/docs/en/index.md'
      );
    });

    it('should build correct URL for v4', () => {
      const url = buildGithubEditUrl('4', '02_Developer_Guides/index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/4.13/en/02_Developer_Guides/index.md'
      );
    });

    it('should build correct URL for v3', () => {
      const url = buildGithubEditUrl('3', '02_Developer_Guides/index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/3/en/02_Developer_Guides/index.md'
      );
    });

    it('should handle backslashes in file paths', () => {
      const url = buildGithubEditUrl('6', '02_Developer_Guides\\index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/6.1/en/02_Developer_Guides/index.md'
      );
    });

    it('should handle leading/trailing slashes', () => {
      const url = buildGithubEditUrl('6', '/02_Developer_Guides/index.md/');
      expect(url).toBe(
        'https://github.com/silverstripe/developer-docs/blob/6.1/en/02_Developer_Guides/index.md'
      );
    });

    it('should return fallback for unknown version', () => {
      const url = buildGithubEditUrl('99', 'index.md');
      expect(url).toBe('#');
    });
  });
});
