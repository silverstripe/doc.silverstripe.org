import path from 'path';

/**
 * Resolves relative image paths in markdown to absolute paths
 * Handles ../ and ./ relative paths, converting them to public URLs
 *
 * @param imagePath - The image path from markdown (e.g., '../_images/screenshot.png')
 * @param currentFilePath - The full path of the current markdown file
 * @returns Absolute URL path for the image
 */
export function resolveImagePath(imagePath: string, currentFilePath: string): string {
  // If already absolute or starts with /, return as-is
  if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
    return imagePath;
  }

  // Get directory of current file
  const currentDir = path.dirname(currentFilePath);

  // Resolve relative path
  const resolvedPath = path.resolve(currentDir, imagePath);

  // Normalize to forward slashes for URLs
  const urlPath = resolvedPath.replace(/\\/g, '/');

  // If path is relative to content root, make it absolute for public serving
  // Content lives in .cache/{docs|user}/ or tests/fixtures/mock-content/
  // We want to return a path that works in the browser

  // Remove any leading path segments up to and including content directory
  // Matches: mock-content, .cache/docs, .cache/user, or legacy .cache/content
  const contentMatch = urlPath.match(/(?:mock-content|\.cache\/(?:docs|user|content))(.*)$/);
  if (contentMatch) {
    // Return as absolute path from root
    return contentMatch[1] || '/';
  }

  // Fallback: return the resolved URL path
  return urlPath;
}

/**
 * Normalizes image paths to ensure consistent behavior across different contexts
 * @param imagePath - The image path to normalize
 * @returns Normalized image path
 */
export function normalizeImagePath(imagePath: string): string {
  // Remove trailing slashes
  return imagePath.replace(/\/$/, '') || '/';
}

/**
 * Checks if an image path is relative
 * @param imagePath - The image path to check
 * @returns True if path is relative
 */
export function isRelativePath(imagePath: string): boolean {
  return !imagePath.startsWith('/') && !imagePath.startsWith('http');
}
