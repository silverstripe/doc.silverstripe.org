import { DocumentNode } from '@/types/types';
import { sortDocuments } from '../content/sort-files';

/**
 * Cache for all documents - populated by build context
 */
let documentCache: DocumentNode[] = [];

/**
 * Set all documents in cache
 */
export function setAllDocuments(docs: DocumentNode[]): void {
  documentCache = docs;
}

/**
 * Get the cached documents
 */
function getAllDocumentsCache(): DocumentNode[] {
  return documentCache;
}

/**
 * Clear cache (for testing)
 */
export function clearDocumentCache(): void {
  documentCache = [];
}

/**
 * Get direct children of a document
 * @param doc Parent document
 * @param includeFolders If true, include index pages (folders); if false, only include
 *   non-index pages
 * @returns Array of child documents, sorted
 */
export function getChildren(
  doc: DocumentNode,
  includeFolders: boolean = false,
): DocumentNode[] {
  if (!doc.isIndex) {
    return [];
  }

  // This is a placeholder - will be populated by getAllDocuments from build context
  const allDocs = getAllDocumentsCache();
  const children = allDocs.filter(
    (n) => n.parentSlug === doc.slug && (includeFolders || !n.isIndex),
  );

  return sortDocuments(children);
}

/**
 * Get siblings of a document (other pages with same parent)
 * @param doc Document to find siblings for
 * @returns Array of sibling documents, sorted
 */
export function getSiblings(doc: DocumentNode): DocumentNode[] {
  const allDocs = getAllDocumentsCache();
  const siblings = allDocs.filter((n) => n.parentSlug === doc.parentSlug);
  return sortDocuments(siblings);
}

/**
 * Options for filtering children
 */
export interface FilterOptions {
  folderName?: string;
  exclude?: string[];
  only?: string[];
  includeFolders?: boolean;
  reverse?: boolean;
  asList?: boolean;
}

/**
 * Get children with advanced filtering
 * @param doc Parent document
 * @param options Filter options
 * @returns Filtered and sorted children
 */
export function getChildrenFiltered(
  doc: DocumentNode,
  options: FilterOptions,
): DocumentNode[] {
  const {
    folderName,
    exclude = [],
    only = [],
    includeFolders = false,
    reverse = false,
  } = options;

  let nodes: DocumentNode[] = [];

  // Normalize function: convert underscores and hyphens to spaces for comparison
  const normalize = (str: string): string => str.replace(/[-_]/g, ' ').toLowerCase();

  if (folderName) {
    // Get target folder by name and then get its children
    const targetFolder = getChildren(doc, true).find(
      (child) => child.isIndex && normalize(child.fileTitle) === normalize(folderName),
    );
    if (targetFolder) {
      nodes = getChildren(targetFolder, false);
    }
  } else if (exclude.length > 0) {
    // Get all children except excluded ones
    const exclusionSet = new Set(exclude.map((e) => normalize(e)));
    nodes = getChildren(doc, includeFolders).filter(
      (child) => !exclusionSet.has(normalize(child.fileTitle)),
    );
  } else if (only.length > 0) {
    // Get only specified children
    const inclusionSet = new Set(only.map((e) => normalize(e)));
    nodes = getChildren(doc, includeFolders).filter(
      (child) => inclusionSet.has(normalize(child.fileTitle)),
    );
  } else {
    // Get all children
    nodes = getChildren(doc, includeFolders);
  }

  // Apply reverse if requested
  if (reverse) {
    nodes = [...nodes].reverse();
  }

  return nodes;
}
