import { DocumentNode, NavNode } from '@/types/types';
import { sortDocuments } from '../content/sort-files';

/**
 * Filter documents to only those matching a specific version
 */
function getDocsForVersion(docs: DocumentNode[], version: string): DocumentNode[] {
  return docs.filter((doc) => doc.version === version);
}

/**
 * Get children of a given node that should be shown in navigation
 * Respects hideChildren and hideSelf frontmatter
 */
function getNavChildren(node: DocumentNode, allDocs: DocumentNode[]): DocumentNode[] {
  if (node.hideChildren) {
    return [];
  }

  const children = allDocs.filter((n) => n.parentSlug === node.slug && !n.hideSelf);

  // Add any unhidden items
  allDocs.forEach((c) => {
    if (c.parentSlug === node.slug && c.unhideSelf && !children.includes(c)) {
      children.push(c);
    }
  });

  return sortDocuments(children);
}

/**
 * Build a hierarchical navigation tree from documents for a specific version
 * Returns the root level items (children of version index)
 */
export function buildNavTree(
  docs: DocumentNode[],
  version: string,
  currentSlug?: string,
): NavNode[] {
  const versionDocs = getDocsForVersion(docs, version);

  // Find the root document (version index: /en/{version}/)
  const rootSlug = `/en/${version}/`;
  const rootDoc = versionDocs.find((doc) => doc.slug === rootSlug);

  if (!rootDoc) {
    return [];
  }

  // Get top-level items (should exclude the root itself)
  const topLevelItems = getNavChildren(rootDoc, versionDocs);

  // Filter out any item that has the same slug as root (should never happen, but safety check)
  const filteredTopLevelItems = topLevelItems.filter((item) => item.slug !== rootSlug);

  // Build tree recursively
  const buildTree = (nodes: DocumentNode[], depth: number = 0): NavNode[] => nodes.map((node) => {
    // Allow up to 5 levels of depth (0, 1, 2, 3, 4) in the navigation tree
    const children = depth < 4 ? getNavChildren(node, versionDocs) : [];
    const childNodes = buildTree(children, depth + 1);

    return {
      slug: node.slug,
      title: node.title,
      isIndex: node.isIndex,
      isActive: currentSlug ? node.slug === currentSlug : false,
      children: childNodes,
      hasVisibleChildren: childNodes.length > 0,
    };
  });

  return buildTree(filteredTopLevelItems);
}

/**
 * Check if a nav node or any of its descendants is active
 */
export function isNodeOrDescendantActive(node: NavNode): boolean {
  if (node.isActive) {
    return true;
  }
  return node.children.some((child) => isNodeOrDescendantActive(child));
}

/**
 * Get the path to the current active node (for auto-expanding)
 */
export function getActiveAncestorsSlug(node: NavNode, ancestors: string[] = []): string[] {
  if (node.isActive) {
    return [...ancestors, node.slug];
  }

  for (const child of node.children) {
    const result = getActiveAncestorsSlug(child, [...ancestors, node.slug]);
    if (result.length > 0) {
      return result;
    }
  }

  return [];
}
