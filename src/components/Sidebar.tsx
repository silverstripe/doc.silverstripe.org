'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import cx from 'classnames';
import Link from 'next/link';
import { isNodeOrDescendantActiveByPath, getAncestorsByPath } from '@/lib/nav/build-nav-tree';
import type { NavNode } from '@/types/types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  navTree: NavNode[];
}

/**
 * Sidebar navigation component with expandable folders
 * Uses usePathname() for active state so it persists across navigations without remounting.
 *
 * Expansion state uses two explicit override sets instead of XOR to ensure manual
 * closes/opens are respected correctly as the auto-expanded set changes on navigation:
 *   - manuallyOpened: sections the user explicitly opened (not auto-expanded)
 *   - manuallyClosed: sections the user explicitly closed (was auto-expanded)
 * When a section becomes auto-expanded again (user navigates into it), it is removed
 * from manuallyClosed so it will open correctly.
 */
export function Sidebar({ navTree }: SidebarProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState<Set<string>>(new Set());
  const [manuallyClosed, setManuallyClosed] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const autoExpandedSlugs = useMemo(() => {
    const expanded = new Set<string>();
    if (!pathname) return expanded;
    navTree.forEach((node) => {
      const ancestors = getAncestorsByPath(node, pathname);
      ancestors.forEach((slug) => expanded.add(slug));
    });
    return expanded;
  }, [pathname, navTree]);

  // When a section becomes an ancestor of the current page, clear any manual close for it
  // so it auto-expands as expected.
  useEffect(() => {
    setManuallyClosed((prev) => {
      const next = new Set(prev);
      let changed = false;
      autoExpandedSlugs.forEach((slug) => {
        if (next.has(slug)) {
          next.delete(slug);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [autoExpandedSlugs]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const allExpandedSlugs = useMemo(() => {
    const result = new Set(autoExpandedSlugs);
    manuallyClosed.forEach((slug) => result.delete(slug));
    manuallyOpened.forEach((slug) => result.add(slug));
    return result;
  }, [autoExpandedSlugs, manuallyClosed, manuallyOpened]);

  const toggleExpanded = (slug: string, currentlyExpanded: boolean) => {
    if (currentlyExpanded) {
      setManuallyClosed((prev) => new Set(prev).add(slug));
      setManuallyOpened((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    } else {
      setManuallyOpened((prev) => new Set(prev).add(slug));
      setManuallyClosed((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    }
  };

  const renderNode = (node: NavNode, depth: number = 0): React.ReactNode => {
    const isExpanded = allExpandedSlugs.has(node.slug);
    const hasChildren = node.children.length > 0;
    const currentPath = pathname || '';
    const isActive = node.slug === currentPath || isNodeOrDescendantActiveByPath(node, currentPath);

    const linkClasses = cx(
      styles.navLink,
      { [styles.active]: isActive },
      `depth-${depth}`,
    );

    const itemClasses = cx(
      styles.navItem,
      { [styles.nested]: depth > 0 },
      `depth-${depth}`,
    );

    return (
      <li key={node.slug} className={itemClasses} data-depth={depth}>
        <div className={styles.navItemContainer} data-depth={depth}>
          {hasChildren && (
            <button
              className={styles.navToggle}
              type="button"
              onClick={() => toggleExpanded(node.slug, isExpanded)}
              aria-expanded={isExpanded}
              aria-label={`Toggle ${node.title}`}
            >
              <span className={cx(styles.chevron, { [styles.expanded]: isExpanded })}>
                <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" fill="none" viewBox="0 0 7 8" aria-hidden="true">
                  <path fill="currentColor" d="M1.549 0a.75.75 0 0 1 .396.12l3.903 3.068c.091.096.152.192.152.312s-.061.216-.152.312L1.945 6.88A.75.75 0 0 1 1.55 7a.75.75 0 0 1-.397-.12A.36.36 0 0 1 1 6.568V.432c0-.12.03-.216.152-.312A.75.75 0 0 1 1.55 0" />
                </svg>
              </span>
            </button>
          )}
          {!hasChildren && <span className={styles.navToggleSpacer} />}
          <Link href={node.slug} className={linkClasses}>
            {node.title}
          </Link>
        </div>

        {hasChildren && isExpanded && (
          <ul className={styles.navChildren}>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={cx(styles.sidebar, { [styles.hydrated]: isHydrated })} role="navigation">
      <ul className={styles.nav}>
        {navTree.map((node) => renderNode(node, 0))}
      </ul>
    </nav>
  );
}
