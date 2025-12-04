'use client';

import { useContext } from 'react';
import cx from 'classnames';
import { NavNode } from '@/types/types';
import { MobileMenuContext } from '@/contexts/MobileMenuContext';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';
import styles from './DocsLayout.module.css';

interface DocsLayoutProps {
  children: React.ReactNode;
  navTree: NavNode[];
  currentSlug: string;
  version: string;
}

/**
 * Layout component that combines sidebar navigation with main content
 * Responsive grid layout for desktop and mobile
 */
export function DocsLayout({
  children,
  navTree,
  currentSlug,
  version,
}: DocsLayoutProps) {
  const { isMobileMenuOpen, onClose } = useContext(MobileMenuContext);

  return (
    <div className={styles.layout}>
      <div className={styles.layoutContainer}>
        <div className={styles.grid}>
          {/* Sidebar - always in DOM, shown/hidden by CSS */}
          <div
            className={cx(styles.sidebarContainer, {
              [styles.sidebarOpen]: isMobileMenuOpen,
            })}
          >
            <Sidebar navTree={navTree} currentSlug={currentSlug} version={version} />
          </div>

          {/* Main content */}
          <div
            className={styles.mainContent}
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter') {
                onClose();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <main role="main">
              <Breadcrumbs slug={currentSlug} version={version} navTree={navTree} />
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
