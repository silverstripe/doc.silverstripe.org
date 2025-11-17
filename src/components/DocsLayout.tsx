import { Sidebar } from './Sidebar';
import { VersionSwitcher } from './VersionSwitcher';
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Sidebar - hidden on mobile by default */}
          <div className={styles.sidebarContainer}>
            <div style={{ marginBottom: '1rem' }}>
              <VersionSwitcher
                currentVersion={version}
                currentSlug={currentSlug}
              />
            </div>
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
