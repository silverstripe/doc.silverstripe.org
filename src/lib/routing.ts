/**
 * Utility functions for routing and slug handling
 */
import { getAllVersions } from '@/lib/versions';

/**
 * Build a full slug from route parameters
 * Params come from Next.js dynamic route: [version]/[[...slug]]/page.tsx
 */
export function buildSlugFromParams(params: {
  version: string;
  slug?: string[];
}): string {
  const parts = ['en', params.version];
  if (params.slug && params.slug.length > 0) {
    parts.push(...params.slug);
  }
  return `/${parts.join('/')}/`;
}

/**
 * Extract version and slug parts from a full slug
 * Takes a slug like /en/6/getting-started/installation/ and returns
 * {version: '6', slug: ['getting-started', 'installation']}
 */
export function extractVersionAndSlug(fullSlug: string): {
  version: string;
  slug: string[];
} {
  const normalized = fullSlug.startsWith('/') ? fullSlug : `/${fullSlug}`;
  const cleaned = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  const parts = cleaned.split('/').filter(Boolean);
  // Format is /en/VERSION/...rest
  if (parts.length < 2) {
    throw new Error(`Invalid slug format: ${fullSlug}`);
  }
  const [, version, ...slug] = parts;
  return { version, slug };
}

/**
 * Get available versions from documents
 * This would be used by generateStaticParams
 */
export function getAvailableVersions(): string[] {
  return getAllVersions();
}
