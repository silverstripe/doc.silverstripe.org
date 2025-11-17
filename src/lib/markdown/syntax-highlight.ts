import { createHighlighter, type Highlighter } from 'shiki';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

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
 * Highlight a code block with shiki
 */
async function highlightCode(
  code: string,
  lang: string
): Promise<string> {
  try {
    const hl = await getHighlighterInstance();
    const language = LANGUAGE_ALIASES[lang] || lang;
    
    // Check if language is supported
    if (!hl.getLoadedLanguages().includes(language)) {
      // Fallback to plain text if language not supported
      return escapeHtml(code);
    }

    const highlighted = hl.codeToHtml(code, {
      lang: language,
      theme: 'github-light',
    });
    
    return highlighted;
  } catch (error) {
    console.error(`Error highlighting code with lang ${lang}:`, error);
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Rehype plugin to syntax highlight code blocks
 * This is a plugin factory that returns the transformer function
 */
export function highlightCodeBlocks() {
  return async (tree: Root) => {
    const codeNodes: Array<{
      node: Element;
      lang: string;
    }> = [];

    // First pass: collect all code nodes
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'pre') {
        const codeChild = node.children?.find(
          (child): child is Element =>
            child.type === 'element' && child.tagName === 'code'
        );
        
        if (codeChild) {
          const classAttr = (codeChild.properties?.className as string[] | undefined) || [];
          const lang = classAttr[0]?.replace(/^language-/, '') || '';
          codeNodes.push({ node: codeChild, lang });
        }
      }
    });

    // Second pass: highlight each code block
    for (const { node, lang } of codeNodes) {
      const code = node.children
        ?.filter((child) => child.type === 'text')
        .map((child) => (child as any).value)
        .join('') || '';

      if (code && lang) {
        const highlighted = await highlightCode(code, lang);
        // Replace the pre>code structure with highlighted HTML
        const parent = tree as any;
        // This is a simplified approach - in production you'd want more careful replacement
        node.children = [
          {
            type: 'raw',
            value: highlighted,
          } as any,
        ];
      }
    }
  };
}
