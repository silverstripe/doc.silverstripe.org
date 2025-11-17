import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Root } from 'hast';
import { highlightCodeBlocks } from './syntax-highlight';
import { remarkImages } from './remark-images';

/**
 * Convert markdown content to HTML using remark/rehype pipeline
 * Supports GitHub Flavored Markdown and raw HTML
 * Optionally resolves relative image paths
 */
export async function markdownToHtml(content: string, filePath?: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkImages, { currentFilePath: filePath })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(highlightCodeBlocks)
    .use(rehypeSanitize)
    .use(rehypeStringify);

  const file = await processor.process(content);
  return String(file);
}

/**
 * Process markdown for headings with IDs and cleanup
 */
export async function markdownToHtmlWithCleanup(content: string, filePath?: string): Promise<string> {
  let html = await markdownToHtml(content, filePath);
  html = cleanHeaders(html);
  html = cleanWhitespace(html);
  return html;
}

/**
 * Removes the <em> tags caused by underscores in the {#id_with_underscores}
 * Ported from Gatsby utils
 */
function cleanHeaders(html: string): string {
  return html.replace(
    /<h([0-9])>(.*?)(\{#.*?<\/?em>.*?})/g,
    (_, level, title, tag) => `<h${level}>${title} ${tag.replace(/<\/?em>/g, '_')}`
  );
}

/**
 * The react parser doesn't like whitespace nodes in tags that require
 * specific DOM node children.
 * Ported from Gatsby utils
 */
function cleanWhitespace(html: string): string {
  let cleanHtml = html;
  const rxp = /(\<\/?(?:table|tbody|thead|tfoot|tr|th|td)\>)\s+(\<\/?(?:table|tbody|thead|tfoot|tr|th|td)\>)/;
  while (rxp.test(cleanHtml)) {
    cleanHtml = cleanHtml.replace(rxp, (_, tag1, tag2) => `${tag1}${tag2}`);
  }
  return cleanHtml;
}
