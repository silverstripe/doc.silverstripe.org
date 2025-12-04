import path from 'path';
import { DocumentNode } from '@/types/types';
import { readMarkdownFile, listMarkdownFiles } from './fs-utils';
import { parseFrontmatter } from './frontmatter';
import { fileToTitle } from './file-to-title';
import { generateSlug } from './slug-generator';
import { sortDocuments } from './sort-files';

/**
 * Extract numeric order from a filename or directory name
 * e.g., "01_Installation" -> 1, "02_Advanced" -> 2, "Getting_Started" -> undefined
 */
function extractOrderFromName(name: string): number | undefined {
  const match = name.match(/^(\d+)_/);
  return match ? Number(match[1]) : undefined;
}

/**
 * Build a tree of document nodes from a directory
 * Recursively reads markdown files, parses frontmatter, generates slugs
 */
export async function buildContentTree(
  basePath: string,
  version: string,
  category: 'docs' | 'user' = 'docs',
  optional?: string,
  rootParentSlug?: string,
): Promise<DocumentNode[]> {
  try {
    // Get all markdown files, excluding optional_features directories when loading main content
    // For docs context: exclude 03_Optional_features (deprecated) and optional_features
    // (loaded separately)
    // For user context: only exclude optional_features (03_Optional_features contains the
    // valid section index)
    let excludeDirs: string[] | undefined;
    if (!optional) {
      // When loading main content (not optional features)
      excludeDirs = category === 'user'
        ? ['optional_features'] // User: keep 03_Optional_features, exclude optional_features
        : ['03_Optional_features', 'optional_features']; // Docs: exclude both
    }
    const files = await listMarkdownFiles(basePath, excludeDirs);

    if (files.length === 0) {
      return [];
    }

    // Sort files for consistent ordering
    files.sort();

    // Parse each file
    const documents: DocumentNode[] = [];

    for (const filePath of files) {
      const raw = await readMarkdownFile(filePath);
      const { data: frontmatter, content } = parseFrontmatter(raw.content);

      // Get relative path from base
      const relativePath = path.relative(basePath, filePath);
      const relativeDir = path.dirname(relativePath);

      // Determine if index file
      const { isIndex } = raw.pathInfo;

      // Generate file title
      const parentDir = path.dirname(filePath);
      const fileTitle = fileToTitle(raw.pathInfo.filename, isIndex ? parentDir : undefined);

      // Extract order from directory or filename
      let order: number | undefined;
      if (isIndex) {
        // For index files, extract from directory name
        const dirName = path.basename(path.dirname(filePath));
        order = extractOrderFromName(dirName);
      } else {
        // For regular files, extract from filename
        order = extractOrderFromName(raw.pathInfo.filename);
      }

      // Build path for slug - include filename segment unless it's an index file in root
      let slugPath = relativeDir;
      if (!isIndex) {
        // Include the filename without extension in the slug
        slugPath = path.join(relativeDir, raw.pathInfo.filename).replace(/\\/g, '/');
      } else if (relativeDir === '.') {
        // Index file at root - empty slug path
        slugPath = '';
      }

      // Generate slug
      const slug = generateSlug(slugPath === '.' ? '' : slugPath, version, optional);

      // Generate parent slug (directory of current slug path)
      // For index files, the parent is the parent directory of the current directory
      // For regular files, the parent is the current directory
      let parentPath = relativeDir === '.' ? '' : relativeDir;
      if (isIndex && relativeDir !== '.') {
        // For index files, get the parent directory
        parentPath = path.dirname(relativeDir);
        if (parentPath === '.') {
          parentPath = '';
        }
      }

      // If rootParentSlug is provided and this is the root index, use it
      let parentSlug: string;
      if (rootParentSlug && isIndex && relativeDir === '.') {
        parentSlug = rootParentSlug;
      } else {
        parentSlug = generateSlug(parentPath, version, optional);
      }

      // Get frontmatter title or use file-derived title
      const title = frontmatter.title || fileTitle;

      const doc: DocumentNode = {
        slug,
        version,
        filePath: relativePath,
        fileTitle,
        fileAbsolutePath: filePath,
        isIndex,
        parentSlug,
        title,
        content,
        category,
        ...(order !== undefined && { order }),
        ...frontmatter,
      };

      documents.push(doc);
    }

    // Sort documents
    return sortDocuments(documents);
  } catch (error) {
    throw new Error(`Failed to build content tree: ${error}`);
  }
}
