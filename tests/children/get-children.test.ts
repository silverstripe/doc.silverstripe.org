import {
  getChildren,
  getSiblings,
  getChildrenFiltered,
  setAllDocuments,
  clearDocumentCache,
  FilterOptions,
} from '../../src/lib/children/get-children';
import { DocumentNode } from '@/types';

describe('Children utilities', () => {
  // Mock data setup
  const createDoc = (
    slug: string,
    title: string,
    isIndex: boolean,
    parentSlug: string
  ): DocumentNode => ({
    slug,
    version: '6',
    filePath: title,
    fileTitle: title,
    fileAbsolutePath: `/docs/${slug}.md`,
    isIndex,
    parentSlug,
    title,
    content: '',
    category: 'docs',
  });

  beforeEach(() => {
    clearDocumentCache();
  });

  describe('getChildren', () => {
    it('returns empty array for non-index documents', () => {
      const doc = createDoc('/en/6/page', 'page', false, '/en/6');
      setAllDocuments([doc]);

      const children = getChildren(doc);

      expect(children).toEqual([]);
    });

    it('returns direct children of index document', () => {
      const parent = createDoc('/en/6/section', 'section', true, '/en/6');
      const child1 = createDoc('/en/6/section/page1', 'Page 1', false, '/en/6/section');
      const child2 = createDoc('/en/6/section/page2', 'Page 2', false, '/en/6/section');

      setAllDocuments([parent, child1, child2]);

      const children = getChildren(parent);

      expect(children).toHaveLength(2);
      expect(children.map((c) => c.fileTitle)).toEqual(['Page 1', 'Page 2']);
    });

    it('excludes folder index pages by default', () => {
      const parent = createDoc('/en/6/section', 'section', true, '/en/6');
      const child1 = createDoc(
        '/en/6/section/folder',
        'folder',
        true,
        '/en/6/section'
      );
      const child2 = createDoc(
        '/en/6/section/page',
        'page',
        false,
        '/en/6/section'
      );

      setAllDocuments([parent, child1, child2]);

      const children = getChildren(parent, false);

      expect(children).toHaveLength(1);
      expect(children[0].fileTitle).toBe('page');
    });

    it('includes folder index pages when includeFolders=true', () => {
      const parent = createDoc('/en/6/section', 'section', true, '/en/6');
      const child1 = createDoc(
        '/en/6/section/folder',
        'folder',
        true,
        '/en/6/section'
      );
      const child2 = createDoc(
        '/en/6/section/page',
        'page',
        false,
        '/en/6/section'
      );

      setAllDocuments([parent, child1, child2]);

      const children = getChildren(parent, true);

      expect(children).toHaveLength(2);
    });

    it('sorts children correctly', () => {
      const parent = createDoc('/en/6/section', 'section', true, '/en/6');
      const child1 = createDoc('/en/6/section/03_third', 'third', false, '/en/6/section');
      const child2 = createDoc('/en/6/section/01_first', 'first', false, '/en/6/section');
      const child3 = createDoc('/en/6/section/02_second', 'second', false, '/en/6/section');

      setAllDocuments([parent, child1, child2, child3]);

      const children = getChildren(parent);

      expect(children.map((c) => c.fileTitle)).toEqual(['first', 'second', 'third']);
    });

    it('does not return grandchildren', () => {
      const parent = createDoc('/en/6/section', 'section', true, '/en/6');
      const child = createDoc('/en/6/section/subsection', 'subsection', true, '/en/6/section');
      const grandchild = createDoc(
        '/en/6/section/subsection/page',
        'page',
        false,
        '/en/6/section/subsection'
      );

      setAllDocuments([parent, child, grandchild]);

      const children = getChildren(parent, false);

      expect(children).toHaveLength(0);
    });

    it('returns folder as child but not its children', () => {
      const parent = createDoc('/en/6/section', 'section', true, '/en/6');
      const child = createDoc('/en/6/section/subsection', 'subsection', true, '/en/6/section');
      const grandchild = createDoc(
        '/en/6/section/subsection/page',
        'page',
        false,
        '/en/6/section/subsection'
      );

      setAllDocuments([parent, child, grandchild]);

      const children = getChildren(parent, true);

      expect(children).toHaveLength(1);
      expect(children[0].fileTitle).toBe('subsection');
    });
  });

  describe('getSiblings', () => {
    it('returns all siblings including self', () => {
      const parent = createDoc('/en/6/section', 'section', true, '/en/6');
      const page1 = createDoc('/en/6/section/page1', 'page1', false, '/en/6/section');
      const page2 = createDoc('/en/6/section/page2', 'page2', false, '/en/6/section');
      const page3 = createDoc('/en/6/section/page3', 'page3', false, '/en/6/section');

      setAllDocuments([parent, page1, page2, page3]);

      const siblings = getSiblings(page2);

      expect(siblings).toHaveLength(3);
      expect(siblings.map((s) => s.fileTitle)).toContain('page1');
      expect(siblings.map((s) => s.fileTitle)).toContain('page2');
      expect(siblings.map((s) => s.fileTitle)).toContain('page3');
    });

    it('sorts siblings correctly', () => {
      const parent = createDoc('/en/6/section', 'section', true, '/en/6');
      const page1 = createDoc('/en/6/section/03_third', 'third', false, '/en/6/section');
      const page2 = createDoc('/en/6/section/01_first', 'first', false, '/en/6/section');
      const page3 = createDoc('/en/6/section/02_second', 'second', false, '/en/6/section');

      setAllDocuments([parent, page1, page2, page3]);

      const siblings = getSiblings(page2);

      expect(siblings.map((s) => s.fileTitle)).toEqual(['first', 'second', 'third']);
    });
  });

  describe('getChildrenFiltered', () => {
    const setupDocs = () => {
      const parent = createDoc('/en/6', 'home', true, '/');
      const model = createDoc('/en/6/model', 'model', true, '/en/6');
      const modelChild1 = createDoc(
        '/en/6/model/page1',
        'page1',
        false,
        '/en/6/model'
      );
      const modelChild2 = createDoc(
        '/en/6/model/page2',
        'page2',
        false,
        '/en/6/model'
      );
      const controller = createDoc('/en/6/controller', 'controller', true, '/en/6');
      const controllerChild = createDoc(
        '/en/6/controller/page1',
        'page1',
        false,
        '/en/6/controller'
      );
      const views = createDoc('/en/6/views', 'views', false, '/en/6');
      const installation = createDoc(
        '/en/6/installation',
        'installation',
        false,
        '/en/6'
      );
      const composer = createDoc('/en/6/composer', 'composer', false, '/en/6');

      setAllDocuments([
        parent,
        model,
        modelChild1,
        modelChild2,
        controller,
        controllerChild,
        views,
        installation,
        composer,
      ]);

      return { parent, model, controller, views, installation, composer };
    };

    it('filters by folder name', () => {
      const { parent, model } = setupDocs();

      const options: FilterOptions = { folderName: 'model' };
      const filtered = getChildrenFiltered(parent, options);

      expect(filtered).toHaveLength(2);
      expect(filtered.map((c) => c.fileTitle)).toEqual(['page1', 'page2']);
    });

    it('filters folder name case-insensitively', () => {
      const { parent } = setupDocs();

      const options: FilterOptions = { folderName: 'MODEL' };
      const filtered = getChildrenFiltered(parent, options);

      expect(filtered).toHaveLength(2);
    });

    it('filters by exclusions', () => {
      const { parent } = setupDocs();

      const options: FilterOptions = { exclude: ['installation', 'composer'] };
      const filtered = getChildrenFiltered(parent, options);

      expect(filtered.map((c) => c.fileTitle)).not.toContain('installation');
      expect(filtered.map((c) => c.fileTitle)).not.toContain('composer');
      expect(filtered.map((c) => c.fileTitle)).toContain('views');
    });

    it('filters by exclusions case-insensitively', () => {
      const { parent } = setupDocs();

      const options: FilterOptions = { exclude: ['INSTALLATION', 'COMPOSER'] };
      const filtered = getChildrenFiltered(parent, options);

      expect(filtered.map((c) => c.fileTitle)).not.toContain('installation');
      expect(filtered.map((c) => c.fileTitle)).not.toContain('composer');
    });

    it('filters by inclusions (only)', () => {
      const { parent } = setupDocs();

      const options: FilterOptions = { only: ['views', 'installation'] };
      const filtered = getChildrenFiltered(parent, options);

      expect(filtered).toHaveLength(2);
      // Results are sorted, so order might differ from only list
      const titles = new Set(filtered.map((c) => c.fileTitle));
      expect(titles).toEqual(new Set(['views', 'installation']));
    });

    it('filters by inclusions case-insensitively', () => {
      const { parent } = setupDocs();

      const options: FilterOptions = { only: ['VIEWS', 'INSTALLATION'] };
      const filtered = getChildrenFiltered(parent, options);

      expect(filtered).toHaveLength(2);
    });

    it('reverses order', () => {
      const { parent } = setupDocs();

      const options: FilterOptions = { reverse: true };
      const filtered = getChildrenFiltered(parent, options);
      const normal = getChildrenFiltered(parent, { reverse: false });

      expect(filtered.map((c) => c.fileTitle)).toEqual(
        normal.map((c) => c.fileTitle).reverse()
      );
    });

    it('includes folders when includeFolders=true', () => {
      const { parent } = setupDocs();

      const options: FilterOptions = { includeFolders: true };
      const filtered = getChildrenFiltered(parent, options);

      expect(filtered.map((c) => c.fileTitle)).toContain('model');
      expect(filtered.map((c) => c.fileTitle)).toContain('controller');
    });

    it('combines multiple options', () => {
      const { parent } = setupDocs();

      const options: FilterOptions = {
        exclude: ['composer'],
        reverse: true,
        includeFolders: true,
      };
      const filtered = getChildrenFiltered(parent, options);

      expect(filtered.map((c) => c.fileTitle)).not.toContain('composer');
      const titles = filtered.map((c) => c.fileTitle);
      expect(titles[0]).toBe('views');
    });
  });
});
