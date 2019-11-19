import React, { StatelessComponent, useState, ReactNode } from "react";
import Header from './Header';
import Sidebar from './Sidebar';
import { setCurrentNode } from '../utils/nodes';

interface LayoutProps {
  children?: ReactNode
  pathContext: {
    slug: string;
  }
}
const Layout: StatelessComponent<LayoutProps> = ({ children, pathContext: { slug } }) => {
  const [isToggled, setSidebarOpen] = useState(false);
  const handleNavigate = () => setSidebarOpen(false);

  // This is a wrapper component that only gets mounted once. 
  // These two method calls set the initial state for SSR. From here on,
  // the state is updated each time the docs template renders
  setCurrentNode(slug);
  
  return (
    <>
    <Header handleSidebarToggle={() => setSidebarOpen(!isToggled)} />
    <div className={`docs-wrapper container ${isToggled ? 'sidebar-visible' : ''}`}>
    <Sidebar onNavigate={handleNavigate} isOpen={isToggled} />
      <div className="docs-content">
        <div className="container">
          <article role="main" className="docs-article">
            {children}
          </article>
        </div> 
      </div>
    </div>
    </>
  );
};
export default Layout;
