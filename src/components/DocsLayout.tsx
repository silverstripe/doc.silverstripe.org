import { Sidebar } from './Sidebar';
import { VersionSwitcher } from './VersionSwitcher';
import { VersionBanner } from './VersionBanner';
import { NavNode } from '@/types';
import { getDefaultVersion, getVersionPath } from '@/lib/versions';

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
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container-fluid">
        {/* Version Banner */}
        <div className="row mb-4">
          <div className="col-12">
            <VersionBanner
              version={version}
              latestVersionPath={latestVersionPath}
            />
          </div>
        </div>

        <div className="row">
          {/* Sidebar - hidden on mobile by default */}
          <div 
            className="col-12 col-lg-3 d-none d-lg-block"
            style={{
              position: 'sticky',
              top: '2rem',
              height: 'fit-content',
              maxHeight: 'calc(100vh - 4rem)',
              overflowY: 'auto',
              borderRight: '1px solid #e9ecef',
              paddingRight: '2rem',
            }}
          >
            <div className="mb-4">
              <VersionSwitcher
                currentVersion={version}
                currentSlug={currentSlug}
              />
            </div>
            <Sidebar navTree={navTree} currentSlug={currentSlug} version={version} />
          </div>

          {/* Main content */}
          <div 
            className="col-12 col-lg-9"
            style={{ paddingLeft: '2rem' }}
          >
            <main role="main">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
