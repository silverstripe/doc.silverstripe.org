import path from 'path';

/**
 * Resolves relative markdown file links to proper URL paths
 * Transforms links like './04_security.md' to '/en/6/optional_features/advancedworkflow/security/'
 *
 * @param linkPath - The link path from markdown (e.g., './04_security.md')
 * @param currentFilePath - The full path of the current markdown file
 * @param version - The documentation version
 * @returns Absolute URL path for the link, or original if not a markdown link
 */
export function resolveMarkdownLink(
  linkPath: string,
  currentFilePath: string,
  version: string,
): string {
  // Skip if not a markdown file link
  if (!linkPath.endsWith('.md')) {
    return linkPath;
  }

  // Skip absolute URLs and protocol links
  if (linkPath.startsWith('/') || linkPath.startsWith('http') || linkPath.includes('://')) {
    return linkPath;
  }

  // Get directory of current file
  const currentDir = path.dirname(currentFilePath);

  // Resolve relative path to get absolute file path
  const resolvedPath = path.resolve(currentDir, linkPath);

  // Normalize to forward slashes for URLs
  const normalizedPath = resolvedPath.replace(/\\/g, '/');

  // Extract the path relative to content root
  // Matches: mock-content, .cache/docs, .cache/user, or legacy .cache/content
  const contentMatch = normalizedPath.match(/(?:mock-content|\.cache\/(?:docs|user|content))(.*)$/);
  if (!contentMatch) {
    // Fallback: try to extract version-based path
    return linkPath;
  }

  const relativePath = contentMatch[1] || '';

  // Convert file path to URL slug
  // Path like /v6/optional_features/advancedworkflow/04_security.md
  // becomes /en/6/optional_features/advancedworkflow/security/

  // Remove version prefix from path (e.g., /v6/ or /v5/)
  const withoutVersion = relativePath.replace(/^\/v\d+\//, '/');

  // Remove .md extension
  const withoutExt = withoutVersion.replace(/\.md$/, '');

  // Get the directory and filename
  const dir = path.dirname(withoutExt);
  const filename = path.basename(withoutExt);

  // Strip numeric prefix from filename (e.g., '04_security' -> 'security')
  const cleanFilename = filename.replace(/^\d+_/, '').toLowerCase();

  // Clean directory path (strip numeric prefixes from each segment)
  const cleanDir = dir
    .split('/')
    .filter((part) => part.length > 0)
    .map((part) => part.replace(/^\d+_/, '').toLowerCase())
    .join('/');

  // Handle index files - they should point to the parent directory
  if (cleanFilename === 'index') {
    // For index.md, the URL is just the directory
    const dirPath = cleanDir ? `/${cleanDir}` : '';
    return `/en/${version}${dirPath}/`;
  }

  // Build the final URL
  const dirPath = cleanDir ? `/${cleanDir}` : '';
  return `/en/${version}${dirPath}/${cleanFilename}/`;
}

/**
 * Checks if a link path is a relative markdown file link
 * @param linkPath - The link path to check
 * @returns True if path is a relative markdown file link
 */
export function isRelativeMarkdownLink(linkPath: string): boolean {
  return linkPath.endsWith('.md')
    && !linkPath.startsWith('/')
    && !linkPath.startsWith('http')
    && !linkPath.includes('://');
}
