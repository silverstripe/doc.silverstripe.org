import path from 'path';

/**
 * List of known directory segments that can appear in root-relative markdown links
 */
const KNOWN_DIR_SEGMENTS = [
  'getting_started',
  'developer_guides',
  'optional_features',
  'managing_your_website',
  'changelogs',
  'contributing',
];

/**
 * Checks if a path contains at least one known directory segment
 * Handles paths with numeric prefixes like /01_developer_guides
 */
function containsKnownSegment(pathStr: string): boolean {
  // Remove numeric prefixes from each path segment and check
  const segments = pathStr.split('/').map((part) => part.replace(/^\d+_/, '').toLowerCase());
  return segments.some((segment) => KNOWN_DIR_SEGMENTS.includes(segment));
}

/**
 * Resolves root-relative markdown paths to proper URL paths
 * e.g., '/developer_guides/security/secure_coding' ->
 * '/en/6/developer_guides/security/secure_coding/'
 * Handles anchor fragments: '/path#anchor' -> '/en/6/path/#anchor'
 *
 * @param linkPath - The root-relative link path (e.g., '/developer_guides/...')
 * @param version - The documentation version
 * @returns Absolute URL path for the link
 */
function resolveRootRelativePath(linkPath: string, version: string): string {
  // Extract anchor if present
  const [pathOnly, ...anchorParts] = linkPath.split('#');
  const anchor = anchorParts.length > 0 ? `#${anchorParts.join('#')}` : '';

  // Remove .md extension if present
  let cleanPathStr = pathOnly;
  if (cleanPathStr.endsWith('.md')) {
    cleanPathStr = cleanPathStr.slice(0, -3);
  }

  // Remove leading/trailing slashes and convert to lowercase
  const cleanPath = cleanPathStr
    .split('/')
    .filter((part) => part.length > 0)
    .map((part) => part.toLowerCase())
    .join('/');

  return `/en/${version}/${cleanPath}/${anchor}`;
}

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
    // Handle root-relative paths that don't have .md extension
    // Check if it's a root-relative path starting with / and not already prefixed with /en/
    if (linkPath.startsWith('/') && !linkPath.startsWith('/en/') && !linkPath.startsWith('http') && !linkPath.includes('://')) {
      // Extract path without anchor
      const [pathOnly] = linkPath.split('#');
      // Check if it contains a known directory segment
      if (containsKnownSegment(pathOnly)) {
        return resolveRootRelativePath(linkPath, version);
      }
    }
    return linkPath;
  }

  // Skip http/https protocol links
  if (linkPath.startsWith('http') || linkPath.includes('://')) {
    return linkPath;
  }

  // Handle root-relative markdown paths like /developer_guides/security/index.md
  if (linkPath.startsWith('/')) {
    // Extract path and anchor
    const [pathOnly, ...anchorParts] = linkPath.split('#');
    const anchor = anchorParts.length > 0 ? `#${anchorParts.join('#')}` : '';

    // If it already contains /en/, return as-is
    if (pathOnly.startsWith('/en/')) {
      return linkPath;
    }

    // Check if it contains a known directory segment
    if (!containsKnownSegment(pathOnly)) {
      return linkPath;
    }

    // Remove .md extension and process the path
    const withoutExt = pathOnly.replace(/\.md$/, '');

    // Clean the path
    const cleanPath = withoutExt
      .split('/')
      .filter((part) => part.length > 0)
      .map((part) => part.replace(/^\d+_/, '').toLowerCase())
      .join('/');

    // Handle index files - they should point to the parent directory
    if (cleanPath.endsWith('index')) {
      const dirPath = cleanPath.slice(0, -'index'.length);
      return `/en/${version}/${dirPath}${anchor}`;
    }

    return `/en/${version}/${cleanPath}/${anchor}`;
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
