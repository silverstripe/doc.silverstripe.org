/**
 * Strip hardcoded table of contents from changelog markdown
 * Changelog pages should only display auto-generated TOC
 */

/**
 * Detect if a slug is a changelog page
 * Changelog slugs contain '/changelogs/' and end with a version number pattern
 * Examples: /en/6/changelogs/ (index) or /en/6/changelogs/6-1-0/ (page)
 */
function isChangelogPage(slug: string): boolean {
  // Must contain /changelogs/
  if (!slug.includes('/changelogs/')) {
    return false;
  }

  // Exclude changelog index - check if slug ends with version pattern
  // (e.g., /changelogs/6-1-0/)
  // Changelog index is /en/{version}/changelogs/ so after split and filter,
  // last part is empty or 'changelogs'
  const parts = slug.split('/').filter(Boolean);

  // If last part is 'changelogs' or empty, it's the index
  if (parts.length === 0 || parts[parts.length - 1] === 'changelogs') {
    return false;
  }

  return true;
}

/**
 * Strip hardcoded TOC links from changelog markdown
 * Removes the "Overview" section which contains the TOC
 * Real changelogs: ## Overview ... </details>
 * Mock changelogs: simple - [Link](#anchor) format
 */
export function stripChangelogToc(markdown: string, slug: string): string {
  // Only process changelog pages
  if (!isChangelogPage(slug)) {
    return markdown;
  }

  const lines = markdown.split('\n');

  // Find "## Overview" section - this is the TOC section in real changelogs
  const overviewIndex = lines.findIndex((line) => line.trim() === '## Overview');

  if (overviewIndex === -1) {
    // No Overview section, check for simple TOC pattern
    return stripSimpleChangelogToc(lines);
  }

  // Find </details> tag that closes the Overview section
  const detailsEndIndex = lines.findIndex(
    (line, index) => index > overviewIndex && line.includes('</details>'),
  );

  if (detailsEndIndex === -1) {
    // No closing </details>, might be a different format
    return stripSimpleChangelogToc(lines);
  }

  // Remove lines from Overview to </details>
  const result = [...lines.slice(0, overviewIndex), ...lines.slice(detailsEndIndex + 1)]
    .join('\n')
    .replace(/\n\n\n+/g, '\n\n') // Clean up multiple blank lines
    .trim();

  return result;
}

/**
 * Strip simple TOC format: just - [Link](#anchor) entries before first H2
 */
function stripSimpleChangelogToc(lines: string[]): string {
  // Find the first H2 heading
  const h2Index = lines.findIndex((line) => line.startsWith('## '));

  if (h2Index === -1) {
    // No H2 found, return original
    return lines.join('\n');
  }

  // Find where frontmatter ends
  let frontmatterEnd = 0;
  if (lines[0]?.trim() === '---') {
    // Find the closing ---
    for (let i = 1; i < lines.length; i += 1) {
      if (lines[i]?.trim() === '---') {
        frontmatterEnd = i + 1;
        break;
      }
    }
  }

  // Check if everything from frontmatter end to first H2 is just TOC links and whitespace
  let hasOnlyTocContent = true;
  const tocLinesToRemove: number[] = [];

  for (let i = frontmatterEnd; i < h2Index; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      continue;
    }

    // Skip H1 heading
    if (trimmed.startsWith('# ')) {
      continue;
    }

    // Check if line is a TOC link: starts with "- [" or "* [" and contains ](#
    if ((trimmed.startsWith('- [') || trimmed.startsWith('* [')) && trimmed.includes('](#')) {
      tocLinesToRemove.push(i);
      continue;
    }

    // If we found any other content (non-TOC, non-whitespace), don't strip
    hasOnlyTocContent = false;
    break;
  }

  // If everything before H2 is TOC links, remove them
  if (hasOnlyTocContent && tocLinesToRemove.length > 0) {
    const result = lines
      .map((line, index) => {
        // If this line is a TOC link, return empty string to be filtered
        if (tocLinesToRemove.includes(index)) {
          return '';
        }
        return line;
      })
      .join('\n')
      .replace(/\n\n\n+/g, '\n\n') // Clean up multiple blank lines
      .replace(/\n\n+$/, '\n'); // Remove trailing blank lines before next section

    return result.trim();
  }

  return lines.join('\n');
}
