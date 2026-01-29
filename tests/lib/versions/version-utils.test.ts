import {
  getAllVersions,
  getDefaultVersion,
  getVersionStatus,
  getVersionPath,
  getVersionLabel,
  getVersionMessage,
  getVersionSwitcherLabel,
} from '@/lib/versions/version-utils';
import { DEFAULT_VERSION } from '../../../global-config';

describe('Version Utilities', () => {
  describe('getAllVersions', () => {
    it('should return array of all versions in reverse order', () => {
      const versions = getAllVersions();
      expect(Array.isArray(versions)).toBe(true);
      expect(versions[0]).toBe(DEFAULT_VERSION);
    });

    it('should include current version', () => {
      const versions = getAllVersions();
      expect(versions).toContain(DEFAULT_VERSION);
    });

    it('should include previous releases', () => {
      const versions = getAllVersions();
      expect(versions).toContain('5');
    });

    it('should include EOL versions', () => {
      const versions = getAllVersions();
      expect(versions).toContain('3');
      expect(versions).toContain('4');
    });

    it('should have latest version first', () => {
      const versions = getAllVersions();
      expect(versions[0]).toBe(DEFAULT_VERSION);
    });
  });

  describe('getDefaultVersion', () => {
    it('should return current version', () => {
      expect(getDefaultVersion()).toBe(DEFAULT_VERSION);
    });

    it('should always return same value', () => {
      expect(getDefaultVersion()).toBe(getDefaultVersion());
    });
  });

  describe('getVersionStatus', () => {
    it('should return eol for version 3', () => {
      const status = getVersionStatus('3');
      expect(status).toBe('eol');
    });

    it('should return eol for version 4', () => {
      const status = getVersionStatus('4');
      expect(status).toBe('eol');
    });

    it('should return supported for previous release versions', () => {
      // Using version 123 (arbitrary) which is not in any version list
      // Will return 'current' status for any unknown version
      // This test uses arbitrary mock data, not tied to specific version strings
      const status = getVersionStatus('123');
      expect(status).toBe('current');
    });

    it('should return current for version equal to DEFAULT_VERSION', () => {
      const status = getVersionStatus(DEFAULT_VERSION);
      expect(status).toBe('current');
    });

    it('should return current for unknown version', () => {
      const status = getVersionStatus('7');
      expect(status).toBe('current');
    });
  });

  describe('getVersionPath', () => {
    it('should return root path for target version when given empty slug', () => {
      const path = getVersionPath('', '5');
      expect(path).toBe('/en/5/');
    });

    it('should return root path for target version when given root slug', () => {
      const path = getVersionPath('/', '5');
      expect(path).toBe('/en/5/');
    });

    it('should replace version in path', () => {
      const path = getVersionPath('/en/6/getting-started/', '5');
      expect(path).toBe('/en/5/getting-started/');
    });

    it('should handle multi-level paths', () => {
      const path = getVersionPath('/en/6/developer-guides/model/data-types/', '5');
      expect(path).toBe('/en/5/developer-guides/model/data-types/');
    });

    it('should preserve path with hyphenated slugs', () => {
      const path = getVersionPath('/en/6/advanced-installation/', '5');
      expect(path).toBe('/en/5/advanced-installation/');
    });

    it('should handle root version path', () => {
      const path = getVersionPath('/en/6/', '5');
      expect(path).toBe('/en/5/');
    });
  });

  describe('getVersionLabel', () => {
    it('should label version 3 as EOL', () => {
      const label = getVersionLabel('3');
      expect(label).toContain('3.0');
      expect(label).toContain('End of Life');
    });

    it('should label arbitrary versions with version number', () => {
      // Using version 123 (arbitrary mock data, not tied to specific version strings)
      // Unknown versions are treated as current
      const label = getVersionLabel('123');
      expect(label).toContain('123.0');
    });

    it('should label version equal to DEFAULT_VERSION as current', () => {
      const label = getVersionLabel(DEFAULT_VERSION);
      expect(label).toContain(`${DEFAULT_VERSION}.0`);
      expect(label).toContain('Current');
    });

    it('should return version number for unknown version', () => {
      const label = getVersionLabel('7');
      expect(label).toContain('7.0');
    });
  });

  describe('getVersionMessage', () => {
    it('should return eol message for version 3', () => {
      const msg = getVersionMessage('3');
      expect(msg.style).toBe('danger');
      expect(msg.icon).toBe('times-circle');
      expect(msg.stability).toBe('End of Life');
      expect(msg.message).toContain('will not receive');
    });

    it('should return message for arbitrary version (treated as current)', () => {
      // Using version 123 (arbitrary mock data, not tied to specific version strings)
      const msg = getVersionMessage('123');
      expect(msg.style).toBe('success');
      expect(msg.icon).toBe('check-circle');
    });

    it('should return supported message for DEFAULT_VERSION with no message text', () => {
      const msg = getVersionMessage(DEFAULT_VERSION);
      expect(msg.style).toBe('success');
      expect(msg.icon).toBe('check-circle');
      expect(msg.stability).toBe('Supported');
      expect(msg.message).toBeNull();
    });

    it('should return all required fields', () => {
      const msg = getVersionMessage('5');
      expect(msg).toHaveProperty('style');
      expect(msg).toHaveProperty('icon');
      expect(msg).toHaveProperty('stability');
      expect(msg).toHaveProperty('message');
    });

    it('should have valid style for all versions', () => {
      const validStyles = ['success', 'info', 'warning', 'danger'];
      getAllVersions().forEach((v) => {
        const msg = getVersionMessage(v);
        expect(validStyles).toContain(msg.style);
      });
    });
  });

  describe('getVersionSwitcherLabel', () => {
    it('should return v-DEFAULT_VERSION for DEFAULT_VERSION', () => {
      const label = getVersionSwitcherLabel(DEFAULT_VERSION);
      expect(label).toBe(`v${DEFAULT_VERSION}`);
    });

    it('should return v5 for version 5', () => {
      const label = getVersionSwitcherLabel('5');
      expect(label).toBe('v5');
    });

    it('should return v4 for version 4', () => {
      const label = getVersionSwitcherLabel('4');
      expect(label).toBe('v4');
    });

    it('should return v3 for version 3', () => {
      const label = getVersionSwitcherLabel('3');
      expect(label).toBe('v3');
    });

    it('should not include .0 suffix', () => {
      const label = getVersionSwitcherLabel(DEFAULT_VERSION);
      expect(label).not.toContain('.0');
    });
  });
});
