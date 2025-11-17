import path from 'path';
import { DocumentNode } from '@/types';

/**
 * Check if a string looks like a semantic version number
 */
function isVersionNumber(value: string): boolean {
  return /^\d+\.\d+\.\d+(-(alpha|beta|rc)\d*)?$/.test(value);
}

/**
 * Sort documents respecting numeric prefixes and alphabetical order
 * Numeric prefixes affect sort order, alphabetical for non-numbered files
 */
export function sortDocuments(docs: DocumentNode[]): DocumentNode[] {
  return [...docs].sort((a, b) => {
    // Compare absolute paths first (different directories)
    const dirA = path.dirname(a.fileAbsolutePath);
    const dirB = path.dirname(b.fileAbsolutePath);

    if (dirA !== dirB) {
      return dirA.localeCompare(dirB, 'en', { numeric: false, sensitivity: 'case' });
    }

    // Same directory: compare file titles with numeric awareness
    let compA = a.fileTitle;
    let compB = b.fileTitle;
    const compareOptions = { numeric: false, sensitivity: 'case' as const };

    // If both are numeric or version numbers, compare numerically
    if (
      (!isNaN(Number(compA)) && !isNaN(Number(compB))) ||
      (isVersionNumber(compA) && isVersionNumber(compB))
    ) {
      compareOptions.numeric = true;
    }

    return compA.localeCompare(compB, 'en', compareOptions);
  });
}
