/**
 * Unified source configuration interface
 * Automatically selects the appropriate config (docs or user) based on context
 * Provides a single import point for all components
 */

import * as docsSources from './sources-docs';
import * as userSources from './sources-user';
import { getConfig } from '@/lib/config';

export type { SourceConfig } from './sources-docs';

/**
 * Get the appropriate source config module based on current DOCS_CONTEXT
 */
function getSourceModule() {
  const config = getConfig();
  return config.docsContext === 'user' ? userSources : docsSources;
}

/**
 * Get source configuration for a specific version and optional feature
 * Automatically uses docs or user context based on DOCS_CONTEXT
 */
export function getSourceConfig(
  version: string,
  optionalFeature?: string
) {
  const sourceModule = getSourceModule();
  return sourceModule.getSourceConfig(version, optionalFeature);
}

/**
 * Build GitHub edit URL for a document
 * Automatically uses docs or user context based on DOCS_CONTEXT
 */
export function buildGithubEditUrl(
  version: string,
  filePath: string,
  optionalFeature?: string
): string {
  const sourceModule = getSourceModule();
  return sourceModule.buildGithubEditUrl(version, filePath, optionalFeature);
}
