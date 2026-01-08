import path from 'path';
import { DocumentNode } from '@/types/types';

/**
 * Check if a string looks like a semantic version number
 */
function isVersionNumber(value: string): boolean {
  return /^\d+\.\d+\.\d+(-(alpha|beta|rc)\d*)?$/.test(value);
}

/**
 * Sort documents respecting numeric prefixes and alphabetical order
 * Uses extracted order property from filenames, then falls back to alphabetical
 * When order is tied, folders (isIndex=true) come before files (isIndex=false)
 */
export function sortDocuments(docs: DocumentNode[]): DocumentNode[] {
  return [...docs].sort((a, b) => {
    // If both have order, compare by order first (regardless of directory)
    // This ensures siblings with order are sorted together
    if (a.order !== undefined && b.order !== undefined) {
      // If orders are different, sort by order
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      // Orders are the same - folders come before files
      // isIndex = true means it's a folder (index.md)
      // isIndex = false means it's a regular file
      if (a.isIndex !== b.isIndex) {
        return a.isIndex ? -1 : 1; // folders first
      }
      // Both are folders or both are files, fall through to directory/title comparison
    }

    // Compare absolute paths (different directories)
    const dirA = path.dirname(a.fileAbsolutePath);
    const dirB = path.dirname(b.fileAbsolutePath);

    if (dirA !== dirB) {
      return dirA.localeCompare(dirB, 'en', { numeric: false, sensitivity: 'case' });
    }

    // If only one has order, it comes first
    if (a.order !== undefined) {
      return -1;
    }
    if (b.order !== undefined) {
      return 1;
    }

    // No order: compare file titles with numeric awareness
    const compA = a.fileTitle;
    const compB = b.fileTitle;
    const compareOptions = { numeric: false, sensitivity: 'case' as const };

    // If both are numeric or version numbers, compare numerically
    if (
      (!Number.isNaN(Number(compA)) && !Number.isNaN(Number(compB)))
      || (isVersionNumber(compA) && isVersionNumber(compB))
    ) {
      compareOptions.numeric = true;
    }

    return compA.localeCompare(compB, 'en', compareOptions);
  });
}
