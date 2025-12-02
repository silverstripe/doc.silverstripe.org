import path from 'path';

/**
 * Generate a slug from a directory path and version
 * Strips numeric prefixes, converts to lowercase
 * Returns format: /en/{version}/{path}/
 */
export function generateSlug(
  dirPath: string,
  version: string,
  optional?: string,
): string {
  // Split path into segments and filter empty ones
  const segments = dirPath
    .split(/[\\/]/)
    .filter((s) => s && s.length > 0);

  // Strip numeric prefixes and convert to lowercase
  const parts = segments.map(
    (part) => part
      .replace(/^\d+_/, '') // Strip numeric prefix
      .toLowerCase(), // Convert to lowercase
  );

  // Build the slug
  const versionNum = version.replace(/^v/, '');
  const baseParts = ['en', versionNum];

  if (optional) {
    baseParts.push(
      optional
        .replace(/^\d+_/, '')
        .toLowerCase(),
    );
  }

  baseParts.push(...parts);

  return `/${baseParts.join('/')}/`;
}

/**
 * Generate slug from full path including filename
 */
export function generateSlugFromFullPath(
  fullPath: string,
  version: string,
  optional?: string,
): string {
  const dir = path.dirname(fullPath);
  return generateSlug(dir, version, optional);
}
