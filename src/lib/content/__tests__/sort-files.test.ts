import { DocumentNode } from '@/types';
import { sortDocuments } from '../sort-files';

describe('sort-files', () => {
  const mockDoc = (
    fileTitle: string,
    fileAbsolutePath: string,
    order?: number,
  ): DocumentNode => ({
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
    ...(order !== undefined && { order }),
  });

  describe('sortDocuments', () => {
    it('sorts by order property when available', () => {
      const docs = [
        mockDoc('Composer', '/docs/02_Composer.md', 2),
        mockDoc('Installation', '/docs/01_Installation.md', 1),
        mockDoc('Advanced Installation', '/docs/05_Advanced_Installation/index.md', 5),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].fileTitle).toBe('Installation');
      expect(sorted[0].order).toBe(1);
      expect(sorted[1].fileTitle).toBe('Composer');
      expect(sorted[1].order).toBe(2);
      expect(sorted[2].fileTitle).toBe('Advanced Installation');
      expect(sorted[2].order).toBe(5);
    });

    it('sorts alphabetically when no order property', () => {
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

    it('prioritizes documents with order over those without', () => {
      const docs = [
        mockDoc('zebra', '/docs/zebra.md'),
        mockDoc('Installation', '/docs/01_Installation.md', 1),
        mockDoc('alpha', '/docs/alpha.md'),
      ];

      const sorted = sortDocuments(docs);

      // Document with order should come first
      expect(sorted[0].fileTitle).toBe('Installation');
      expect(sorted[0].order).toBe(1);
      // Then alphabetically sorted remaining
      expect(sorted[1].fileTitle).toBe('alpha');
      expect(sorted[2].fileTitle).toBe('zebra');
    });

    it('handles mixed order values within same directory', () => {
      const docs = [
        mockDoc('05_Advanced', '/docs/same/05_Advanced.md', 5),
        mockDoc('01_First', '/docs/same/01_First.md', 1),
        mockDoc('03_Third', '/docs/same/03_Third.md', 3),
        mockDoc('02_Second', '/docs/same/02_Second.md', 2),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].order).toBe(1);
      expect(sorted[1].order).toBe(2);
      expect(sorted[2].order).toBe(3);
      expect(sorted[3].order).toBe(5);
    });

    it('preserves different directory structure', () => {
      const docs = [
        mockDoc('file', '/docs/dir1/file.md', 1),
        mockDoc('file', '/docs/dir2/file.md', 1),
        mockDoc('file', '/docs/dir3/file.md', 1),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].fileAbsolutePath).toBe('/docs/dir1/file.md');
      expect(sorted[1].fileAbsolutePath).toBe('/docs/dir2/file.md');
      expect(sorted[2].fileAbsolutePath).toBe('/docs/dir3/file.md');
    });

    it('handles semantic version numbers without order', () => {
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

    it('does not modify original array', () => {
      const docs = [
        mockDoc('zebra', '/docs/zebra.md'),
        mockDoc('alpha', '/docs/alpha.md'),
      ];

      sortDocuments(docs);

      // Original should be unchanged
      expect(docs[0].fileTitle).toBe('zebra');
      expect(docs[1].fileTitle).toBe('alpha');
    });

    it('sorts children correctly with order property', () => {
      const docs = [
        mockDoc('Getting Started', '/docs/01_Getting_Started/index.md', 1),
        mockDoc('Developer Guides', '/docs/02_developer_guides/index.md', 2),
        mockDoc('Optional Features', '/docs/optional_features/index.md'),
      ];

      const sorted = sortDocuments(docs);

      expect(sorted[0].order).toBe(1);
      expect(sorted[1].order).toBe(2);
      expect(sorted[2].order).toBeUndefined();
    });
  });
});
