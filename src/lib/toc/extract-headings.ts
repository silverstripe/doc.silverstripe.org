/**
 * Extract headings from markdown content for table of contents
 *
 * This module handles filtering headings that should not appear in the TOC:
 * - Headings inside <details> blocks (accordion/expander sections)
 * - Examples: changelog accordions, API change lists
 *
 * Markdown patterns that wrap accordion content:
 * - <details>...</details> blocks (HTML accordion elements)
 */

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Regex to match markdown headings (## to ###)
 * We skip H1 as it's typically the page title
 * We only include H2 and H3 in the table of contents
 */
const HEADING_REGEX = /^(#{2,3})\s+(.+?)(?:\s*\{#([^}]+)\})?\s*$/gm;

/**
 * Helper to determine if a position in the markdown is inside a <details> block
 * Tracks all <details> opening and closing tags up to the given position
 */
function stripCodeFromMarkdown(markdown: string): string {
  const lines = markdown.split('\n');
  let inFence = false;
  let fenceMarker = '';

  return lines
    .map((line) => {
      const fenceMatch = line.match(/^\s*(```+|~~~+)/);

      if (fenceMatch) {
        const marker = fenceMatch[1];

        if (!inFence) {
          inFence = true;
          fenceMarker = marker;
          return '';
        }

        if (marker[0] === fenceMarker[0] && marker.length >= fenceMarker.length) {
          inFence = false;
          fenceMarker = '';
          return '';
        }
      }

      if (inFence) {
        return '';
      }

      return line.replace(/`[^`]*`/g, '');
    })
    .join('\n');
}

function isInsideDetailsBlock(markdown: string, position: number): boolean {
  const textBeforePosition = stripCodeFromMarkdown(markdown.slice(0, position));
  let depth = 0;

  // Match opening <details> tags (case-insensitive, optional attributes)
  const openPattern = /<details(?:\s[^>]*)?\s*>/gi;
  // Match closing </details> tags (case-insensitive)
  const closePattern = /<\/details\s*>/gi;

  const tags: Array<{ pos: number; isOpen: boolean }> = [];

  // Find all opening tags
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = openPattern.exec(textBeforePosition)) !== null) {
    tags.push({ pos: match.index, isOpen: true });
  }

  // Find all closing tags
  // eslint-disable-next-line no-cond-assign
  while ((match = closePattern.exec(textBeforePosition)) !== null) {
    tags.push({ pos: match.index, isOpen: false });
  }

  // Sort by position to process in order
  tags.sort((a, b) => a.pos - b.pos);

  // Process tags to determine depth
  for (const tag of tags) {
    if (tag.isOpen) {
      depth += 1;
    } else {
      depth = Math.max(0, depth - 1);
    }
  }

  return depth > 0;
}

/**
 * Generate a URL-safe slug from text
 * Matches the behavior of github-slugger/rehype-slug
 */
function slugify(text: string, usedSlugs: Set<string>): string {
  let slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

  // Handle empty slugs
  if (!slug) {
    slug = 'heading';
  }

  // Ensure uniqueness
  let finalSlug = slug;
  let counter = 1;
  while (usedSlugs.has(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter += 1;
  }
  usedSlugs.add(finalSlug);

  return finalSlug;
}

/**
 * Extract headings from markdown content
 * Returns heading text, level, and generated/custom ID
 * Only includes H2 and H3 headings in the table of contents
 * Filters out headings inside <details> blocks (accordions)
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const usedSlugs = new Set<string>();

  // eslint-disable-next-line no-cond-assign
  for (let match; (match = HEADING_REGEX.exec(markdown)) !== null;) {
    const [, hashes, rawText, customId] = match;
    const level = hashes.length;

    // Clean the text: remove inline code backticks, bold, italic markers
    // Process backticks first to extract code content
    let text = rawText.replace(/`([^`]+)`/g, '$1');

    // Remove bold markers (** and __)
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    text = text.replace(/__([^_]+)__/g, '$1');

    // Remove italic markers (* and _), but only when not part of identifiers
    // Match * surrounded by non-asterisk chars (works for markdown italic)
    text = text.replace(/\*([^*]+)\*/g, '$1');
    // For underscores: only match when surrounded by whitespace or punctuation
    text = text.replace(/(^|[\s\p{P}])_([^_]+)_([\s\p{P}]|$)/gu, '$1$2$3');

    text = text.trim();

    // Use custom ID if provided, otherwise generate from text
    const id = customId || slugify(text, usedSlugs);

    // Skip headings inside <details> blocks (accordions)
    if (match.index !== undefined && isInsideDetailsBlock(markdown, match.index)) {
      // Slug is already tracked by slugify call above, but heading not added to TOC
      continue;
    }

    // Only include H2 and H3 in TOC
    if (level <= 3) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}
