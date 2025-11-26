/**
 * Build a map of slugs available in each version
 * This is used by VersionSwitcher to check if a slug exists before navigating
 */

import { getAllDocuments } from '@/lib/content/get-document';
import { getAllVersions } from '@/lib/versions';

let slugMapCache: Map<string, Set<string>> | null = null;

/**
 * Get a map of all available slugs grouped by version
 * slug -> version -> boolean
 */
export async function getSlugsByVersion(): Promise<Map<string, Set<string>>> {
  if (slugMapCache) {
    return slugMapCache;
  }

  const docs = await getAllDocuments();
  const slugMap = new Map<string, Set<string>>();

  for (const version of getAllVersions()) {
    slugMap.set(version, new Set());
  }

  for (const doc of docs) {
    const versionSlugs = slugMap.get(doc.version);
    if (versionSlugs) {
      versionSlugs.add(doc.slug.toLowerCase());
    }
  }

  slugMapCache = slugMap;
  return slugMap;
}

/**
 * Check if a slug exists in a specific version
 */
export async function doesSlugExistInVersion(
  slug: string,
  version: string
): Promise<boolean> {
  const slugMap = await getSlugsByVersion();
  const versionSlugs = slugMap.get(version);
  
  if (!versionSlugs) {
    return false;
  }

  // Normalize the slug for comparison
  const normalizedSlug = slug.toLowerCase();
  return versionSlugs.has(normalizedSlug);
}

/**
 * Clear the cache (for testing)
 */
export function clearSlugMapCache(): void {
  slugMapCache = null;
}
