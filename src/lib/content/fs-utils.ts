import fs from 'fs/promises';
import path from 'path';

export interface PathInfo {
  filename: string;
  directory: string;
  extension: string;
  isIndex: boolean;
}

export interface RawDocument {
  content: string;
  path: string;
  pathInfo: PathInfo;
}

/**
 * Read a markdown file and return its raw content
 */
export async function readMarkdownFile(filePath: string): Promise<RawDocument> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const pathInfo = parseFilePath(filePath);
    return {
      content,
      path: filePath,
      pathInfo,
    };
  } catch (error) {
    throw new Error(`Failed to read markdown file at ${filePath}: ${error}`);
  }
}

/**
 * List all markdown files in a directory recursively
 * Optionally exclude specific directory names
 */
export async function listMarkdownFiles(dir: string, excludeDirs?: string[]): Promise<string[]> {
  const files: string[] = [];

  async function traverse(currentPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          // Skip excluded directories
          if (excludeDirs && excludeDirs.includes(entry.name)) {
            continue;
          }
          await traverse(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      throw new Error(`Failed to list files in ${currentPath}: ${error}`);
    }
  }

  await traverse(dir);
  return files;
}

/**
 * Parse a file path into components
 */
export function parseFilePath(filePath: string): PathInfo {
  const filename = path.basename(filePath, '.md');
  const directory = path.dirname(filePath);
  const isIndex = filename === 'index';

  return {
    filename,
    directory,
    extension: '.md',
    isIndex,
  };
}
