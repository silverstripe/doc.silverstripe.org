import { visit } from 'unist-util-visit';
import type { Root, Link } from 'mdast';
import { resolveMarkdownLink } from './resolve-link-paths';

/**
 * Remark plugin to resolve relative markdown file links
 * Converts .md file links to proper URL paths
 *
 * Usage: processor.use(remarkLinks, { currentFilePath: '/path/to/file.md', version: '6' })
 */
export function remarkLinks(options?: { currentFilePath?: string; version?: string }) {
  return async (tree: Root) => {
    const currentFilePath = options?.currentFilePath || '';
    const version = options?.version || '';

    if (!currentFilePath || !version) {
      return;
    }

    visit(tree, 'link', (node: Link) => {
      if (node.url) {
        node.url = resolveMarkdownLink(node.url, currentFilePath, version);
      }
    });
  };
}

export default remarkLinks;
