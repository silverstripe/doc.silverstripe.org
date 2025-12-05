import path from 'path';

/**
 * Checks if a root-relative path should be treated as an internal documentation link
 * Excludes paths that are already resolved, external URLs, or static assets
 */
function isInternalDocLink(pathStr: string): boolean {
  // Already resolved with /en/ prefix
  if (pathStr.startsWith('/en/')) {
    return false;
  }

  // External URLs with protocol
  if (pathStr.startsWith('http') || pathStr.includes('://')) {
    return false;
  }

  // Static asset paths (images, resources, etc)
  if (pathStr.startsWith('/_images/') || pathStr.startsWith('/_resources/') || pathStr.startsWith('/assets/')) {
    return false;
  }

  // If it passes all filters, it's an internal doc link
  return true;
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
 * Resolves markdown file links to proper URL paths
 * Transforms links like './04_security.md' to '/en/6/optional_features/advancedworkflow/security/'
 * Also handles root-relative links that don't have .md extension but are internal docs
 * And handles relative links without .md extension like './code' or '../getting_started'
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
  // Skip anchor-only links
  if (linkPath.startsWith('#')) {
    return linkPath;
  }

  // Skip external URLs
  if (linkPath.startsWith('http') || linkPath.includes('://')) {
    return linkPath;
  }

  // Skip static assets (images, etc)
  if (isStaticAsset(linkPath)) {
    return linkPath;
  }

  // Handle relative links without .md extension (e.g., './code', '../getting_started')
  // Also handles links with .md extension (e.g., '../getting_started/composer.md')
  if (linkPath.startsWith('./') || linkPath.startsWith('../')) {
    // Check if it's an image or static asset (don't process)
    if (isStaticAsset(linkPath)) {
      return linkPath;
    }

    // Extract anchor if present
    const [pathOnly, ...anchorParts] = linkPath.split('#');
    const anchor = anchorParts.length > 0 ? `#${anchorParts.join('#')}` : '';

    // Check if it ends with .md and remove if present
    let cleanPathOnly = pathOnly;
    if (cleanPathOnly.endsWith('.md')) {
      cleanPathOnly = cleanPathOnly.slice(0, -3);
    }

    // Get directory of current file
    const currentDir = path.dirname(currentFilePath);

    // Resolve relative path to get absolute file path
    const resolvedPath = path.resolve(currentDir, cleanPathOnly);

    // Normalize to forward slashes for URLs
    const normalizedPath = resolvedPath.replace(/\\/g, '/');

    // Extract the path relative to content root
    // Matches: mock-content, .cache/docs, .cache/user, or legacy .cache/content
    const regex = /(?:mock-content|\.cache\/(?:docs|user|content))(.*)$/;
    const contentMatch = normalizedPath.match(regex);
    if (!contentMatch) {
      // Fallback: return original
      return linkPath;
    }

    const relativePath = contentMatch[1] || '';

    // Remove version prefix from path (e.g., /v6/ or /v5/)
    const withoutVersion = relativePath.replace(/^\/v\d+\//, '/');

    // Get the directory and filename (without extension)
    const dir = path.dirname(withoutVersion);
    const filename = path.basename(withoutVersion);

    // Clean filename: strip numeric prefix and convert to lowercase
    const cleanFilename = filename.replace(/^\d+_/, '').toLowerCase();

    // Clean directory path: strip numeric prefixes from each segment
    const cleanDir = dir
      .split('/')
      .filter((part) => part.length > 0)
      .map((part) => part.replace(/^\d+_/, '').toLowerCase())
      .join('/');

    // Handle index files - they should point to the parent directory
    if (cleanFilename === 'index') {
      const dirPath = cleanDir ? `/${cleanDir}` : '';
      return `/en/${version}${dirPath}/${anchor}`;
    }

    // Build the final URL
    const dirPath = cleanDir ? `/${cleanDir}` : '';
    return `/en/${version}${dirPath}/${cleanFilename}/${anchor}`;
  }

  // Handle .md links
  if (linkPath.endsWith('.md')) {
    // Handle root-relative markdown paths like /developer_guides/security/index.md
    if (linkPath.startsWith('/')) {
      // Extract path and anchor
      const [pathOnly, ...anchorParts] = linkPath.split('#');
      const anchor = anchorParts.length > 0 ? `#${anchorParts.join('#')}` : '';

      // If it already contains /en/, return as-is
      if (pathOnly.startsWith('/en/')) {
        return linkPath;
      }

      // Check if it's an internal doc link
      if (!isInternalDocLink(pathOnly)) {
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
    const regex = /(?:mock-content|\.cache\/(?:docs|user|content))(.*)$/;
    const contentMatch = normalizedPath.match(regex);
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

  // Handle root-relative paths without .md extension
  if (linkPath.startsWith('/') && isInternalDocLink(linkPath)) {
    return resolveRootRelativePath(linkPath, version);
  }

  return linkPath;
}

/**
 * Checks if a link is a static asset that should not be resolved as a doc link
 * @param linkPath - The link path to check
 * @returns True if path is a static asset
 */
function isStaticAsset(linkPath: string): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
  const hasImageExtension = imageExtensions.some((ext) => linkPath.endsWith(ext));

  return hasImageExtension || linkPath.includes('/_images/');
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
