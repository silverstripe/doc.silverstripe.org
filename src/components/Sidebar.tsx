'use client';

import { useState, useEffect, useMemo } from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { isNodeOrDescendantActive, getActiveAncestorsSlug } from '@/lib/nav/build-nav-tree';
import type { NavNode } from '@/types/types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  navTree: NavNode[];
  currentSlug: string;
}

/**
 * Sidebar navigation component with expandable folders
 * Automatically expands ancestors of current page, manual toggles are session-only
 */
export function Sidebar({ navTree, currentSlug }: SidebarProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [manuallyToggled, setManuallyToggled] = useState<Set<string>>(new Set());

  const autoExpandedSlugs = useMemo(() => {
    const expanded = new Set<string>();
    navTree.forEach((node) => {
      const ancestors = getActiveAncestorsSlug(node);
      ancestors.forEach((slug) => expanded.add(slug));
    });
    return expanded;
  }, [currentSlug, navTree]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleExpanded = (slug: string) => {
    const newToggled = new Set(manuallyToggled);
    if (newToggled.has(slug)) {
      newToggled.delete(slug);
    } else {
      newToggled.add(slug);
    }
    setManuallyToggled(newToggled);
  };

  // Determine final expanded state using XOR logic:
  // - If a section is toggled, its state is opposite of its auto-expansion status
  // - This allows manually overriding auto-expansion of ancestors
  // - And manually opening non-ancestor sections
  const allExpandedSlugs = useMemo(() => {
    const result = new Set(autoExpandedSlugs);
    manuallyToggled.forEach((slug) => {
      if (result.has(slug)) {
        result.delete(slug);
      } else {
        result.add(slug);
      }
    });
    return result;
  }, [autoExpandedSlugs, manuallyToggled]);

  const renderNode = (node: NavNode, depth: number = 0): React.ReactNode => {
    const isExpanded = allExpandedSlugs.has(node.slug);
    const hasChildren = node.children.length > 0;
    const isActive = node.isActive || isNodeOrDescendantActive(node);

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
              onClick={() => toggleExpanded(node.slug)}
              aria-expanded={isExpanded}
              aria-label={`Toggle ${node.title}`}
            >
              <span className={cx(styles.chevron, { [styles.expanded]: isExpanded })}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <polyline
                    points="4 3 8 6 4 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
