'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavNode, isNodeOrDescendantActive, getActiveAncestorsSlug } from '@/lib/nav';

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
  }, [currentSlug, version]);

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
      'nav-link',
      isActive ? 'active' : '',
      depth > 0 ? 'nav-link-nested' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li key={node.slug} className="nav-item">
        <div className="d-flex align-items-center gap-2">
          {hasChildren && (
            <button
              className="nav-toggle btn btn-sm p-0"
              onClick={() => toggleExpanded(node.slug)}
              aria-expanded={isExpanded}
              aria-label={`Toggle ${node.title}`}
              style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
            >
              <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>
                ▶
              </span>
            </button>
          )}
          {!hasChildren && <span className="nav-toggle-spacer" style={{ width: '24px' }} />}
          <Link href={node.slug} className={linkClasses}>
            {node.title}
          </Link>
        </div>

        {hasChildren && isExpanded && (
          <ul className="nav-children list-unstyled ms-4">
            {node.children.map(child => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className="docs-sidebar" role="navigation">
      <ul className="nav flex-column list-unstyled">
        {navTree.map(node => renderNode(node, 0))}
      </ul>
    </nav>
  );
}
