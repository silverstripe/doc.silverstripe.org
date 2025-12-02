import { visit } from 'unist-util-visit';
import type { Root, Element, Text as HastText } from 'hast';

/**
 * Type for HAST element nodes used in code block processing
 * Flexible type that accepts the range of properties we create in wrapper nodes
 */
interface CodeBlockElement {
  type: 'element';
  tagName: string;
  properties?: Record<string, unknown>;
  children?: (CodeBlockElement | HastText)[];
}

/**
 * Language aliases for Silverstripe documentation
 * Maps custom aliases to standard language identifiers
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  ss: 'html', // Silverstripe template syntax
  silverstripe: 'php',
  php: 'php',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  bash: 'bash',
  shell: 'bash',
  html: 'html',
  xml: 'xml',
  css: 'css',
  scss: 'scss',
  sql: 'sql',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  markdown: 'markdown',
  md: 'markdown',
};

/**
 * Rehype plugin to add language classes to code blocks
 * We'll use Prism.js for highlighting on the client side
 */
export function highlightCodeBlocks() {
  return async (tree: Root) => {
    // Find all pre/code blocks
    visit(tree, 'element', (node: Element, index: number | undefined, parent: Element | Root | undefined) => {
      if (node.tagName === 'pre' && parent && index !== undefined) {
        const codeNode = node.children?.[0];
        if (codeNode && typeof codeNode === 'object' && 'tagName' in codeNode && codeNode.tagName === 'code') {
          processCodeBlock(
            node as CodeBlockElement,
            codeNode as CodeBlockElement,
            parent as any,
            index,
          );
        }
      }
    });
  };
}

/**
 * Process a single code block
 */
function processCodeBlock(
  preNode: CodeBlockElement,
  codeNode: CodeBlockElement,
  parent: any,
  index: number,
): void {
  const classAttr = codeNode.properties?.className;
  const classes = Array.isArray(classAttr) ? classAttr : [classAttr].filter(Boolean);

  // Extract language from class
  let language = 'text';
  for (const cls of classes) {
    if (typeof cls === 'string' && cls.startsWith('language-')) {
      language = cls.replace('language-', '');
      break;
    }
  }

  // Resolve language alias
  const resolvedLanguage = LANGUAGE_ALIASES[language] || language;

  // Get raw code text
  const codeText = getTextContent(codeNode);

  // Create a wrapper div with copy button and language badge
  const wrapperNode: CodeBlockElement = {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'code-block-wrapper',
      'data-language': resolvedLanguage,
    },
    children: [
      // Header with language and copy button
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'code-block-header',
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: 'code-block-language' },
            children: [{ type: 'text', value: resolvedLanguage }],
          },
          {
            type: 'element',
            tagName: 'button',
            properties: {
              className: 'code-block-copy-btn',
              type: 'button',
              'data-code': codeText,
              'aria-label': 'Copy code to clipboard',
            },
            children: [
              {
                type: 'text',
                value: '📋 Copy',
              },
            ],
          },
        ],
      },
      // Pre/code block with language class for Prism
      {
        type: 'element',
        tagName: 'pre',
        properties: {
          className: `language-${resolvedLanguage}`,
        },
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: {
              className: `language-${resolvedLanguage}`,
            },
            children: [{ type: 'text', value: codeText }],
          },
        ],
      },
    ],
  };

  parent.children[index] = wrapperNode;
}

/**
 * Extract text content from a node
 * Recursively traverses code block element children to collect text values
 */
function getTextContent(node: CodeBlockElement | HastText): string {
  // Handle text nodes directly
  if (node.type === 'text' && 'value' in node) {
    return node.value || '';
  }

  // Handle element nodes with children
  if (node.type === 'element' && 'children' in node && node.children && node.children.length > 0) {
    return node.children
      .map((child: CodeBlockElement | HastText) => getTextContent(child))
      .join('');
  }

  return '';
}
