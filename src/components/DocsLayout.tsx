import { Sidebar } from './Sidebar';
import { VersionBanner } from './VersionBanner';
import { NavNode } from '@/types';
import { getDefaultVersion, getVersionPath } from '@/lib/versions';
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
  const isCurrentVersion = version === getDefaultVersion();
  const latestVersionPath = getVersionPath(currentSlug, getDefaultVersion());

  return (
    <div className={styles.layout}>
      <div className={styles.layoutContainer}>
        {/* Version Banner */}
        <div className={styles.bannerRow}>
          <VersionBanner
            version={version}
            latestVersionPath={latestVersionPath}
          />
        </div>

        <div className={styles.grid}>
          {/* Sidebar - hidden on mobile by default */}
          <div className={styles.sidebarContainer}>
            <Sidebar navTree={navTree} currentSlug={currentSlug} version={version} />
          </div>

          {/* Main content */}
          <div className={styles.mainContent}>
            <main role="main">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
