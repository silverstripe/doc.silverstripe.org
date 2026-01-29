import { generatePageMetadata, generateRootMetadata } from '@/lib/metadata/metadata';
import type { DocumentNode } from '@/types/types';
import { DEFAULT_VERSION } from '../../../global-config';

jest.mock('@/lib/config/config', () => ({
  getConfig: () => ({
    docsContext: 'docs',
  }),
}));

describe('generatePageMetadata', () => {
  it('generates metadata for a document with summary', () => {
    const doc: DocumentNode = {
      slug: `/en/${DEFAULT_VERSION}/getting-started/`,
      version: DEFAULT_VERSION,
      filePath: 'getting-started.md',
      fileTitle: 'Getting Started',
      fileAbsolutePath: '/path/to/getting-started.md',
      isIndex: false,
      parentSlug: `/en/${DEFAULT_VERSION}/`,
      title: 'Getting Started',
      content: 'Content here',
      category: 'docs',
      summary: 'Learn how to get started with SilverStripe',
    };

    const metadata = generatePageMetadata(doc);

    expect(metadata.title).toBe('Getting Started | Silverstripe CMS Documentation');
    expect(metadata.description).toBe('Learn how to get started with SilverStripe');
    expect(metadata.alternates?.canonical).toBe(`https://docs.silverstripe.org/en/${DEFAULT_VERSION}/getting-started/`);
    expect(metadata.openGraph?.title).toBe('Getting Started | Silverstripe CMS Documentation');
    expect(metadata.openGraph?.description).toBe('Learn how to get started with SilverStripe');
    expect(metadata.openGraph?.url).toBe(`https://docs.silverstripe.org/en/${DEFAULT_VERSION}/getting-started/`);
  });

  it('uses default description when summary is missing', () => {
    const doc: DocumentNode = {
      slug: `/en/${DEFAULT_VERSION}/advanced/`,
      version: DEFAULT_VERSION,
      filePath: 'advanced.md',
      fileTitle: 'Advanced',
      fileAbsolutePath: '/path/to/advanced.md',
      isIndex: false,
      parentSlug: `/en/${DEFAULT_VERSION}/`,
      title: 'Advanced Topics',
      content: 'Content here',
      category: 'docs',
    };

    const metadata = generatePageMetadata(doc);

    expect(metadata.description).toBe(
      'Silverstripe CMS Documentation - Learn how to develop and configure Silverstripe applications.',
    );
    expect(metadata.openGraph?.description).toBe(
      'Silverstripe CMS Documentation - Learn how to develop and configure Silverstripe applications.',
    );
  });

  it('includes OpenGraph image metadata', () => {
    const doc: DocumentNode = {
      slug: `/en/${DEFAULT_VERSION}/test/`,
      version: DEFAULT_VERSION,
      filePath: 'test.md',
      fileTitle: 'Test',
      fileAbsolutePath: '/path/to/test.md',
      isIndex: false,
      parentSlug: `/en/${DEFAULT_VERSION}/`,
      title: 'Test Page',
      content: 'Content here',
      category: 'docs',
    };

    const metadata = generatePageMetadata(doc);

    const images = metadata.openGraph?.images;
    if (Array.isArray(images)) {
      expect(images).toHaveLength(1);
      const image = images[0] as any;
      expect(image.url).toBe('https://docs.silverstripe.org/og-image.png');
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
      expect(image.alt).toBe('Test Page | Silverstripe CMS Documentation');
    }
  });

  it('includes docsearch metadata with version and context', () => {
    const doc: DocumentNode = {
      slug: `/en/${DEFAULT_VERSION}/test/`,
      version: DEFAULT_VERSION,
      filePath: 'test.md',
      fileTitle: 'Test',
      fileAbsolutePath: '/path/to/test.md',
      isIndex: false,
      parentSlug: `/en/${DEFAULT_VERSION}/`,
      title: 'Test Page',
      content: 'Content here',
      category: 'docs',
    };

    const metadata = generatePageMetadata(doc);

    expect(metadata.other?.['docsearch:version']).toBe(DEFAULT_VERSION);
    expect(metadata.other?.['docsearch:context']).toBe('docs');
  });

  it('uses DEFAULT_VERSION when document version is missing', () => {
    const doc: DocumentNode = {
      slug: '/en/getting-started/',
      version: '',
      filePath: 'getting-started.md',
      fileTitle: 'Getting Started',
      fileAbsolutePath: '/path/to/getting-started.md',
      isIndex: false,
      parentSlug: '/',
      title: 'Getting Started',
      content: 'Content here',
      category: 'docs',
    };

    const metadata = generatePageMetadata(doc);

    expect(metadata.other?.['docsearch:version']).toBe(DEFAULT_VERSION);
  });
});

describe('generateRootMetadata', () => {
  it('generates metadata for the root documentation page', () => {
    const metadata = generateRootMetadata();

    expect(metadata.title).toBe('Silverstripe CMS Documentation');
    expect(metadata.description).toBe(
      'Silverstripe CMS Documentation - Learn how to develop and configure Silverstripe applications.',
    );
    expect(metadata.alternates?.canonical).toBe(`https://docs.silverstripe.org/en/${DEFAULT_VERSION}/`);
    expect(metadata.openGraph?.title).toBe('Silverstripe CMS Documentation');
  });

  it('includes proper OpenGraph tags for root', () => {
    const metadata = generateRootMetadata();

    expect(metadata.openGraph?.images).toBeDefined();
    const images = metadata.openGraph?.images;
    if (Array.isArray(images)) {
      const image = images[0] as any;
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
    }
  });

  it('includes docsearch metadata with DEFAULT_VERSION and context', () => {
    const metadata = generateRootMetadata();

    expect(metadata.other?.['docsearch:version']).toBe(DEFAULT_VERSION);
    expect(metadata.other?.['docsearch:context']).toBe('docs');
  });
});
