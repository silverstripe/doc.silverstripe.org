/**
 * Utility to check if a slug exists in a specific version
 * Used for version switcher fallback logic
 */
import { getAllDocuments } from '@/lib/content/get-document';
import { normalizeSlug } from '@/lib/slug-utils';

// Cache for available slugs per version
let slugsByVersion: Map<string, Set<string>> | null = null;

/**
 * Get all available slugs for a specific version
 * @param version - The version to get slugs for
 * @returns Set of normalized slugs for the version
 */
async function getSlugsByVersion(version: string): Promise<Set<string>> {
  // Build cache if not exists
  if (!slugsByVersion) {
    slugsByVersion = new Map();
    const allDocs = await getAllDocuments();

    for (const doc of allDocs) {
      const parts = doc.slug.split('/').filter(Boolean);
      if (parts.length < 2) continue;

      const docVersion = parts[1];
      if (!slugsByVersion.has(docVersion)) {
        slugsByVersion.set(docVersion, new Set());
      }

      slugsByVersion.get(docVersion)!.add(normalizeSlug(doc.slug));
    }
  }
  return slugsByVersion.get(version) || new Set();
}

/**
 * Check if a slug exists in a specific version
 * @param version - The version to check
 * @param slug - The slug to check (e.g., /en/6/getting-started/)
 * @returns true if the slug exists in the version
 */
export async function slugExistsInVersion(version: string, slug: string): Promise<boolean> {
  const availableSlugs = await getSlugsByVersion(version);
  const normalizedSlug = normalizeSlug(slug);
  return availableSlugs.has(normalizedSlug);
}
