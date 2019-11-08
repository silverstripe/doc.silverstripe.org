import React, { StatelessComponent, ReactElement, useRef, useLayoutEffect, useEffect, useState } from 'react';
import SearchBox from './SearchBox';
import Nav from './Nav';

interface SidebarProps {
    isOpen: boolean;
}

// Global state to persist across renders
let scroll = 0;

const Sidebar:StatelessComponent<SidebarProps> = ({ isOpen }): ReactElement => {
  const scrollingDiv = useRef(null);
  useLayoutEffect(() => {
    //scrollingDiv.current.scrollTop = scroll;
  }, [])
  const handleScroll = () => {
    scroll = scrollingDiv.current.scrollTop;
  };
    return (
        <div ref={scrollingDiv} onScroll={handleScroll} id="docs-sidebar" className={`docs-sidebar ${isOpen ? 'sidebar-visible' : ''}`}>
        <div className="top-search-box d-lg-none p-3">
          <form className="search-form">
            <SearchBox identifier="sidebar-search"/>
          </form>
        </div>
        <Nav />
      </div>
    );
};

Sidebar.defaultProps = {
    isOpen: true,
};

export default Sidebar;