import type { Metadata } from 'next';
import type { DocumentNode, DocsContext } from '@/types/types';
import { getConfig } from '@/lib/config/config';
import { SITE_URL, DEFAULT_VERSION } from '../../../global-config';

const SITE_TITLES: Record<DocsContext, string> = {
  docs: 'Silverstripe CMS Documentation',
  user: 'Silverstripe CMS User Help Guides',
  search: 'Silverstripe Search user guides',
};

const SITE_DESCRIPTIONS: Record<DocsContext, string> = {
  docs: 'Silverstripe CMS Documentation - Learn how to develop and configure Silverstripe applications.',
  user: 'Silverstripe CMS User Help Guides - Learn how to administer and edit content with Silverstripe CMS',
  search: 'Learn how to use the Silverstripe Search service',
};

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const config = getConfig();
const siteTitle = SITE_TITLES[config.docsContext];
const siteDescription = SITE_DESCRIPTIONS[config.docsContext];

export function generatePageMetadata(doc: DocumentNode): Metadata {
  // Check if this is the homepage/index - don't add suffix to title
  const isHomepage = doc.slug === `/en/${doc.version}/` || doc.fileTitle === 'index';
  const title = isHomepage
    ? siteTitle
    : `${doc.title} | ${siteTitle}`;
  const description = doc.summary || siteDescription;
  const canonicalUrl = `${SITE_URL}${doc.slug}`;
  const version = doc.version || DEFAULT_VERSION;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'docsearch:version': version,
      'docsearch:context': config.docsContext,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };

  return metadata;
}

export function generateRootMetadata(): Metadata {
  const canonicalUrl = `${SITE_URL}/en/${DEFAULT_VERSION}/`;

  return {
    title: siteTitle,
    description: siteDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'docsearch:version': DEFAULT_VERSION,
      'docsearch:context': config.docsContext,
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
  };
}
