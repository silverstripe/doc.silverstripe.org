import { MetadataRoute } from 'next';
import { getAllDocuments } from '@/lib/content/get-document';

export const dynamic = 'force-static';

const SITE_URL = process.env.SITE_URL || 'https://doc.silverstripe.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const allDocs = await getAllDocuments();

    const entries: MetadataRoute.Sitemap = allDocs.map((doc) => ({
      url: `${SITE_URL}${doc.slug}`,
      lastModified: new Date(),
      changeFrequency: doc.isIndex ? 'monthly' : 'weekly',
      priority: doc.isIndex ? 0.8 : 0.6,
    }));

    return entries;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return empty sitemap if documents cannot be loaded
    return [];
  }
}
