/**
 * Navigation and routing logic for multi-version documentation
 * Handles optional modules, version switching, and GitHub links
 */

import { DocumentNode } from '@/types';
import { getSourceConfig } from './sources-config';

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
  optionalFeature?: string | null
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

/**
 * Check if a slug exists in a specific version
 * This is used for version switching fallback logic
 * @param slug - The slug to check (e.g., /en/6/getting-started/)
 * @param documents - All available documents
 * @returns true if the slug exists in the version, false otherwise
 */
export function doesSlugExistInVersion(
  slug: string,
  documents: DocumentNode[],
  version: string
): boolean {
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const normalizedSlugEnd = normalizedSlug.endsWith('/') ? normalizedSlug : `${normalizedSlug}/`;
  
  // Try exact match first
  const exactMatch = documents.find(
    doc => doc.version === version && doc.slug === normalizedSlugEnd
  );
  if (exactMatch) return true;
  
  // Try case-insensitive match
  const caseInsensitiveMatch = documents.find(
    doc => 
      doc.version === version && 
      doc.slug.toLowerCase() === normalizedSlugEnd.toLowerCase()
  );
  return !!caseInsensitiveMatch;
}

/**
 * Generate a fallback slug for version switching
 * If the current slug doesn't exist in the target version, returns the root of that version
 * @param currentSlug - The current page slug
 * @param targetVersion - The target version to switch to
 * @param documents - All available documents
 * @returns The slug for the target version, or root if current doesn't exist
 */
export function getFallbackSlugForVersion(
  currentSlug: string,
  targetVersion: string,
  documents: DocumentNode[]
): string {
  // Try to replace version in current slug
  const newSlug = currentSlug.replace(/^\/en\/[0-9]+\//, `/en/${targetVersion}/`);
  
  // Check if it exists
  if (doesSlugExistInVersion(newSlug, documents, targetVersion)) {
    return newSlug;
  }
  
  // Fallback to root of target version
  return `/en/${targetVersion}/`;
}

/**
 * Extract version and optional feature from a slug path
 * @param slug - Full slug (e.g., /en/6/optional_features/linkfield/)
 * @returns Object with version and optionalFeature
 */
export function extractVersionAndFeatureFromSlug(
  slug: string
): { version: string; optionalFeature: string | null } {
  // Format: /en/{version}[/optional_features/{feature}/...]
  const parts = slug.split('/').filter(Boolean);
  
  if (parts.length < 2) {
    return { version: '6', optionalFeature: null };
  }
  
  const version = parts[1];
  
  // Check if this is an optional feature path
  if (parts.length >= 4 && parts[2] === 'optional_features') {
    const optionalFeature = parts[3];
    return { version, optionalFeature };
  }
  
  return { version, optionalFeature: null };
}
