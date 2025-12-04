/**
 * Extract headings from markdown content for table of contents
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
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const usedSlugs = new Set<string>();

  // eslint-disable-next-line no-cond-assign
  for (let match; (match = HEADING_REGEX.exec(markdown)) !== null;) {
    const [, hashes, rawText, customId] = match;
    const level = hashes.length;

    // Clean the text: remove inline code backticks, bold, italic markers
    const text = rawText
      .replace(/`([^`]+)`/g, '$1') // inline code
      .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
      .replace(/\*([^*]+)\*/g, '$1') // italic
      .replace(/__([^_]+)__/g, '$1') // bold with underscores
      .replace(/_([^_]+)_/g, '$1') // italic with underscores
      .trim();

    // Use custom ID if provided, otherwise generate from text
    const id = customId || slugify(text, usedSlugs);

    // Only include H2 and H3 in TOC
    if (level <= 3) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}
