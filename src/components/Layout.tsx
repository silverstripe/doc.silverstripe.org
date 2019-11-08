import React, { StatelessComponent, useState } from "react";
import Header from './Header';
import Sidebar from './Sidebar';
import smoothScroll from 'smooth-scroll';

const Layout: StatelessComponent<{}> = ({ children}) => {
  if (typeof window !== "undefined") {
    smoothScroll('a[href*="#"]')
  }  
  const [isToggled, setSidebarOpen] = useState(false);
  return (
    <>
    <Header handleSidebarToggle={() => setSidebarOpen(!isToggled)} />
    <div className={`docs-wrapper container ${isToggled ? 'sidebar-visible' : ''}`}>
    <Sidebar isOpen={isToggled} />
    <div className="docs-content">
      <div className="container">
        <article className="docs-article">
          {children}
        </article>
      </div> 
    </div>
  </div>
    </>
  );
};
export default Layout;
