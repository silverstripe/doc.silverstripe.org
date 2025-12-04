import type { Metadata } from 'next';
import type { DocumentNode } from '@/types';

const SITE_URL = process.env.SITE_URL || 'https://doc.silverstripe.org';
const DEFAULT_DESCRIPTION = 'SilverStripe CMS Documentation - Learn how to develop and configure SilverStripe applications.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Generate page metadata from a document node
 * Includes title, description, OpenGraph tags, and canonical URL
 */
export function generatePageMetadata(doc: DocumentNode): Metadata {
  const { title } = doc;
  const description = doc.summary || DEFAULT_DESCRIPTION;

  // Construct canonical URL
  const canonicalUrl = `${SITE_URL}${doc.slug}`;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };

  return metadata;
}

/**
 * Generate root metadata
 */
export function generateRootMetadata(): Metadata {
  const canonicalUrl = `${SITE_URL}/en/6/`;

  return {
    title: 'SilverStripe Documentation',
    description: DEFAULT_DESCRIPTION,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'SilverStripe Documentation',
      description: DEFAULT_DESCRIPTION,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'SilverStripe Documentation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SilverStripe Documentation',
      description: DEFAULT_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
