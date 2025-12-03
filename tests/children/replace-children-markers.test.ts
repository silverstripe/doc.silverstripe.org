import {
  replaceChildrenMarkers,
  getChildrenData,
} from '../../src/lib/children/replace-children-markers';
import { DocumentNode } from '@/types';
import { clearDocumentCache } from '../../src/lib/children/get-children';

describe('replaceChildrenMarkers', () => {
  const createDoc = (
    slug: string,
    title: string,
    isIndex: boolean,
    parentSlug: string,
    summary?: string
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
    summary,
  });

  beforeEach(() => {
    clearDocumentCache();
  });

  it('replaces simple [CHILDREN] marker', () => {
    const parent = createDoc('/en/6/guide', 'Guide', true, '/en/6');
    const child1 = createDoc('/en/6/guide/page1', 'Page 1', false, '/en/6/guide', 'First page');
    const child2 = createDoc('/en/6/guide/page2', 'Page 2', false, '/en/6/guide', 'Second page');

    const html = '<p>See our pages:</p>\n[CHILDREN]\n<p>End of list</p>';
    const allDocs = [parent, child1, child2];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).not.toContain('[CHILDREN]');
    expect(result).toContain('docs-overview');
    expect(result).toContain('Page 1');
    expect(result).toContain('Page 2');
    expect(result).toContain('End of list');
  });

  it('replaces [CHILDREN asList] marker', () => {
    const parent = createDoc('/en/6/guide', 'Guide', true, '/en/6');
    const child1 = createDoc('/en/6/guide/page1', 'Page 1', false, '/en/6/guide', 'First page');
    const child2 = createDoc('/en/6/guide/page2', 'Page 2', false, '/en/6/guide', 'Second page');

    const html = '[CHILDREN asList]';
    const allDocs = [parent, child1, child2];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).not.toContain('[CHILDREN asList]');
    expect(result).toContain('docs-list');
    expect(result).toContain('<dl>');
    expect(result).toContain('Page 1');
    expect(result).toContain('Page 2');
  });

  it('replaces [CHILDREN Folder="..."] marker', () => {
    const parent = createDoc('/en/6', 'Home', true, '/');
    const model = createDoc('/en/6/model', 'Model', true, '/en/6');
    const modelPage = createDoc('/en/6/model/detail', 'Detail', false, '/en/6/model', 'Model detail');
    const apiPage = createDoc('/en/6/api', 'API', false, '/en/6', 'API reference');

    const html = '[CHILDREN Folder="model"]';
    const allDocs = [parent, model, modelPage, apiPage];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).not.toContain('[CHILDREN Folder="model"]');
    expect(result).toContain('Detail');
    expect(result).not.toContain('API reference');
  });

  it('replaces [CHILDREN Exclude="..."] marker', () => {
    const parent = createDoc('/en/6', 'Home', true, '/');
    const page1 = createDoc('/en/6/page1', 'Installation', false, '/en/6', 'Installation guide');
    const page2 = createDoc('/en/6/page2', 'Usage', false, '/en/6', 'How to use');
    const page3 = createDoc('/en/6/page3', 'Composer', false, '/en/6', 'Composer setup');

    const html = '[CHILDREN Exclude="installation,composer"]';
    const allDocs = [parent, page1, page2, page3];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).not.toContain('[CHILDREN Exclude=');
    expect(result).toContain('Usage');
    expect(result).not.toContain('Installation');
    expect(result).not.toContain('Composer');
  });

  it('replaces [CHILDREN Only="..."] marker', () => {
    const parent = createDoc('/en/6', 'Home', true, '/');
    const page1 = createDoc('/en/6/page1', 'Installation', false, '/en/6', 'Installation guide');
    const page2 = createDoc('/en/6/page2', 'Usage', false, '/en/6', 'How to use');
    const page3 = createDoc('/en/6/page3', 'Advanced', false, '/en/6', 'Advanced topics');

    const html = '[CHILDREN Only="usage,advanced"]';
    const allDocs = [parent, page1, page2, page3];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).not.toContain('[CHILDREN Only=');
    expect(result).toContain('Usage');
    expect(result).toContain('Advanced');
    expect(result).not.toContain('Installation');
  });

  it('replaces [CHILDREN reverse] marker', () => {
    const parent = createDoc('/en/6', 'Home', true, '/');
    const page1 = createDoc('/en/6/01_first', 'First', false, '/en/6', 'First page');
    const page2 = createDoc('/en/6/02_second', 'Second', false, '/en/6', 'Second page');

    const html = '<div>[CHILDREN reverse]</div>';
    const allDocs = [parent, page1, page2];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).not.toContain('[CHILDREN reverse]');
    // Verify reversed order by checking positions
    const secondPos = result.indexOf('Second');
    const firstPos = result.indexOf('First');
    expect(secondPos).toBeLessThan(firstPos);
  });

  it('handles multiple [CHILDREN] markers in same HTML', () => {
    const parent = createDoc('/en/6', 'Home', true, '/');
    const folder1 = createDoc('/en/6/section1', 'Section1', true, '/en/6');
    const folder2 = createDoc('/en/6/section2', 'Section2', true, '/en/6');
    const child1 = createDoc('/en/6/section1/page', 'Page1', false, '/en/6/section1', 'Page 1');
    const child2 = createDoc('/en/6/section2/page', 'Page2', false, '/en/6/section2', 'Page 2');

    const html = `
      <h2>Section 1</h2>
      [CHILDREN Folder="section1"]
      <h2>Section 2</h2>
      [CHILDREN Folder="section2"]
    `;
    const allDocs = [parent, folder1, folder2, child1, child2];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).not.toContain('[CHILDREN Folder="section1"]');
    expect(result).not.toContain('[CHILDREN Folder="section2"]');
    expect(result).toContain('Page1');
    expect(result).toContain('Page2');
    expect(result).toContain('Section 1');
    expect(result).toContain('Section 2');
  });

  it('escapes HTML special characters in titles', () => {
    const parent = createDoc('/en/6', 'Home', true, '/');
    const page1 = createDoc(
      '/en/6/page1',
      'Page & More',
      false,
      '/en/6',
      'This <script> tag'
    );

    const html = '[CHILDREN]';
    const allDocs = [parent, page1];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).toContain('&amp;');
    expect(result).not.toContain('<script>');
  });

  it('includes folder indices when includeFolders flag is set', () => {
    const parent = createDoc('/en/6', 'Home', true, '/');
    const folder = createDoc('/en/6/folder', 'Folder', true, '/en/6');
    const page = createDoc('/en/6/page', 'Page', false, '/en/6');

    const html = '[CHILDREN includeFolders]';
    const allDocs = [parent, folder, page];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).toContain('Folder');
    expect(result).toContain('Page');
  });

  it('combines multiple flags correctly', () => {
    const parent = createDoc('/en/6', 'Home', true, '/');
    const page1 = createDoc('/en/6/01_first', 'First', false, '/en/6', 'First');
    const page2 = createDoc('/en/6/02_second', 'Second', false, '/en/6', 'Second');

    const html = '[CHILDREN asList reverse]';
    const allDocs = [parent, page1, page2];

    const result = replaceChildrenMarkers(html, parent, allDocs);

    expect(result).not.toContain('[CHILDREN');
    expect(result).toContain('docs-list');
    const secondPos = result.indexOf('Second');
    const firstPos = result.indexOf('First');
    expect(secondPos).toBeLessThan(firstPos);
  });
});

describe('getChildrenData', () => {
  const createDoc = (
    slug: string,
    title: string,
    isIndex: boolean,
    parentSlug: string,
    summary?: string
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
    summary,
  });

  beforeEach(() => {
    clearDocumentCache();
  });

  it('returns metadata for children', () => {
    const parent = createDoc('/en/6/guide', 'Guide', true, '/en/6');
    const child1 = createDoc('/en/6/guide/page1', 'Page 1', false, '/en/6/guide', 'First page');
    const child2 = createDoc('/en/6/guide/page2', 'Page 2', false, '/en/6/guide', 'Second page');

    const { setAllDocuments } = require('../../src/lib/children/get-children');
    setAllDocuments([parent, child1, child2]);

    const data = getChildrenData(parent);

    expect(data).toHaveLength(2);
    expect(data[0].title).toBe('Page 1');
    expect(data[0].summary).toBe('First page');
    expect(data[1].title).toBe('Page 2');
  });

  it('returns empty array for documents with no children', () => {
    const page = createDoc('/en/6/page', 'Page', false, '/en/6');

    const { setAllDocuments } = require('../../src/lib/children/get-children');
    setAllDocuments([page]);

    const data = getChildrenData(page);

    expect(data).toEqual([]);
  });
});
