import { getSourceConfig, buildGithubEditUrl } from '@/../sources-user';

describe('Sources User Config', () => {
  describe('getSourceConfig', () => {
    it('should return main user help config for version 6', () => {
      const config = getSourceConfig('6');
      expect(config).toEqual({
        repo: 'silverstripe-userhelp-content',
        owner: 'silverstripe',
        branch: '6',
        docsPath: 'docs/en'
      });
    });

    it('should return main user help config for version 5', () => {
      const config = getSourceConfig('5');
      expect(config).toEqual({
        repo: 'silverstripe-userhelp-content',
        owner: 'silverstripe',
        branch: '5',
        docsPath: 'docs/en'
      });
    });

    it('should return optional feature config for linkfield v6', () => {
      const config = getSourceConfig('6', 'linkfield');
      expect(config).toEqual({
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '5',
        docsPath: 'docs/en/userguide'
      });
    });

    it('should return optional feature config for linkfield v5', () => {
      const config = getSourceConfig('5', 'linkfield');
      expect(config).toEqual({
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '4',
        docsPath: 'docs/en/userguide'
      });
    });

    it('should return optional feature config for advancedworkflow v6', () => {
      const config = getSourceConfig('6', 'advancedworkflow');
      expect(config).toEqual({
        repo: 'silverstripe-advancedworkflow',
        owner: 'symbiote',
        branch: '5',
        docsPath: 'docs/en/userguide'
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
      expect(config?.branch).toBe('4');
    });

    it('should handle version 3', () => {
      const config = getSourceConfig('3');
      expect(config?.branch).toBe('3');
    });
  });

  describe('buildGithubEditUrl', () => {
    it('should build correct URL for main user help v6', () => {
      const url = buildGithubEditUrl('6', 'index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/6/docs/en/index.md'
      );
    });

    it('should build correct URL for main user help v5', () => {
      const url = buildGithubEditUrl('5', 'index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/5/docs/en/index.md'
      );
    });

    it('should build correct URL for optional feature linkfield v6', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'linkfield');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-linkfield/blob/5/docs/en/userguide/index.md'
      );
    });

    it('should build correct URL for optional feature linkfield v5', () => {
      const url = buildGithubEditUrl('5', 'index.md', 'linkfield');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-linkfield/blob/4/docs/en/userguide/index.md'
      );
    });

    it('should build correct URL for optional feature advancedworkflow v6', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'advancedworkflow');
      expect(url).toBe(
        'https://github.com/symbiote/silverstripe-advancedworkflow/blob/5/docs/en/userguide/index.md'
      );
    });

    it('should build correct URL for optional feature userforms v6', () => {
      const url = buildGithubEditUrl('6', 'index.md', 'userforms');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userforms/blob/7/docs/en/userguide/index.md'
      );
    });

    it('should build correct URL for optional feature userforms v5', () => {
      const url = buildGithubEditUrl('5', 'index.md', 'userforms');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userforms/blob/6/docs/en/userguide/index.md'
      );
    });

    it('should handle nested paths for optional features', () => {
      const url = buildGithubEditUrl('6', 'forms/subfolder/index.md', 'userforms');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userforms/blob/7/docs/en/userguide/forms/subfolder/index.md'
      );
    });

    it('should build correct URL for v4', () => {
      const url = buildGithubEditUrl('4', 'index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/4/docs/en/index.md'
      );
    });

    it('should build correct URL for v3', () => {
      const url = buildGithubEditUrl('3', 'index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/3/docs/en/index.md'
      );
    });

    it('should handle backslashes in file paths', () => {
      const url = buildGithubEditUrl('6', 'folder\\index.md');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/6/docs/en/folder/index.md'
      );
    });

    it('should handle leading/trailing slashes', () => {
      const url = buildGithubEditUrl('6', '/index.md/');
      expect(url).toBe(
        'https://github.com/silverstripe/silverstripe-userhelp-content/blob/6/docs/en/index.md'
      );
    });

    it('should return fallback for unknown version', () => {
      const url = buildGithubEditUrl('99', 'index.md');
      expect(url).toBe('#');
    });
  });
});
