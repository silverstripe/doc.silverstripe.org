import type { DocumentNode } from '@/types/types';
import { DEFAULT_VERSION } from '../../../global-config';

function loadMetadataWithContext(context: string) {
  let metadataModule: typeof import('@/lib/metadata/metadata');
  jest.isolateModules(() => {
    jest.doMock('@/lib/config/config', () => ({
      getConfig: () => ({ docsContext: context }),
    }));
    // eslint-disable-next-line global-require
    metadataModule = require('@/lib/metadata/metadata');
  });
  return metadataModule!;
}

describe('context-aware metadata', () => {
  it('uses user context title and description', () => {
    const { generatePageMetadata, generateRootMetadata } = loadMetadataWithContext('user');

    const root = generateRootMetadata();
    expect(root.title).toBe('Silverstripe CMS User Help Guides');
    expect(root.description).toBe(
      'Silverstripe CMS User Help Guides - Learn how to administer and edit content with Silverstripe CMS',
    );

    const doc: DocumentNode = {
      slug: `/en/${DEFAULT_VERSION}/editing/`,
      version: DEFAULT_VERSION,
      filePath: 'editing.md',
      fileTitle: 'Editing',
      fileAbsolutePath: '/path/to/editing.md',
      isIndex: false,
      parentSlug: `/en/${DEFAULT_VERSION}/`,
      title: 'Editing Content',
      content: 'Content here',
      category: 'user',
    };
    const page = generatePageMetadata(doc);
    expect(page.title).toBe('Editing Content | Silverstripe CMS User Help Guides');
    expect(page.description).toBe(
      'Silverstripe CMS User Help Guides - Learn how to administer and edit content with Silverstripe CMS',
    );
    expect(page.other?.['docsearch:context']).toBe('user');
  });

  it('uses search context title and description', () => {
    const { generatePageMetadata, generateRootMetadata } = loadMetadataWithContext('search');

    const root = generateRootMetadata();
    expect(root.title).toBe('Silverstripe Search user guides');
    expect(root.description).toBe('Learn how to use the Silverstripe Search service');

    const doc: DocumentNode = {
      slug: `/en/${DEFAULT_VERSION}/setup/`,
      version: DEFAULT_VERSION,
      filePath: 'setup.md',
      fileTitle: 'Setup',
      fileAbsolutePath: '/path/to/setup.md',
      isIndex: false,
      parentSlug: `/en/${DEFAULT_VERSION}/`,
      title: 'Search Setup',
      content: 'Content here',
      category: 'search',
    };
    const page = generatePageMetadata(doc);
    expect(page.title).toBe('Search Setup | Silverstripe Search user guides');
    expect(page.description).toBe('Learn how to use the Silverstripe Search service');
    expect(page.other?.['docsearch:context']).toBe('search');
  });

  it('uses document summary over context default description', () => {
    const { generatePageMetadata } = loadMetadataWithContext('search');

    const doc: DocumentNode = {
      slug: `/en/${DEFAULT_VERSION}/setup/`,
      version: DEFAULT_VERSION,
      filePath: 'setup.md',
      fileTitle: 'Setup',
      fileAbsolutePath: '/path/to/setup.md',
      isIndex: false,
      parentSlug: `/en/${DEFAULT_VERSION}/`,
      title: 'Search Setup',
      content: 'Content here',
      category: 'search',
      summary: 'Custom summary for this page',
    };
    const page = generatePageMetadata(doc);
    expect(page.description).toBe('Custom summary for this page');
  });

  it('uses site title without suffix for homepage in non-docs context', () => {
    const { generatePageMetadata } = loadMetadataWithContext('user');

    const doc: DocumentNode = {
      slug: `/en/${DEFAULT_VERSION}/`,
      version: DEFAULT_VERSION,
      filePath: 'index.md',
      fileTitle: 'index',
      fileAbsolutePath: '/path/to/index.md',
      isIndex: true,
      parentSlug: '/en/',
      title: 'User Help',
      content: 'Content here',
      category: 'user',
    };
    const page = generatePageMetadata(doc);
    expect(page.title).toBe('Silverstripe CMS User Help Guides');
  });

  it('uses context-specific OpenGraph metadata', () => {
    const { generateRootMetadata } = loadMetadataWithContext('search');

    const root = generateRootMetadata();
    expect(root.openGraph?.title).toBe('Silverstripe Search user guides');
    expect(root.openGraph?.description).toBe('Learn how to use the Silverstripe Search service');
  });
});
