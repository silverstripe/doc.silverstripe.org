import { readMarkdownFile, listMarkdownFiles, parseFilePath } from '../fs-utils';
import path from 'path';

const fixturesDir = path.join(process.cwd(), 'tests/fixtures/mock-content/v6');

describe('fs-utils', () => {
  describe('parseFilePath', () => {
    it('parses filename from path', () => {
      const result = parseFilePath('/path/to/01_Getting_Started.md');
      expect(result.filename).toBe('01_Getting_Started');
      expect(result.isIndex).toBe(false);
    });

    it('identifies index files', () => {
      const result = parseFilePath('/path/to/index.md');
      expect(result.filename).toBe('index');
      expect(result.isIndex).toBe(true);
    });

    it('extracts directory', () => {
      const result = parseFilePath('/path/to/dir/file.md');
      expect(result.directory).toBe('/path/to/dir');
    });

    it('sets extension correctly', () => {
      const result = parseFilePath('/path/to/file.md');
      expect(result.extension).toBe('.md');
    });
  });

  describe('readMarkdownFile', () => {
    it('reads markdown file content', async () => {
      const filePath = path.join(fixturesDir, 'index.md');
      const result = await readMarkdownFile(filePath);

      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.path).toBe(filePath);
    });

    it('includes pathInfo in result', async () => {
      const filePath = path.join(fixturesDir, 'index.md');
      const result = await readMarkdownFile(filePath);

      expect(result.pathInfo).toBeDefined();
      expect(result.pathInfo.isIndex).toBe(true);
    });

    it('throws on non-existent file', async () => {
      const nonExistent = path.join(fixturesDir, 'non-existent-file.md');
      await expect(readMarkdownFile(nonExistent)).rejects.toThrow();
    });
  });

  describe('listMarkdownFiles', () => {
    it('lists all markdown files recursively', async () => {
      const files = await listMarkdownFiles(fixturesDir);

      expect(files.length).toBeGreaterThan(0);
      expect(files.every((f) => f.endsWith('.md'))).toBe(true);
    });

    it('includes nested markdown files', async () => {
      const files = await listMarkdownFiles(fixturesDir);

      const hasNested = files.some((f) => f.includes('optional_features'));
      expect(hasNested).toBe(true);
    });

    it('excludes non-markdown files', async () => {
      const files = await listMarkdownFiles(fixturesDir);

      expect(files.every((f) => f.endsWith('.md'))).toBe(true);
      expect(files.some((f) => f.endsWith('.txt'))).toBe(false);
    });

    it('throws on non-existent directory', async () => {
      const nonExistent = path.join(fixturesDir, 'non-existent-dir');
      await expect(listMarkdownFiles(nonExistent)).rejects.toThrow();
    });
  });
});
