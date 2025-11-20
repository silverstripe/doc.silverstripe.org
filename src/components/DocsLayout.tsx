'use client';

import { useContext } from 'react';
import { Sidebar } from './Sidebar';
import { NavNode } from '@/types';
import { MobileMenuContext } from '@/contexts/MobileMenuContext';
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
            className={`${styles.sidebarContainer} ${
              isMobileMenuOpen ? styles.sidebarOpen : ''
            }`}
          >
            <Sidebar navTree={navTree} currentSlug={currentSlug} version={version} />
          </div>

          {/* Main content */}
          <div className={styles.mainContent} onClick={onClose}>
            <main role="main">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
