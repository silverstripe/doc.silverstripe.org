import { escapeHtml } from '@/lib/utils/html-utils';
import type { TocHeading } from './extract-headings';

/**
 * Generate HTML for table of contents
 * This allows the TOC to be included in the initial HTML render, avoiding FOUT
 */
export function generateTocHtml(headings: TocHeading[]): string {
  if (headings.length === 0) {
    return '';
  }

  const listItems = headings
    .map((heading) => {
      const escapedText = escapeHtml(heading.text);
      const escapedId = escapeHtml(heading.id);
      return `<li class="toc-item" data-level="${heading.level}"><a href="#${escapedId}" class="toc-link">${escapedText}</a></li>`;
    })
    .join('');

  return (
    `<nav class="toc" aria-label="Table of contents">
      <h2 class="toc-title">On this page</h2>
      <ul class="toc-list">${listItems}</ul>
    </nav>`
  );
}

/**
 * Insert TOC HTML after the first H1 element in the content
 */
export function insertTocAfterH1(htmlContent: string, tocHtml: string): string {
  if (!tocHtml) {
    return htmlContent;
  }

  // Match the closing </h1> tag (case insensitive, with possible attributes)
  const h1ClosePattern = /<\/h1>/i;
  const match = htmlContent.match(h1ClosePattern);

  if (match && match.index !== undefined) {
    const insertPosition = match.index + match[0].length;
    return `${htmlContent.slice(0, insertPosition)}\n${tocHtml}${htmlContent.slice(insertPosition)}`;
  }

  // If no H1 found, prepend the TOC
  return `${tocHtml}${htmlContent}`;
}
