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
