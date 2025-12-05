/**
 * Version utilities for multi-version documentation support
 */

export type VersionStatus = 'current' | 'supported' | 'eol';

const EOL_VERSIONS = ['3', '4'];
const PREVIOUS_RELEASE_VERSIONS = ['5'];
const CURRENT_VERSION = '6';
const ALL_VERSIONS = ['3', '4', '5', '6'];

/**
 * Get all available documentation versions
 */
export function getAllVersions(): string[] {
  return ALL_VERSIONS.slice().reverse();
}

/**
 * Get the default/current version
 */
export function getDefaultVersion(): string {
  return CURRENT_VERSION;
}

/**
 * Get the status of a specific version
 */
export function getVersionStatus(version: string): VersionStatus {
  if (EOL_VERSIONS.includes(version)) {
    return 'eol';
  }

  if (PREVIOUS_RELEASE_VERSIONS.includes(version)) {
    return 'supported';
  }

  return 'current';
}

/**
 * Get the path equivalent in another version
 * @param currentSlug - The current page slug (e.g., /en/6/getting-started/)
 * @param targetVersion - The target version to switch to
 * @returns The slug in the target version, or root of target version if page doesn't exist
 */
export function getVersionPath(currentSlug: string, targetVersion: string): string {
  // This is a placeholder - actual implementation requires document lookup
  // For now, return the base path for the target version
  const basePath = `/en/${targetVersion}/`;

  if (!currentSlug || currentSlug === '/') {
    return basePath;
  }

  // Try to construct equivalent path in target version
  const newPath = currentSlug.replace(/^\/en\/[0-9]+\//, `${basePath}`);
  return newPath;
}

/**
 * Get a user-friendly label for a version
 */
export function getVersionLabel(version: string): string {
  const status = getVersionStatus(version);
  const versionNum = `${version}.0`;

  switch (status) {
    case 'current':
      return `${versionNum} (Current)`;
    case 'supported':
      return `${versionNum} (Supported)`;
    case 'eol':
      return `${versionNum} (End of Life)`;
    default:
      return versionNum;
  }
}

/**
 * Get version message for display banner
 * @param version - The version to get message for
 * @returns Object with style, icon, stability label, and message
 */
export function getVersionMessage(version: string): {
  style: 'success' | 'info' | 'warning' | 'danger';
  icon: string;
  stability: string;
  message: string | null;
} {
  const status = getVersionStatus(version);

  switch (status) {
    case 'eol':
      return {
        style: 'danger',
        icon: 'times-circle',
        stability: 'End of Life',
        message: 'will not receive any additional bug fixes or documentation updates',
      };
    case 'supported':
      return {
        style: 'info',
        icon: 'check-circle',
        stability: 'Supported',
        message: 'is still supported though will not receive any additional features',
      };
    case 'current':
      return {
        style: 'success',
        icon: 'check-circle',
        stability: 'Supported',
        message: null,
      };
    default:
      return {
        style: 'info',
        icon: 'info-circle',
        stability: 'Unknown',
        message: null,
      };
  }
}

/**
 * Get version label for version switcher (without .0 suffix)
 */
export function getVersionSwitcherLabel(version: string): string {
  return `v${version}`;
}

/**
 * Get the homepage slug for a version
 * @param version - The version
 * @returns The homepage slug (e.g., /en/6/)
 */
export function getVersionHomepage(version: string): string {
  return `/en/${version}/`;
}
