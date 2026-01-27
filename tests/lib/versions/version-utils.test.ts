import {
  getAllVersions,
  getDefaultVersion,
  getVersionStatus,
  getVersionPath,
  getVersionLabel,
  getVersionMessage,
  getVersionSwitcherLabel,
} from '@/lib/versions/version-utils';
import { DEFAULT_VERSION, HIGHEST_VERSION, MINIMUM_VERSION } from '../../../global-config';

describe('Version Utilities', () => {
  // Calculate expected values dynamically from config
  const currentVersion = DEFAULT_VERSION;
  const highestVersion = HIGHEST_VERSION;
  const minimumVersion = MINIMUM_VERSION;
  const previousReleaseVersion = String(parseInt(currentVersion, 10) - 1);
  const expectedAllVersions: string[] = [];
  const expectedEolVersions: string[] = [];

  // Build expected versions array (MINIMUM_VERSION to HIGHEST_VERSION)
  for (let i = parseInt(minimumVersion, 10); i <= parseInt(highestVersion, 10); i += 1) {
    expectedAllVersions.push(String(i));
  }

  // Build expected EOL versions array
  for (let i = parseInt(minimumVersion, 10); i < parseInt(previousReleaseVersion, 10); i += 1) {
    expectedEolVersions.push(String(i));
  }

  describe('Dynamic Version Generation', () => {
    it('should derive CURRENT_VERSION from DEFAULT_VERSION', () => {
      expect(getDefaultVersion()).toBe(DEFAULT_VERSION);
    });

    it('should generate all versions from MINIMUM_VERSION to HIGHEST_VERSION', () => {
      const versions = getAllVersions();
      expect(versions.slice().reverse()).toEqual(expectedAllVersions);
    });

    it('should calculate PREVIOUS_RELEASE_VERSION as CURRENT_VERSION - 1', () => {
      const prevVersion = String(parseInt(currentVersion, 10) - 1);
      expect(getVersionStatus(prevVersion)).toBe('supported');
    });

    it('should mark versions below PREVIOUS_RELEASE_VERSION as EOL', () => {
      expectedEolVersions.forEach((version) => {
        expect(getVersionStatus(version)).toBe('eol');
      });
    });

    it('should mark CURRENT_VERSION as current', () => {
      expect(getVersionStatus(currentVersion)).toBe('current');
    });

    it('should generate correct number of versions', () => {
      const expectedCount = parseInt(highestVersion, 10) - parseInt(minimumVersion, 10) + 1;
      expect(getAllVersions().length).toBe(expectedCount);
    });

    it('should include HIGHEST_VERSION in all versions', () => {
      const versions = getAllVersions();
      expect(versions).toContain(highestVersion);
    });
  });

  describe('getAllVersions', () => {
    it('should return array of all versions in reverse order', () => {
      const versions = getAllVersions();
      expect(Array.isArray(versions)).toBe(true);
      expect(versions).toEqual(expectedAllVersions.slice().reverse());
    });

    it('should include current version', () => {
      const versions = getAllVersions();
      expect(versions).toContain(currentVersion);
    });

    it('should include previous release version', () => {
      const versions = getAllVersions();
      expect(versions).toContain(previousReleaseVersion);
    });

    it('should include minimum version', () => {
      const versions = getAllVersions();
      expect(versions).toContain(minimumVersion);
    });

    it('should include highest version', () => {
      const versions = getAllVersions();
      expect(versions).toContain(highestVersion);
    });

    it('should have highest version first and minimum version last', () => {
      const versions = getAllVersions();
      expect(versions[0]).toBe(highestVersion);
      expect(versions[versions.length - 1]).toBe(minimumVersion);
    });
  });

  describe('getDefaultVersion', () => {
    it('should return current version', () => {
      expect(getDefaultVersion()).toBe(currentVersion);
    });

    it('should always return same value', () => {
      expect(getDefaultVersion()).toBe(getDefaultVersion());
    });

    it('should match DEFAULT_VERSION from global config', () => {
      expect(getDefaultVersion()).toBe(DEFAULT_VERSION);
    });
  });

  describe('getVersionStatus', () => {
    it('should return eol for EOL versions', () => {
      expectedEolVersions.forEach((version) => {
        const status = getVersionStatus(version);
        expect(status).toBe('eol');
      });
    });

    it('should return supported for previous release version', () => {
      const status = getVersionStatus(previousReleaseVersion);
      expect(status).toBe('supported');
    });

    it('should return current for current version', () => {
      const status = getVersionStatus(currentVersion);
      expect(status).toBe('current');
    });

    it('should return current for unknown version', () => {
      const futureVersion = String(parseInt(currentVersion, 10) + 1);
      const status = getVersionStatus(futureVersion);
      expect(status).toBe('current');
    });

    it('should correctly categorize all known versions', () => {
      const versions = getAllVersions();
      versions.forEach((version) => {
        const status = getVersionStatus(version);
        expect(['eol', 'supported', 'current']).toContain(status);
      });
    });
  });

  describe('getVersionPath', () => {
    const targetVersion = previousReleaseVersion;

    it('should return root path for target version when given empty slug', () => {
      const path = getVersionPath('', targetVersion);
      expect(path).toBe(`/en/${targetVersion}/`);
    });

    it('should return root path for target version when given root slug', () => {
      const path = getVersionPath('/', targetVersion);
      expect(path).toBe(`/en/${targetVersion}/`);
    });

    it('should replace version in path', () => {
      const path = getVersionPath(`/en/${currentVersion}/getting-started/`, targetVersion);
      expect(path).toBe(`/en/${targetVersion}/getting-started/`);
    });

    it('should handle multi-level paths', () => {
      const path = getVersionPath(
        `/en/${currentVersion}/developer-guides/model/data-types/`,
        targetVersion,
      );
      expect(path).toBe(`/en/${targetVersion}/developer-guides/model/data-types/`);
    });

    it('should preserve path with hyphenated slugs', () => {
      const path = getVersionPath(`/en/${currentVersion}/advanced-installation/`, targetVersion);
      expect(path).toBe(`/en/${targetVersion}/advanced-installation/`);
    });

    it('should handle root version path', () => {
      const path = getVersionPath(`/en/${currentVersion}/`, targetVersion);
      expect(path).toBe(`/en/${targetVersion}/`);
    });

    it('should work with any version in the range', () => {
      getAllVersions().forEach((version) => {
        const path = getVersionPath(`/en/${currentVersion}/test/`, version);
        expect(path).toBe(`/en/${version}/test/`);
      });
    });
  });

  describe('getVersionLabel', () => {
    it('should label EOL versions as End of Life', () => {
      expectedEolVersions.forEach((version) => {
        const label = getVersionLabel(version);
        expect(label).toContain(`${version}.0`);
        expect(label).toContain('End of Life');
      });
    });

    it('should label previous release version as supported', () => {
      const label = getVersionLabel(previousReleaseVersion);
      expect(label).toContain(`${previousReleaseVersion}.0`);
      expect(label).toContain('Supported');
    });

    it('should label current version as current', () => {
      const label = getVersionLabel(currentVersion);
      expect(label).toContain(`${currentVersion}.0`);
      expect(label).toContain('Current');
    });

    it('should return version number for unknown version', () => {
      const futureVersion = String(parseInt(currentVersion, 10) + 1);
      const label = getVersionLabel(futureVersion);
      expect(label).toContain(`${futureVersion}.0`);
    });

    it('should include .0 suffix for all versions', () => {
      getAllVersions().forEach((version) => {
        const label = getVersionLabel(version);
        expect(label).toContain('.0');
      });
    });
  });

  describe('getVersionMessage', () => {
    it('should return eol message for EOL versions', () => {
      expectedEolVersions.forEach((version) => {
        const msg = getVersionMessage(version);
        expect(msg.style).toBe('danger');
        expect(msg.icon).toBe('times-circle');
        expect(msg.stability).toBe('End of Life');
        expect(msg.message).toContain('will not receive');
      });
    });

    it('should return supported message for previous release version', () => {
      const msg = getVersionMessage(previousReleaseVersion);
      expect(msg.style).toBe('info');
      expect(msg.icon).toBe('check-circle');
      expect(msg.stability).toBe('Supported');
      expect(msg.message).toContain('still supported');
    });

    it('should return supported message for current version with no message text', () => {
      const msg = getVersionMessage(currentVersion);
      expect(msg.style).toBe('success');
      expect(msg.icon).toBe('check-circle');
      expect(msg.stability).toBe('Supported');
      expect(msg.message).toBeNull();
    });

    it('should return all required fields', () => {
      const msg = getVersionMessage(previousReleaseVersion);
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

    it('should return info message for unknown versions', () => {
      const futureVersion = String(parseInt(currentVersion, 10) + 1);
      const msg = getVersionMessage(futureVersion);
      expect(['success', 'info', 'warning', 'danger']).toContain(msg.style);
      expect(msg).toHaveProperty('icon');
      expect(msg).toHaveProperty('stability');
      expect(msg).toHaveProperty('message');
    });
  });

  describe('getVersionSwitcherLabel', () => {
    it('should return vX for all versions', () => {
      getAllVersions().forEach((version) => {
        const label = getVersionSwitcherLabel(version);
        expect(label).toBe(`v${version}`);
      });
    });

    it('should return v prefix followed by version number', () => {
      const label = getVersionSwitcherLabel(currentVersion);
      expect(label).toBe(`v${currentVersion}`);
      expect(label).toMatch(/^v\d+$/);
    });

    it('should not include .0 suffix', () => {
      getAllVersions().forEach((version) => {
        const label = getVersionSwitcherLabel(version);
        expect(label).not.toContain('.0');
      });
    });
  });
});
