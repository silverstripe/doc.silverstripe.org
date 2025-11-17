import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import { resolveImagePath } from './resolve-image-paths';

/**
 * Remark plugin to resolve relative image paths in markdown
 * Converts relative paths to absolute paths based on file location
 * 
 * Usage: processor.use(remarkImages, { currentFilePath: '/path/to/file.md' })
 */
export function remarkImages(options?: { currentFilePath?: string }) {
  return async (tree: Root) => {
    const currentFilePath = options?.currentFilePath || '';

    visit(tree, 'image', (node: any) => {
      if (node.url && currentFilePath) {
        node.url = resolveImagePath(node.url, currentFilePath);
      }
    });
  };
}

export default remarkImages;
