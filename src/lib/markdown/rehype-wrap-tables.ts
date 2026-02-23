/**
 * Represents a node in a Hypertext Abstract Syntax Tree (hast).
 * This is the standard AST format used by the Rehype ecosystem to parse and manipulate HTML.
 * * @see https://github.com/syntax-tree/hast
 */
export type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const tableWrapperClass = 'table-wrapper';

export function rehypeWrapTables() {
  return (tree: HastNode) => {
    wrapTables(tree);
  };
}

function wrapTables(node: HastNode): void {
  if (!node.children) {
    return;
  }

  node.children = node.children.map((child) => {
    if (
      child.type === 'element'
      && child.tagName === 'table'
      && !isTableWrapper(node)
    ) {
      return {
        type: 'element',
        tagName: 'div',
        properties: { className: [tableWrapperClass] },
        children: [child],
      };
    }

    wrapTables(child);
    return child;
  });
}

function isTableWrapper(node: HastNode): boolean {
  if (node.type !== 'element' || node.tagName !== 'div') {
    return false;
  }

  return hasClassName(node.properties?.className, tableWrapperClass);
}

function hasClassName(className: unknown, value: string): boolean {
  if (Array.isArray(className)) {
    return className.includes(value);
  }

  if (typeof className === 'string') {
    return className.split(' ').includes(value);
  }

  return false;
}
