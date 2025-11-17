import { sortDocuments } from '../sort-files';
import { DocumentNode } from '@/types';

describe('sort-files', () => {
  const mockDoc = (fileTitle: string, fileAbsolutePath: string): DocumentNode => ({
    slug: '/en/6/test/',
    version: '6',
    filePath: fileTitle,
    fileTitle,
    fileAbsolutePath,
    isIndex: false,
    parentSlug: '/en/6/',
    title: fileTitle,
    content: '',
    category: 'docs',
  });

  describe('sortDocuments', () => {
    it('sorts numeric prefixes numerically', () => {
      const docs = [
        mockDoc('03_third', '/docs/03_third.md'),
        mockDoc('01_first', '/docs/01_first.md'),
        mockDoc('02_second', '/docs/02_second.md'),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].fileTitle).toBe('01_first');
      expect(sorted[1].fileTitle).toBe('02_second');
      expect(sorted[2].fileTitle).toBe('03_third');
    });

    it('sorts alphabetically when no numeric prefix', () => {
      const docs = [
        mockDoc('zebra', '/docs/zebra.md'),
        mockDoc('alpha', '/docs/alpha.md'),
        mockDoc('beta', '/docs/beta.md'),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].fileTitle).toBe('alpha');
      expect(sorted[1].fileTitle).toBe('beta');
      expect(sorted[2].fileTitle).toBe('zebra');
    });

    it('handles mixed numeric and non-numeric', () => {
      const docs = [
        mockDoc('zebra', '/docs/zebra.md'),
        mockDoc('01_first', '/docs/01_first.md'),
        mockDoc('alpha', '/docs/alpha.md'),
      ];

      const sorted = sortDocuments(docs);

      // Numeric files should sort first, then alphabetically
      expect(sorted[0].fileTitle).toBe('01_first');
      expect(sorted[1].fileTitle).toBe('alpha');
      expect(sorted[2].fileTitle).toBe('zebra');
    });

    it('preserves different directory structure', () => {
      const docs = [
        mockDoc('file', '/docs/dir1/file.md'),
        mockDoc('file', '/docs/dir2/file.md'),
        mockDoc('file', '/docs/dir3/file.md'),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].fileAbsolutePath).toBe('/docs/dir1/file.md');
      expect(sorted[1].fileAbsolutePath).toBe('/docs/dir2/file.md');
      expect(sorted[2].fileAbsolutePath).toBe('/docs/dir3/file.md');
    });

    it('handles semantic version numbers', () => {
      const docs = [
        mockDoc('3.2.1', '/docs/3.2.1.md'),
        mockDoc('1.0.0', '/docs/1.0.0.md'),
        mockDoc('2.0.0', '/docs/2.0.0.md'),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].fileTitle).toBe('1.0.0');
      expect(sorted[1].fileTitle).toBe('2.0.0');
      expect(sorted[2].fileTitle).toBe('3.2.1');
    });

    it('handles version strings with prerelease', () => {
      const docs = [
        mockDoc('2.0.0-beta1', '/docs/2.0.0-beta1.md'),
        mockDoc('1.0.0', '/docs/1.0.0.md'),
        mockDoc('2.0.0-alpha1', '/docs/2.0.0-alpha1.md'),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].fileTitle).toBe('1.0.0');
      // Prerelease versions should sort after base version
      expect(sorted[1].fileTitle).toMatch(/2\.0\.0/);
    });

    it('does not modify original array', () => {
      const docs = [
        mockDoc('zebra', '/docs/zebra.md'),
        mockDoc('alpha', '/docs/alpha.md'),
      ];

      const original = [...docs];
      const sorted = sortDocuments(docs);

      // Original should be unchanged
      expect(docs[0].fileTitle).toBe('zebra');
      expect(docs[1].fileTitle).toBe('alpha');
    });

    it('sorts within same directory consistently', () => {
      const docs = [
        mockDoc('03_third', '/docs/same/03_third.md'),
        mockDoc('01_first', '/docs/same/01_first.md'),
        mockDoc('02_second', '/docs/same/02_second.md'),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].fileTitle).toBe('01_first');
      expect(sorted[1].fileTitle).toBe('02_second');
      expect(sorted[2].fileTitle).toBe('03_third');
    });
  });
});
