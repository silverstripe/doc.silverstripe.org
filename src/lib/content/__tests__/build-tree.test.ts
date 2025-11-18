import { buildContentTree } from '../build-tree';
import path from 'path';

const fixturesDir = path.join(process.cwd(), 'tests/fixtures/mock-content/v6');

describe('build-tree', () => {
  describe('buildContentTree', () => {
    it('builds tree from mock content directory', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      expect(docs.length).toBeGreaterThan(0);
      expect(Array.isArray(docs)).toBe(true);
    });

    it('parses frontmatter into documents', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      const indexDoc = docs.find((d) => d.isIndex && d.slug === '/en/6/');
      expect(indexDoc).toBeDefined();
      expect(indexDoc?.title).toBeDefined();
      expect(indexDoc?.content).toBeDefined();
    });

    it('generates correct slugs', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      const slugs = docs.map((d) => d.slug);
      expect(slugs.every((s) => s.startsWith('/en/6/'))).toBe(true);
      expect(slugs.every((s) => s.endsWith('/'))).toBe(true);
    });

    it('identifies index files', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      const indexFiles = docs.filter((d) => d.isIndex);
      expect(indexFiles.length).toBeGreaterThan(0);
    });

    it('sets category correctly', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      expect(docs.every((d) => d.category === 'docs')).toBe(true);
    });

    it('preserves frontmatter data', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      const indexDoc = docs.find((d) => d.isIndex && d.slug === '/en/6/');
      expect(indexDoc?.title).toBe('Silverstripe CMS Documentation');
      expect(indexDoc?.summary).toBe('Welcome to Silverstripe CMS documentation');
      expect(indexDoc?.icon).toBe('home');
    });

    it('generates parent slugs', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      const nested = docs.find((d) => d.slug.includes('getting_started/installation'));
      expect(nested).toBeDefined();
      if (nested) {
        expect(nested.parentSlug).toBeDefined();
        expect(nested.parentSlug).toContain('/en/6/');
      }
    });

    it('handles deeply nested structure', async () => {
      // Load optional_features separately with the optional parameter
      const optionalPath = path.join(fixturesDir, 'optional_features');
      const docs = await buildContentTree(optionalPath, 'v6', 'docs', 'optional_features');

      // Check for deeply nested optional_features/linkfield files
      const deepNested = docs.filter((d) =>
        d.slug.includes('optional_features')
      );
      expect(deepNested.length).toBeGreaterThan(0);
    });

    it('converts numeric prefixes in file titles', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      const doc = docs.find((d) => d.slug.includes('getting_started'));
      expect(doc?.fileTitle).not.toMatch(/^\d+_/);
    });

    it('sorts documents consistently', async () => {
      const docs1 = await buildContentTree(fixturesDir, 'v6', 'docs');
      const docs2 = await buildContentTree(fixturesDir, 'v6', 'docs');

      expect(docs1.map((d) => d.slug)).toEqual(docs2.map((d) => d.slug));
    });

    it('sets correct file paths', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      const doc = docs.find((d) => d.isIndex && d.slug === '/en/6/');
      expect(doc?.filePath).toBe('index.md');
    });

    it('handles optional parameter for thirdparty modules', async () => {
      // This would be for optional_features or similar
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs', 'optional_features');

      expect(docs.length).toBeGreaterThan(0);
      // All docs should include the optional parameter in category or handling
    });

    it('throws on non-existent directory', async () => {
      const nonExistent = path.join(fixturesDir, 'non-existent');
      await expect(buildContentTree(nonExistent, 'v6', 'docs')).rejects.toThrow();
    });

    it('includes content from parsed markdown', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      const doc = docs.find((d) => d.isIndex && d.slug === '/en/6/');
      expect(doc?.content).toContain('Silverstripe is an open-source');
    });

    it('case-insensitive slug generation', async () => {
      const docs = await buildContentTree(fixturesDir, 'v6', 'docs');

      const allLowercase = docs.every((d) =>
        d.slug === d.slug.toLowerCase()
      );
      expect(allLowercase).toBe(true);
    });
  });
});
