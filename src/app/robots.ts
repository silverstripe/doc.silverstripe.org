import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE_URL = process.env.SITE_URL || 'https://doc.silverstripe.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/.next/']
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
