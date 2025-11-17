import { generatePageMetadata, generateRootMetadata } from '@/lib/seo/metadata';
import type { DocumentNode } from '@/types';
import type { Metadata } from 'next';

describe('generatePageMetadata', () => {
  it('generates metadata for a document with summary', () => {
    const doc: DocumentNode = {
      slug: '/en/6/getting-started/',
      version: '6',
      filePath: 'getting-started.md',
      fileTitle: 'Getting Started',
      fileAbsolutePath: '/path/to/getting-started.md',
      isIndex: false,
      parentSlug: '/en/6/',
      title: 'Getting Started',
      content: 'Content here',
      category: 'docs',
      summary: 'Learn how to get started with SilverStripe'
    };

    const metadata = generatePageMetadata(doc);

    expect(metadata.title).toBe('Getting Started');
    expect(metadata.description).toBe('Learn how to get started with SilverStripe');
    expect(metadata.alternates?.canonical).toBe('https://doc.silverstripe.org/en/6/getting-started/');
    expect(metadata.openGraph?.title).toBe('Getting Started');
    expect(metadata.openGraph?.description).toBe('Learn how to get started with SilverStripe');
    expect(metadata.openGraph?.url).toBe('https://doc.silverstripe.org/en/6/getting-started/');
  });

  it('uses default description when summary is missing', () => {
    const doc: DocumentNode = {
      slug: '/en/6/advanced/',
      version: '6',
      filePath: 'advanced.md',
      fileTitle: 'Advanced',
      fileAbsolutePath: '/path/to/advanced.md',
      isIndex: false,
      parentSlug: '/en/6/',
      title: 'Advanced Topics',
      content: 'Content here',
      category: 'docs'
    };

    const metadata = generatePageMetadata(doc);

    expect(metadata.description).toBe(
      'SilverStripe CMS Documentation - Learn how to develop and configure SilverStripe applications.'
    );
    expect(metadata.openGraph?.description).toBe(
      'SilverStripe CMS Documentation - Learn how to develop and configure SilverStripe applications.'
    );
  });

  it('includes OpenGraph image metadata', () => {
    const doc: DocumentNode = {
      slug: '/en/6/test/',
      version: '6',
      filePath: 'test.md',
      fileTitle: 'Test',
      fileAbsolutePath: '/path/to/test.md',
      isIndex: false,
      parentSlug: '/en/6/',
      title: 'Test Page',
      content: 'Content here',
      category: 'docs'
    };

    const metadata = generatePageMetadata(doc);

    const images = metadata.openGraph?.images;
    if (Array.isArray(images)) {
      expect(images).toHaveLength(1);
      const image = images[0] as any;
      expect(image.url).toBe('https://doc.silverstripe.org/og-image.png');
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
      expect(image.alt).toBe('Test Page');
    }
  });

  it('includes Twitter card metadata', () => {
    const doc: DocumentNode = {
      slug: '/en/6/test/',
      version: '6',
      filePath: 'test.md',
      fileTitle: 'Test',
      fileAbsolutePath: '/path/to/test.md',
      isIndex: false,
      parentSlug: '/en/6/',
      title: 'Test Page',
      content: 'Content here',
      category: 'docs'
    };

    const metadata = generatePageMetadata(doc);

    expect(metadata.twitter?.title).toBe('Test Page');
    const images = metadata.twitter?.images;
    if (Array.isArray(images)) {
      expect(images[0]).toBe('https://doc.silverstripe.org/og-image.png');
    }
  });
});

describe('generateRootMetadata', () => {
  it('generates metadata for the root documentation page', () => {
    const metadata = generateRootMetadata();

    expect(metadata.title).toBe('SilverStripe Documentation');
    expect(metadata.description).toBe(
      'SilverStripe CMS Documentation - Learn how to develop and configure SilverStripe applications.'
    );
    expect(metadata.alternates?.canonical).toBe('https://doc.silverstripe.org/en/6/');
    expect(metadata.openGraph?.title).toBe('SilverStripe Documentation');
  });

  it('includes proper OpenGraph and Twitter tags for root', () => {
    const metadata = generateRootMetadata();

    expect(metadata.openGraph?.images).toBeDefined();
    const images = metadata.openGraph?.images;
    if (Array.isArray(images)) {
      const image = images[0] as any;
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
    }
    expect(metadata.twitter?.title).toBe('SilverStripe Documentation');
  });
});
