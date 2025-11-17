import path from 'path';
import { DocumentNode } from '@/types';
import { readMarkdownFile, listMarkdownFiles } from './fs-utils';
import { parseFrontmatter } from './frontmatter';
import { fileToTitle } from './file-to-title';
import { generateSlug } from './slug-generator';
import { sortDocuments } from './sort-files';

/**
 * Build a tree of document nodes from a directory
 * Recursively reads markdown files, parses frontmatter, generates slugs
 */
export async function buildContentTree(
  basePath: string,
  version: string,
  category: 'docs' | 'user' = 'docs',
  optional?: string
): Promise<DocumentNode[]> {
  try {
    // Get all markdown files
    const files = await listMarkdownFiles(basePath);

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
      const isIndex = raw.pathInfo.isIndex;

      // Generate file title
      const parentDir = path.dirname(filePath);
      const fileTitle = fileToTitle(raw.pathInfo.filename, isIndex ? parentDir : undefined);

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
      const parentPath = relativeDir === '.' ? '' : relativeDir;
      const parentSlug = generateSlug(parentPath, version, optional);

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
