import { createHighlighter, type Highlighter } from 'shiki';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { escapeHtml } from '@/lib/utils';

// Singleton highlighter instance
let highlighter: Highlighter | null = null;

/**
 * Language aliases for Silverstripe documentation
 * Maps custom aliases to standard language identifiers
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  ss: 'html',           // Silverstripe template syntax
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
 * Initialize shiki highlighter (lazy load)
 */
async function getHighlighterInstance(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-light'],
      langs: Object.values(LANGUAGE_ALIASES),
    });
  }
  return highlighter;
}

/**
 * Rehype plugin to add language classes to code blocks
 * We'll use Prism.js for highlighting on the client side
 */
export function highlightCodeBlocks() {
  return async (tree: Root) => {
    // Find all pre/code blocks
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (node.tagName === 'pre' && parent && index !== undefined) {
        const codeNode = node.children?.[0];
        if (codeNode && codeNode.tagName === 'code') {
          processCodeBlock(node, codeNode, parent, index);
        }
      }
    });
  };
}

/**
 * Process a single code block
 */
function processCodeBlock(preNode: any, codeNode: any, parent: any, index: number): void {
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
  const wrapperNode: any = {
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
 */
function getTextContent(node: any): string {
  if (!node.children || node.children.length === 0) {
    return node.value || '';
  }

  return node.children
    .map((child: any) => {
      if (child.type === 'text') {
        return child.value || '';
      }
      if (child.type === 'element') {
        return getTextContent(child);
      }
      return '';
    })
    .join('');
}
