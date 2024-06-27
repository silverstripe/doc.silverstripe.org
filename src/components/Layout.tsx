import React, { StatelessComponent, useState, ReactNode } from "react";
import Header from './Header';
import Sidebar from './Sidebar';
import useHierarchy from '../hooks/useHierarchy';
import Helmet from 'react-helmet';
import LayoutContext from '../contexts/LayoutContext';

interface LayoutProps {
  children?: ReactNode
  pathContext: {
    slug: string;
  }
}
const Layout: StatelessComponent<LayoutProps> = ({ children, pageContext: { slug } }) => {
  const { setCurrentPath, getVersionPath, getCurrentVersion, getCurrentNode, getDefaultVersion, getVersionMessage } = useHierarchy();
  const [isToggled, setSidebarOpen] = useState(false);
  const [increment, setIncrement] = useState(0);
  const [currentGitRemote, setCurrentGitRemote] = useState(null);
  const handleNavigate = () => {
    setSidebarOpen(false);
    setIncrement(increment + 1);
  }
  
  setCurrentPath(slug);
  const ver = getCurrentVersion();
  const currentNode = getCurrentNode();
  const versionMessage = getVersionMessage();

  const helmetLinks = [{
    rel: 'preconnect',
    href: `https://${process.env.GATSBY_DOCSEARCH_APP_ID}-dsn.algolia.net`,
    crossOrigin: ''
  }];
  if (currentNode && ver !== getDefaultVersion()) {
    helmetLinks.push({
      rel: 'canonical',
      href: getVersionPath(currentNode, getDefaultVersion()),
    });
  }

  const value = {
    currentGitRemote,
    setCurrentGitRemote,
  };

  return (
    <LayoutContext.Provider value={value}>
      <Helmet link={helmetLinks} />
      <div className={`increment-${increment}`}>
        <Header handleSidebarToggle={() => setSidebarOpen(!isToggled)} />
        <div className={`docs-wrapper container ${isToggled ? 'sidebar-visible' : ''}`}>
        <Sidebar onNavigate={handleNavigate} isOpen={isToggled} />
          <div className="docs-content">
            <div className="container">
              <article role="main" className="docs-article">
                <>
                {versionMessage}
                {children}
                </>
              </article>
            </div> 
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};
export default Layout;
