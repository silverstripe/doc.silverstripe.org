/**
 * Unified source configuration interface
 * Automatically selects the appropriate config (docs or user) based on context
 * Provides a single import point for all components
 */

import { getConfig } from '@/lib/config/config';
import type { DocsContext } from '@/types/types';
import docsSourcesData from './sources-docs.json';
import userSourcesData from './sources-user.json';
import searchSourcesData from './sources-search.json';

export interface SourceConfig {
  repo: string;
  owner: string;
  branch: string;
  docsPath?: string;
}

type SourcesMap = {
  [version: string]: {
    main: SourceConfig;
    hidden?: boolean;
    optionalFeatures?: {
      [featureName: string]: SourceConfig;
    };
  };
};

/**
 * Get the appropriate source data based on category
 */
function getSourceData(category: DocsContext): SourcesMap {
  if (category === 'search') return searchSourcesData as SourcesMap;
  return category === 'user' ? (userSourcesData as SourcesMap) : (docsSourcesData as SourcesMap);
}

/**
 * Get sorted version keys from the source JSON for a given context
 * By default, excludes versions marked as hidden.
 * @param category - The docs context
 * @param includeHidden - When true, includes versions with hidden: true
 * @returns Numeric version strings sorted ascending (e.g., ['1', '2'] or ['3', '4', '5', '6'])
 */
export function getSourceVersionKeys(
  category: DocsContext,
  includeHidden = false,
): string[] {
  const sources = getSourceData(category);
  return Object.keys(sources)
    .filter((v) => includeHidden || !sources[v].hidden)
    .map((v) => parseInt(v, 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)
    .map(String);
}

/**
 * Get the appropriate source category based on current DOCS_CONTEXT
 */
function getCurrentCategory(): DocsContext {
  const config = getConfig();
  return config.docsContext;
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
  category?: DocsContext,
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
  category?: DocsContext,
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
