import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkGithubBlockquoteAlerts from 'remark-github-blockquote-alert';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { h } from 'hastscript';
import { visit } from 'unist-util-visit';
import type { Root } from 'hast';
import { highlightCodeBlocks } from './syntax-highlight';
import { remarkImages } from './remark-images';
import { cleanApiTags, setCurrentVersion } from './api-links';
import { rewriteApiLinksInHtml } from './rewrite-api-links-html';
import { cleanHeaders, cleanWhitespace } from './clean-html';

/**
 * Custom sanitizer schema that allows api: protocol for links and className on elements
 */
const sanitizerSchema = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema.attributes || {}),
    '*': [
      ...(defaultSchema.attributes?.['*'] || []),
      'className',
      'data-code',
      'data-language',
      'aria-label',
      'viewBox',
      'width',
      'height',
      'aria-hidden',
      'fill',
    ],
    button: [
      ...(defaultSchema.attributes?.button || []),
      'type',
      'className',
      'data-code',
      'aria-label',
    ],
    blockquote: [
      ...(defaultSchema.attributes?.blockquote || []),
      'className',
    ],
    svg: [
      'className',
      'viewBox',
      'width',
      'height',
      'aria-hidden',
      'fill',
    ],
    path: [
      'd',
      'fill',
    ],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'button',
    'svg',
    'path',
  ],
  protocols: {
    ...(defaultSchema.protocols || {}),
    href: [...(defaultSchema.protocols?.href || []), 'api']
  }
};

/**
 * Configure heading anchor links with icon positioning
 */
const autolinkConfig = {
  behavior: 'append' as const,
  properties: {
    className: 'heading-anchor',
    ariaLabel: 'Permalink to this section',
    title: 'Permalink to this section'
  },
  content: [h('span', '#')]
};

/**
 * Convert markdown content to HTML using remark/rehype pipeline
 * Supports GitHub Flavored Markdown and raw HTML
 * Optionally resolves relative image paths
 */
export async function markdownToHtml(content: string, filePath?: string, version?: string): Promise<string> {
  // Pre-process markdown to convert shorthand API links to markdown link syntax
  let processedContent = cleanApiTags(content);

  // Set the current version for API link rewriting
  if (version) {
    setCurrentVersion(version);
  }

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithubBlockquoteAlerts)
    .use(remarkImages, { currentFilePath: filePath })
    .use(remarkRehype, { allowDangerousHtml: true, clobberPrefix: '' })
    .use(rehypeRaw)
    .use(highlightCodeBlocks)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, autolinkConfig)
    .use(rehypeSanitize, sanitizerSchema)
    .use(rehypeStringify);

  const file = await processor.process(processedContent);
  let html = String(file);

  // Post-process to rewrite API links in HTML
  if (version) {
    html = rewriteApiLinksInHtml(html, version);
  }

  return html;
}

/**
 * Process markdown for headings with IDs and cleanup
 */
export async function markdownToHtmlWithCleanup(content: string, filePath?: string, version?: string): Promise<string> {
  let html = await markdownToHtml(content, filePath, version);
  html = cleanHeaders(html);
  html = removeUserContentPrefix(html);
  html = cleanWhitespace(html);
  return html;
}

/**
 * Removes the 'user-content-' prefix from heading IDs
 * This prefix is added by remark-rehype for footnote collision prevention
 * but we want clean IDs on headings
 */
function removeUserContentPrefix(html: string): string {
  return html.replace(/id="user-content-([^"]+)"/g, 'id="$1"');
}


