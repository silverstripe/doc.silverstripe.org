import type { Metadata } from 'next';
import type { DocumentNode } from '@/types/types';
import { getConfig } from '@/lib/config/config';
import { SITE_URL, DEFAULT_VERSION } from '../../../global-config';

const DEFAULT_DESCRIPTION = 'Silverstripe CMS Documentation - Learn how to develop and configure Silverstripe applications.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const config = getConfig();

export function generatePageMetadata(doc: DocumentNode): Metadata {
  // Check if this is the homepage/index - don't add suffix to title
  const isHomepage = doc.slug === `/en/${doc.version}/` || doc.fileTitle === 'index';
  const title = isHomepage
    ? 'Silverstripe CMS Documentation'
    : `${doc.title} | Silverstripe CMS Documentation`;
  const description = doc.summary || DEFAULT_DESCRIPTION;
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
    title: 'Silverstripe CMS Documentation',
    description: DEFAULT_DESCRIPTION,
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'docsearch:version': DEFAULT_VERSION,
      'docsearch:context': config.docsContext,
    },
    openGraph: {
      title: 'Silverstripe CMS Documentation',
      description: DEFAULT_DESCRIPTION,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Silverstripe CMS Documentation',
        },
      ],
    },
  };
}
