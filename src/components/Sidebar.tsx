import React, { StatelessComponent, ReactElement } from 'react';
import SearchBox from './SearchBox';
import Nav from './Nav';

interface SidebarProps {
    isOpen: boolean;
    onNavigate?(e: React.MouseEvent): void;
}


const Sidebar:StatelessComponent<SidebarProps> = ({ isOpen, onNavigate }): ReactElement => {
    return (
        <div id="docs-sidebar" className={`docs-sidebar ${isOpen ? 'sidebar-visible' : ''}`}>
        <div className="top-search-box d-lg-none p-3">
          <form className="search-form">
            <SearchBox identifier="sidebar-search"/>
          </form>
        </div>
        <Nav onNavigate={onNavigate} />
      </div>
    );
};

Sidebar.defaultProps = {
    isOpen: true,
};

export default Sidebar;