/**
 * Unified source configuration interface
 * Automatically selects the appropriate config (docs or user) based on context
 * Provides a single import point for all components
 */

import docsSourcesData from './sources-docs.json';
import userSourcesData from './sources-user.json';
import { getConfig } from '@/lib/config/config';

export interface SourceConfig {
  repo: string;
  owner: string;
  branch: string;
  docsPath?: string;
}

type SourcesMap = {
  [version: string]: {
    main: SourceConfig;
    optionalFeatures?: {
      [featureName: string]: SourceConfig;
    };
  };
};

/**
 * Get the appropriate source data based on category
 */
function getSourceData(category: 'docs' | 'user'): SourcesMap {
  return category === 'user' ? (userSourcesData as SourcesMap) : (docsSourcesData as SourcesMap);
}

/**
 * Get the appropriate source category based on current DOCS_CONTEXT
 */
function getCurrentCategory(): 'docs' | 'user' {
  const config = getConfig();
  return config.docsContext === 'user' ? 'user' : 'docs';
}

/**
 * Get source configuration for a specific version and optional feature
 * @param category - 'docs' or 'user' context
 * @param version - Version string (e.g., '6', '5')
 * @param optionalFeature - Optional feature name
 * @returns SourceConfig object or null if not found
 */
export function getSourceConfig(
  version: string,
  optionalFeature?: string,
  category?: 'docs' | 'user'
): SourceConfig | null {
  const targetCategory = category || getCurrentCategory();
  const sources = getSourceData(targetCategory);
  const versionConfig = sources[version];

  if (!versionConfig) {
    return null;
  }

  if (optionalFeature && versionConfig.optionalFeatures) {
    return versionConfig.optionalFeatures[optionalFeature] || null;
  }

  return versionConfig.main;
}

/**
 * Build GitHub edit URL for a document
 * @param version - Version string (e.g., '6', '5')
 * @param filePath - File path relative to version root
 * @param optionalFeature - Optional feature name
 * @param category - 'docs' or 'user' context (optional, uses current context if not provided)
 * @returns GitHub edit URL
 */
export function buildGithubEditUrl(
  version: string,
  filePath: string,
  optionalFeature?: string,
  category?: 'docs' | 'user'
): string {
  const config = getSourceConfig(version, optionalFeature, category);
  if (!config) {
    return '#';
  }

  // Clean file path - remove leading/trailing slashes, normalize separators
  let cleanPath = filePath.replace(/^\/+|\/+$/g, '').replace(/\\/g, '/');

  // If this is from an optional feature, the filePath should be relative to docs/en
  if (optionalFeature && config.docsPath) {
    // Path is already relative to the clone directory
    cleanPath = `${config.docsPath}/${cleanPath}`;
  } else if (!optionalFeature && config.docsPath) {
    // For main docs, path is relative to version dir
    cleanPath = `${config.docsPath}/${cleanPath}`;
  }

  const url = `https://github.com/${config.owner}/${config.repo}/blob/${config.branch}/${cleanPath}`;
  return url;
}
