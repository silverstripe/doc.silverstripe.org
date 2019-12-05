import React, { StatelessComponent, useState, ReactNode } from "react";
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children?: ReactNode
  pathContext: {
    slug: string;
  }
}
const Layout: StatelessComponent<LayoutProps> = ({ children }) => {
  const [isToggled, setSidebarOpen] = useState(false);
  const handleNavigate = () => setSidebarOpen(false);

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
