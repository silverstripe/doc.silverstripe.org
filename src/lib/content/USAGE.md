/**
 * PHASE 3: Content Processing Core - API Usage Guide
 *
 * The content processing module provides a complete data layer for transforming
 * markdown files into a usable content tree for Next.js rendering.
 */

// ============================================================================
// BASIC USAGE
// ============================================================================

import { buildContentTree, sortDocuments, fileToTitle, generateSlug } from '@/lib/content';

// Build a content tree from markdown files
const contentTree = await buildContentTree(
  './tests/fixtures/mock-content/v6',  // Base directory
  'v6',                                  // Version
  'docs',                                // Category: 'docs' or 'user'
  'optional_features'                    // Optional: third-party module name
);

// contentTree is now an array of DocumentNode objects:
// - DocumentNode {
//     slug: string                  // URL path: /en/6/section/page/
//     version: string               // Version: 6
//     filePath: string              // Relative path: section/page.md
//     fileTitle: string             // Derived from filename
//     fileAbsolutePath: string      // Full system path
//     isIndex: boolean              // true for index.md files
//     parentSlug: string            // Parent URL path
//     title: string                 // From frontmatter or fileTitle
//     content: string               // Parsed markdown content
//     category: 'docs' | 'user'     // Content category
//     summary?: string              // From frontmatter
//     icon?: string                 // From frontmatter
//     iconBrand?: string            // From frontmatter
//     hideChildren?: boolean        // From frontmatter
//     hideSelf?: boolean            // From frontmatter
//     unhideSelf?: boolean          // From frontmatter
//     introduction?: string         // From frontmatter
//   }

// ============================================================================
// INDIVIDUAL UTILITIES
// ============================================================================

import {
  readMarkdownFile,
  listMarkdownFiles,
  parseFilePath,
  parseFrontmatter,
  validateFrontmatter,
  fileToTitle,
  generateSlug,
  generateSlugFromFullPath,
  sortDocuments,
} from '@/lib/content';

// File system utilities
const markdownFiles = await listMarkdownFiles('./content');
const { content, path, pathInfo } = await readMarkdownFile('./content/index.md');
const { filename, directory, extension, isIndex } = parseFilePath('/path/to/01_Getting_Started.md');

// Frontmatter parsing
const markdownContent = `---
title: "Page Title"
summary: "Page summary"
icon: "file"
---

# Content here`;

const { data: frontmatter, content: markdownOnly } = parseFrontmatter(markdownContent);
const validated = validateFrontmatter({ title: 'Test', custom: 'value' });

// Title conversion
const title1 = fileToTitle('01_getting_started');              // "Getting Started"
const title2 = fileToTitle('index', '/path/to/01_Advanced');  // "Advanced"
const title3 = fileToTitle('model_data_types');               // "Model Data Types"

// Slug generation
const slug1 = generateSlug('01_getting_started/02_installation', 'v6');
// Result: /en/6/getting-started/installation/

const slug2 = generateSlug('optional_features/linkfield', 'v6', 'optional_features');
// Result: /en/6/optional-features/linkfield/

// Document sorting
const unsorted = [
  { fileTitle: '03_third', fileAbsolutePath: '/docs/03_third.md' },
  { fileTitle: '01_first', fileAbsolutePath: '/docs/01_first.md' },
  { fileTitle: '02_second', fileAbsolutePath: '/docs/02_second.md' },
];
const sorted = sortDocuments(unsorted as any);
// Now sorted by numeric prefix: 01_first, 02_second, 03_third

// ============================================================================
// MARKDOWN FRONTMATTER FORMAT
// ============================================================================

// Supported frontmatter fields:

/**
---
title: "Page Title"                 # String, optional
summary: "Brief description"        # String, optional
introduction: "Longer intro text"   # String, optional
icon: "file-alt"                    # String, optional (FontAwesome icon name)
iconBrand: "silverstripe"           # String, optional (FontAwesome brand icon)
hideChildren: false                 # Boolean, optional (hide sub-pages)
hideSelf: false                     # Boolean, optional (hide this page)
unhideSelf: false                   # Boolean, optional (force show)
order: 10                           # Number, optional (sort order)
---

# Markdown content starts here
*/

// ============================================================================
// DIRECTORY STRUCTURE CONVENTIONS
// ============================================================================

/*
content/v6/
  index.md                          # Root page: /en/6/
  01_Getting_Started/
    index.md                        # /en/6/getting-started/
    01_Installation.md              # /en/6/getting-started/installation/
    02_Composer.md                  # /en/6/getting-started/composer/
    02_Advanced_Installation/
      index.md                      # /en/6/getting-started/advanced-installation/
      01_Docker.md                  # /en/6/getting-started/advanced-installation/docker/
  02_Developer_Guides/
    index.md                        # /en/6/developer-guides/
    01_Model/
      index.md                      # /en/6/developer-guides/model/
      01_data_types.md              # /en/6/developer-guides/model/data-types/
      02_Relations.md               # /en/6/developer-guides/model/relations/

Naming conventions:
- Directories/files can have numeric prefix (01_, 02_, etc.) for sorting
- Prefixes are stripped from URLs and titles
- index.md files become directory URLs (/en/v/section/)
- Other .md files become individual URLs (/en/v/section/page/)
- Underscores in names become hyphens in URLs
- Titles are Title Cased
*/

// ============================================================================
// ERROR HANDLING
// ============================================================================

try {
  const docs = await buildContentTree('./non-existent-path', 'v6', 'docs');
} catch (error) {
  console.error('Failed to build content tree:', error.message);
}

// ============================================================================
// TYPE SAFETY
// ============================================================================

import type { DocumentNode, DocumentMeta, PathInfo, RawDocument } from '@/lib/content';

// All functions are fully typed with TypeScript strict mode
// No 'any' types used anywhere in the module
