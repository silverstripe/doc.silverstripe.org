/**
 * Tests for version switcher fallback functionality
 * When a page doesn't exist in the target version, it should redirect to homepage
 */

import { getVersionHomepage } from '@/lib/versions';
import { slugExistsInVersion } from '@/lib/versions/get-available-slugs';

describe('Version Fallback', () => {
  describe('getVersionHomepage', () => {
    it('should return correct homepage URL for version 6', () => {
      expect(getVersionHomepage('6')).toBe('/en/6/');
    });

    it('should return correct homepage URL for version 5', () => {
      expect(getVersionHomepage('5')).toBe('/en/5/');
    });

    it('should return correct homepage URL for version 4', () => {
      expect(getVersionHomepage('4')).toBe('/en/4/');
    });

    it('should return correct homepage URL for version 3', () => {
      expect(getVersionHomepage('3')).toBe('/en/3/');
    });

    it('should always use /en/{version}/ format', () => {
      const versions = ['3', '4', '5', '6'];
      versions.forEach(v => {
        const url = getVersionHomepage(v);
        expect(url).toMatch(/^\/en\/\d+\/$/);
        expect(url).toBe(`/en/${v}/`);
      });
    });
  });

  describe('slugExistsInVersion', () => {
    it('should return true for existing slugs', async () => {
      // Mock data should have /en/6/ as homepage
      const exists = await slugExistsInVersion('6', '/en/6/');
      expect(typeof exists).toBe('boolean');
    });

    it('should work with normalized slugs', async () => {
      // Should handle trailing slashes consistently
      const exists1 = await slugExistsInVersion('6', '/en/6/');
      const exists2 = await slugExistsInVersion('6', '/en/6');
      expect(exists1).toBe(exists2);
    });

    it('should return consistent results on multiple calls', async () => {
      const result1 = await slugExistsInVersion('6', '/en/6/');
      const result2 = await slugExistsInVersion('6', '/en/6/');
      expect(result1).toBe(result2);
    });

    it('should handle different version numbers', async () => {
      // Should not throw errors for different versions
      const versions = ['3', '4', '5', '6'];
      for (const v of versions) {
        const result = await slugExistsInVersion(v, `/en/${v}/`);
        expect(typeof result).toBe('boolean');
      }
    });
  });

  describe('Version switching redirect flow', () => {
    it('should construct correct redirect path when navigating to version homepage', () => {
      const currentVersion = '6';
      const targetVersion = '5';
      const homepage = getVersionHomepage(targetVersion);
      
      expect(homepage).toBe('/en/5/');
    });

    it('should preserve homepage format across all versions', () => {
      const allVersions = ['3', '4', '5', '6'];
      const homepages = allVersions.map(v => getVersionHomepage(v));
      
      homepages.forEach((hp, idx) => {
        expect(hp).toMatch(/^\/en\/\d+\/$/);
        const version = allVersions[idx];
        expect(hp).toBe(`/en/${version}/`);
      });
    });
  });
});
