'use client';

import Link from 'next/link';
import { NavNode } from '@/types';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbsProps {
  slug: string;
  version: string;
  navTree: NavNode[];
}

/**
 * Find a nav node by slug recursively
 */
function findNavNodeBySlug(navTree: NavNode[], slug: string): NavNode | null {
  for (const node of navTree) {
    if (node.slug === slug) {
      return node;
    }
    const found = findNavNodeBySlug(node.children, slug);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Build breadcrumb items from a slug
 * E.g., /en/6/getting-started/installation/ becomes:
 * [
 *   { slug: '/en/6/getting-started/', title: 'Getting Started' },
 *   { slug: '/en/6/getting-started/installation/', title: 'Installation' }
 * ]
 * Home is only shown when on the home page itself.
 */
function buildBreadcrumbs(
  slug: string,
  version: string,
  navTree: NavNode[],
): Array<{ slug: string; title: string }> {
  const breadcrumbs: Array<{ slug: string; title: string }> = [];
  const homeSlug = `/en/${version}/`;

  // If we're at home, return only Home
  if (slug === homeSlug) {
    return [{ slug: homeSlug, title: 'Home' }];
  }

  // Parse slug parts: /en/6/getting-started/installation/
  // → ['en', '6', 'getting-started', 'installation']
  const parts = slug.split('/').filter(Boolean);

  // Build breadcrumbs for each path segment
  // Start from index 2 (skip 'en' and version)
  for (let i = 2; i < parts.length; i += 1) {
    const currentSlug = `/${parts.slice(0, i + 1).join('/')}/`;
    const navNode = findNavNodeBySlug(navTree, currentSlug);

    if (navNode) {
      breadcrumbs.push({
        slug: navNode.slug,
        title: navNode.title,
      });
    }
  }

  return breadcrumbs;
}

/**
 * Breadcrumbs component displays navigation path from root to current page
 * Hides "Home" link when not on home page; shows "Home" (non-link) when on home page
 */
export function Breadcrumbs({ slug, version, navTree }: BreadcrumbsProps) {
  const breadcrumbs = buildBreadcrumbs(slug, version, navTree);

  // Don't render if no breadcrumbs
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.slug} className={styles.item}>
              {isLast ? (
                <span className={styles.current}>{crumb.title}</span>
              ) : (
                <>
                  <Link href={crumb.slug} className={styles.link}>
                    {crumb.title}
                  </Link>
                  <span className={styles.separator}>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
