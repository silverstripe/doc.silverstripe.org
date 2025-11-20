'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavNode, isNodeOrDescendantActive, getActiveAncestorsSlug } from '@/lib/nav';
import styles from './Sidebar.module.css';

interface SidebarProps {
  navTree: NavNode[];
  currentSlug: string;
  version: string;
}

/**
 * Sidebar navigation component with expandable folders
 * Tracks expanded state in localStorage
 */
export function Sidebar({ navTree, currentSlug, version }: SidebarProps) {
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize expanded state on mount
  useEffect(() => {
    // Auto-expand ancestors of current page
    const expanded = new Set<string>();
    navTree.forEach(node => {
      const ancestors = getActiveAncestorsSlug(node);
      ancestors.forEach(slug => expanded.add(slug));
    });

    // Restore from localStorage
    const storageKey = `sidebar_state_v${version}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const savedSlugs = JSON.parse(saved);
        savedSlugs.forEach((slug: string) => expanded.add(slug));
      } catch {
        // Ignore parse errors
      }
    }

    setExpandedSlugs(expanded);
    setIsHydrated(true);
  }, [currentSlug, version, navTree]);

  // Save expanded state to localStorage
  useEffect(() => {
    const storageKey = `sidebar_state_v${version}`;
    localStorage.setItem(storageKey, JSON.stringify(Array.from(expandedSlugs)));
  }, [expandedSlugs, version]);

  const toggleExpanded = (slug: string) => {
    const newExpanded = new Set(expandedSlugs);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedSlugs(newExpanded);
  };

  const renderNode = (node: NavNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedSlugs.has(node.slug);
    const hasChildren = node.children.length > 0;
    const isActive = node.isActive || isNodeOrDescendantActive(node);

    const linkClasses = [
      styles.navLink,
      isActive ? styles.active : '',
    ]
      .filter(Boolean)
      .join(' ');

    const itemClasses = [
      styles.navItem,
      depth > 0 ? styles.nested : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li key={node.slug} className={itemClasses}>
        <div className={styles.navItemContainer}>
          {hasChildren && (
            <button
              className={styles.navToggle}
              onClick={() => toggleExpanded(node.slug)}
              aria-expanded={isExpanded}
              aria-label={`Toggle ${node.title}`}
            >
              <span className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}>
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
            {node.children.map(child => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={`${styles.sidebar} ${isHydrated ? styles.hydrated : ''}`} role="navigation">
      <ul className={styles.nav}>
        {navTree.map(node => renderNode(node, 0))}
      </ul>
    </nav>
  );
}
