import { MetadataRoute } from 'next';
import { SITE_URL } from '../../global-config';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/.next/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
