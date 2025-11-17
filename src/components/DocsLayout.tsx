import { Sidebar } from './Sidebar';
import { NavNode } from '@/types';

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
  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container-fluid">
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
