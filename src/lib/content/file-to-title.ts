import path from 'path';

/**
 * Convert a filename to a human-readable title
 * - Strips numeric prefixes (01_, 02_, etc.)
 * - Converts underscores to spaces
 * - For index files, uses parent directory name
 */
export function fileToTitle(filename: string, parentDir?: string): string {
  let name = filename;

  // If it's an index file, use the parent directory name
  if (filename === 'index' && parentDir) {
    name = path.basename(parentDir);
  }

  // Strip numeric prefix (01_, 02_, etc.)
  name = name.replace(/^\d+_/, '');

  // Convert underscores to spaces
  name = name.replace(/_/g, ' ');

  // Capitalize each word (Title Case)
  name = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return name;
}
