import {
  getAllVersions,
  getDefaultVersion,
  getVersionStatus,
  getVersionPath,
  getVersionLabel,
  getVersionMessage,
  getVersionSwitcherLabel,
} from '../version-utils';

describe('Version Utilities', () => {
  describe('getAllVersions', () => {
    it('should return array of all versions in reverse order', () => {
      const versions = getAllVersions();
      expect(Array.isArray(versions)).toBe(true);
      expect(versions).toEqual(['6', '5', '4', '3']);
    });

    it('should include current version', () => {
      const versions = getAllVersions();
      expect(versions).toContain('6');
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

    it('should have v6 first and v3 last', () => {
      const versions = getAllVersions();
      expect(versions[0]).toBe('6');
      expect(versions[versions.length - 1]).toBe('3');
    });
  });

  describe('getDefaultVersion', () => {
    it('should return current version', () => {
      expect(getDefaultVersion()).toBe('6');
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

    it('should return supported for version 5', () => {
      const status = getVersionStatus('5');
      expect(status).toBe('supported');
    });

    it('should return current for version 6', () => {
      const status = getVersionStatus('6');
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

    it('should label version 5 as supported', () => {
      const label = getVersionLabel('5');
      expect(label).toContain('5.0');
      expect(label).toContain('Supported');
    });

    it('should label version 6 as current', () => {
      const label = getVersionLabel('6');
      expect(label).toContain('6.0');
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

    it('should return supported message for version 5', () => {
      const msg = getVersionMessage('5');
      expect(msg.style).toBe('info');
      expect(msg.icon).toBe('check-circle');
      expect(msg.stability).toBe('Supported');
      expect(msg.message).toContain('still supported');
    });

    it('should return supported message for version 6 with no message text', () => {
      const msg = getVersionMessage('6');
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
    it('should return v6 for version 6', () => {
      const label = getVersionSwitcherLabel('6');
      expect(label).toBe('v6');
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
      const label = getVersionSwitcherLabel('6');
      expect(label).not.toContain('.0');
    });
  });
});
