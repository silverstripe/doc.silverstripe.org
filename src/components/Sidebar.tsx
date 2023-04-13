import React, { StatelessComponent, ReactElement } from 'react';
import Nav from './Nav';

interface SidebarProps {
    isOpen: boolean;
    onNavigate?(e: React.MouseEvent): void;
}


const Sidebar:StatelessComponent<SidebarProps> = ({ isOpen, onNavigate }): ReactElement => {
    return (
      <div id="docs-sidebar" className={`docs-sidebar ${isOpen ? 'sidebar-visible' : ''}`}>
        <Nav onNavigate={onNavigate} />
      </div>
    );
};

Sidebar.defaultProps = {
    isOpen: true,
};

export default Sidebar;