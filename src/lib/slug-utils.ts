/**
 * Consolidated utility functions for slug handling and routing
 */
import { DocumentNode } from '@/types';
import { getAllVersions, getDefaultVersion } from '@/lib/versions/version-utils';

/**
 * Normalize a slug to ensure consistent format
 * - Adds leading slash if missing
 * - Adds trailing slash if missing
 * - Converts to lowercase for comparison
 */
export function normalizeSlug(slug: string): string {
  let normalized = slug.startsWith('/') ? slug : `/${slug}`;
  normalized = normalized.endsWith('/') ? normalized : `${normalized}/`;
  return normalized;
}

/**
 * Normalize slug for case-insensitive comparison
 */
export function normalizeSlugForComparison(slug: string): string {
  return normalizeSlug(slug).toLowerCase();
}

/**
 * Build a full slug from route parameters
 * Params come from Next.js dynamic route: [version]/[[...slug]]/page.tsx
 */
export function buildSlugFromParams(params: {
  version: string;
  slug?: string[];
}): string {
  const parts = ['en', params.version];
  if (params.slug && params.slug.length > 0) {
    parts.push(...params.slug);
  }
  return `/${parts.join('/')}/`;
}

/**
 * Extract version and slug parts from a full slug
 * Takes a slug like /en/6/getting-started/installation/ and returns
 * {version: '6', slug: ['getting-started', 'installation']}
 */
export function extractVersionAndSlug(fullSlug: string): {
  version: string;
  slug: string[];
} {
  const normalized = fullSlug.startsWith('/') ? fullSlug : `/${fullSlug}`;
  const cleaned = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  const parts = cleaned.split('/').filter(Boolean);
  // Format is /en/VERSION/...rest
  if (parts.length < 2) {
    throw new Error(`Invalid slug format: ${fullSlug}`);
  }
  const [, version, ...slug] = parts;
  return { version, slug };
}

/**
 * Get available versions from documents
 * This would be used by generateStaticParams
 */
export function getAvailableVersions(): string[] {
  return getAllVersions();
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
  version: string,
): boolean {
  const normalizedSlugEnd = normalizeSlug(slug);
  // Try exact match first
  const exactMatch = documents.find(
    (doc) => doc.version === version && doc.slug === normalizedSlugEnd,
  );
  if (exactMatch) {
    return true;
  }
  // Try case-insensitive match
  const caseInsensitiveMatch = documents.find(
    (doc) => doc.version === version
      && doc.slug.toLowerCase() === normalizedSlugEnd.toLowerCase(),
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
  documents: DocumentNode[],
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
  slug: string,
): { version: string; optionalFeature: string | null } {
  // Format: /en/{version}[/optional_features/{feature}/...]
  const parts = slug.split('/').filter(Boolean);
  if (parts.length < 2) {
    return { version: getDefaultVersion(), optionalFeature: null };
  }
  const version = parts[1];
  // Check if this is an optional feature path
  if (parts.length >= 4 && parts[2] === 'optional_features') {
    const optionalFeature = parts[3];
    return { version, optionalFeature };
  }
  return { version, optionalFeature: null };
}
