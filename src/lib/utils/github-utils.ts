/**
 * GitHub utilities for managing GitHub repository information
 * Handles optional feature detection and GitHub link generation
 */

import { DocumentNode } from '@/types/types';
import { getSourceConfig } from '@/../sources-config';

/**
 * Detect if a document is part of an optional module
 * @param doc - The document node
 * @returns The optional feature name, or null if it's core documentation
 */
export function getOptionalFeatureFromDocument(doc: DocumentNode | null): string | null {
  return doc?.optionalFeature || null;
}

/**
 * Get the GitHub repository information for a document
 * Returns the repository owner, name, and branch for building GitHub URLs
 */
export function getDocumentGithubInfo(
  version: string,
  optionalFeature?: string | null,
): { owner: string; repo: string; branch: string; docsPath?: string } | null {
  const config = getSourceConfig(version, optionalFeature || undefined);
  if (!config) {
    return null;
  }
  return {
    owner: config.owner,
    repo: config.repo,
    branch: config.branch,
    docsPath: config.docsPath,
  };
}
