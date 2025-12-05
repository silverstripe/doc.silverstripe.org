/**
 * Remark plugin for custom heading IDs
 * Extracts {#custom-id} from heading text and sets the heading ID
 * Supports syntax like: ## My Heading {#custom-id}
 */

import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

interface Heading {
  type: string;
  depth: number;
  children?: any[];
  data?: {
    hProperties?: {
      id?: string;
    };
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface _TextNode {
  type: string;
  value: string;
}

/**
 * Plugin to extract custom heading IDs from {#id} syntax and set them as heading properties
 * This processes markdown AST before it's converted to HTML
 */
export function remarkCustomHeadingIds() {
  return (tree: Root) => {
    visit(tree, 'heading', (node: Heading) => {
      if (!node.children || node.children.length === 0) {
        return;
      }

      // Get the last child which might contain the custom ID
      const lastChild = node.children[node.children.length - 1];

      if (lastChild && lastChild.type === 'text') {
        const textValue = lastChild.value;
        // Match {#custom-id} at the end of the text
        const customIdMatch = textValue.match(/\s*\{#([^}]+)\}\s*$/);

        if (customIdMatch) {
          const customId = customIdMatch[1];
          // Remove the {#id} from the text
          lastChild.value = textValue.slice(0, customIdMatch.index).trim();

          // Set the heading ID in hProperties
          if (!node.data) {
            node.data = {};
          }
          if (!node.data.hProperties) {
            node.data.hProperties = {};
          }
          node.data.hProperties.id = customId;
        }
      }
    });
  };
}
