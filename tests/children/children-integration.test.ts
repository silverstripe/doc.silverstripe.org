import { replaceChildrenMarkers } from '../../src/lib/children';
import { DocumentNode } from '@/types';

describe('Children rendering integration', () => {
  const createDoc = (
    slug: string,
    title: string,
    isIndex: boolean,
    parentSlug: string,
    summary?: string,
    fileTitle?: string
  ): DocumentNode => ({
    slug,
    version: '6',
    filePath: fileTitle || title,
    fileTitle: fileTitle || title,
    fileAbsolutePath: `/docs/${slug}.md`,
    isIndex,
    parentSlug,
    title,
    content: '',
    category: 'docs',
    summary,
  });

  beforeEach(() => {
    // No need to clear - replaceChildrenMarkers sets up fresh cache
  });

  it('renders children in hierarchical card layout', () => {
    const v6 = createDoc('/en/6', 'Silverstripe CMS 6', true, '/', undefined, 'index');
    const started = createDoc(
      '/en/6/getting_started',
      'Getting Started',
      true,
      '/en/6',
      'Learn the basics',
      '01_getting_started'
    );
    const page1 = createDoc(
      '/en/6/getting_started/installation',
      'Installation',
      false,
      '/en/6/getting_started',
      'Install Silverstripe',
      '01_installation'
    );
    const page2 = createDoc(
      '/en/6/getting_started/requirements',
      'Requirements',
      false,
      '/en/6/getting_started',
      'System requirements',
      '02_requirements'
    );


    const html = `
      <h1>Getting Started</h1>
      <p>Check out these guides:</p>
      [CHILDREN]
      <p>More info below</p>
    `;

    const result = replaceChildrenMarkers(html, started, [v6, started, page1, page2]);

    expect(result).not.toContain('[CHILDREN]');
    expect(result).toContain('docs-overview');
    expect(result).toContain('card');
    expect(result).toContain('Installation');
    expect(result).toContain('Requirements');
    expect(result).toContain('Install Silverstripe');
    expect(result).toContain('System requirements');
  });

  it('renders children as list with asList flag', () => {
    const v6 = createDoc('/en/6', 'Home', true, '/', undefined, 'index');
    const docs = createDoc(
      '/en/6/documentation',
      'Documentation',
      true,
      '/en/6',
      'Full docs',
      '01_documentation'
    );
    const api = createDoc(
      '/en/6/documentation/api',
      'API Reference',
      false,
      '/en/6/documentation',
      'API docs',
      '01_api'
    );
    const guide = createDoc(
      '/en/6/documentation/guide',
      'Developer Guide',
      false,
      '/en/6/documentation',
      'Dev guide',
      '02_guide'
    );


    const html = '[CHILDREN asList]';

    const result = replaceChildrenMarkers(html, docs, [v6, docs, api, guide]);

    expect(result).not.toContain('[CHILDREN');
    expect(result).toContain('docs-list');
    expect(result).toContain('<dl>');
    expect(result).toContain('API Reference');
    expect(result).toContain('Developer Guide');
  });

  it('renders filtered children with Folder parameter', () => {
    const v6 = createDoc('/en/6', 'Home', true, '/', undefined, 'index');
    const model = createDoc(
      '/en/6/model',
      'Model',
      true,
      '/en/6',
      'Model docs',
      'model'
    );
    const modelContent = createDoc(
      '/en/6/model/fields',
      'Fields',
      false,
      '/en/6/model',
      'Field types',
      'fields'
    );
    const controller = createDoc(
      '/en/6/controller',
      'Controller',
      true,
      '/en/6',
      'Controller docs',
      'controller'
    );

    const html = `
      <h2>Explore Model section</h2>
      [CHILDREN Folder="model"]
    `;

    const result = replaceChildrenMarkers(html, v6, [v6, model, modelContent, controller]);

    expect(result).not.toContain('[CHILDREN Folder=');
    expect(result).toContain('Fields');
    expect(result).not.toContain('Controller');
  });

  it('renders children with exclusions', () => {
    const v6 = createDoc('/en/6', 'Home', true, '/', undefined, 'index');
    const intro = createDoc(
      '/en/6/intro',
      'Introduction',
      false,
      '/en/6',
      'Intro',
      'intro'
    );
    const install = createDoc(
      '/en/6/install',
      'Installation',
      false,
      '/en/6',
      'Install',
      'install'
    );
    const composer = createDoc(
      '/en/6/composer',
      'Composer Setup',
      false,
      '/en/6',
      'Composer',
      'composer'
    );
    const usage = createDoc(
      '/en/6/usage',
      'Usage',
      false,
      '/en/6',
      'Usage guide',
      'usage'
    );

    const html = '[CHILDREN Exclude="install,composer"]';

    const result = replaceChildrenMarkers(html, v6, [v6, intro, install, composer, usage]);

    expect(result).toContain('Introduction');
    expect(result).toContain('Usage');
    expect(result).not.toContain('Installation');
    expect(result).not.toContain('Composer Setup');
  });

  it('renders children with reverse ordering', () => {
    const v6 = createDoc('/en/6', 'Home', true, '/', undefined, 'index');
    const v1 = createDoc('/en/6/v1', 'Version 1', false, '/en/6', 'v1', '01_v1');
    const v2 = createDoc('/en/6/v2', 'Version 2', false, '/en/6', 'v2', '02_v2');
    const v3 = createDoc('/en/6/v3', 'Version 3', false, '/en/6', 'v3', '03_v3');


    const html = '[CHILDREN reverse]';

    const result = replaceChildrenMarkers(html, v6, [v6, v1, v2, v3]);

    // In reversed order, v3 should appear before v1 in the HTML
    const v3Pos = result.indexOf('Version 3');
    const v1Pos = result.indexOf('Version 1');
    expect(v3Pos).toBeLessThan(v1Pos);
  });

  it('renders with multiple flags combined', () => {
    const v6 = createDoc('/en/6', 'Home', true, '/', undefined, 'index');
    const advanced = createDoc(
      '/en/6/advanced',
      'Advanced',
      true,
      '/en/6',
      'Advanced topics',
      'advanced'
    );
    const cache = createDoc(
      '/en/6/advanced/caching',
      'Caching',
      false,
      '/en/6/advanced',
      'Cache strategies',
      'caching'
    );
    const performance = createDoc(
      '/en/6/advanced/performance',
      'Performance',
      false,
      '/en/6/advanced',
      'Performance tips',
      'performance'
    );

    const allDocs = [v6, advanced, cache, performance];

    const html = '[CHILDREN Folder="advanced" asList reverse]';

    const result = replaceChildrenMarkers(html, v6, allDocs);

    expect(result).not.toContain('[CHILDREN');
    expect(result).toContain('docs-list');
    // In reverse order, Performance should come before Caching
    const perfPos = result.indexOf('Performance');
    const cachePos = result.indexOf('Caching');
    expect(perfPos).toBeLessThan(cachePos);
  });

  it('replaces multiple markers in single document', () => {
    const root = createDoc('/en/6', 'Home', true, '/', undefined, 'index');
    const section1 = createDoc(
      '/en/6/section1',
      'Section 1',
      true,
      '/en/6',
      'First section',
      'section1'
    );
    const section2 = createDoc(
      '/en/6/section2',
      'Section 2',
      true,
      '/en/6',
      'Second section',
      'section2'
    );
    const page1a = createDoc(
      '/en/6/section1/page',
      'Page 1A',
      false,
      '/en/6/section1',
      'Page 1A',
      'page'
    );
    const page2a = createDoc(
      '/en/6/section2/page',
      'Page 2A',
      false,
      '/en/6/section2',
      'Page 2A',
      'page'
    );

    const allDocs = [root, section1, section2, page1a, page2a];

    const html = `
      <h1>Documentation</h1>
      
      <h2>Section 1</h2>
      [CHILDREN Folder="section1"]
      
      <h2>Section 2</h2>
      [CHILDREN Folder="section2"]
    `;

    const result = replaceChildrenMarkers(html, root, allDocs);

    expect(result).not.toContain('[CHILDREN');
    expect(result).toContain('Page 1A');
    expect(result).toContain('Page 2A');
    expect(result).toContain('Section 1');
    expect(result).toContain('Section 2');
  });

  it('preserves surrounding HTML content', () => {
    const v6 = createDoc('/en/6', 'Home', true, '/', undefined, 'index');
    const child = createDoc(
      '/en/6/child',
      'Child Page',
      false,
      '/en/6',
      'A child',
      'child'
    );


    const html = `
      <div class="content">
        <h1>Main Title</h1>
        <p>Introduction text</p>
        [CHILDREN]
        <p>Conclusion text</p>
        <footer>Footer content</footer>
      </div>
    `;

    const result = replaceChildrenMarkers(html, v6, [v6, child]);

    expect(result).toContain('Main Title');
    expect(result).toContain('Introduction text');
    expect(result).toContain('Conclusion text');
    expect(result).toContain('Footer content');
    expect(result).toContain('Child Page');
  });
});
