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
 * 
 * Simply preserves code content with language classes.
 * Actual syntax highlighting can be done client-side with CSS/JS.
 */
export function highlightCodeBlocks() {
  return async (tree: Root) => {
    // No-op: Just let the default processing handle it.
    // Code blocks already have language classes from the markdown processor.
    // Content is preserved as text and properly escaped by rehypeStringify.
  };
}
