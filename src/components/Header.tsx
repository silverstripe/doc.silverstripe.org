import React, { StatelessComponent, ReactElement } from 'react';
import SearchBox from './SearchBox';
import { Link, navigate } from 'gatsby';
import logo from '../images/silverstripe-cms-logo.svg';
import useDocContext from '../hooks/useDocContext';
import useHierarchy from '../hooks/useHierarchy';

interface HeaderProps {
  handleSidebarToggle(e: EventTarget): void
}

const Header: StatelessComponent<HeaderProps> = ({ handleSidebarToggle }): ReactElement => {
    const { getHomePage, getCurrentNode, getCurrentVersion, getVersionPath } = useHierarchy();
    const home = getHomePage();
    const currentNode = getCurrentNode() || home;
    const context = useDocContext();

    const handleNavigate = (e: any): void => {
      if (typeof window === 'undefined') {
        return;
      }
      
      const ver = e.target.value;
    
      if (currentNode) {
        const newPath = getVersionPath(currentNode, ver);
        // This has to be a hard refresh, because the sidebar and searchbar need to unmount
        navigate(newPath);
      }
    };

    const title = context === 'user' ? 'CMS Help' : 'CMS Docs';

    return (
    <header role="banner" className="header fixed-top">	    
        <div className="branding docs-branding">
          <div className="container position-relative py-2 d-flex">
            <div className="docs-logo-wrapper">
              <div className="site-logo">
                <Link style={{ backgroundImage: `url(${logo})`}} className="navbar-brand" to={ home ? home.slug : '/'} title="Go to the home page">                  
                  Silverstripe CMS Documentation
                </Link>
                <span />
                <span>{title}</span>
              </div>    

            </div>

            <div className="docs-top-utilities d-flex justify-content-between justify-content-lg-end align-items-center">
              <div className="top-search-box d-lg-flex">
                {process.env.GATSBY_DOCSEARCH_API_KEY && <SearchBox />}
              </div>
              <ul className="social-list list-inline d-flex flex-grow-1 flex-lg-grow-0 align-items-center justify-content-lg-center justify-content-end justify-content-lg-end">
                <li className="list-inline-item version-select">
                  <select id="version-select" value={getCurrentVersion()} onChange={handleNavigate}>
                      <option value='5'>V5</option>
                      <option value='4'>V4</option>
                      <option value='3'>V3</option>
                  </select>
                  <i className="fas fa-chevron-down"></i>
                </li>
                <li className="d-none d-sm-inline list-inline-item"><a title="Go to the Github repository" href="https://github.com/silverstripe/silverstripe-framework"><i className="fab fa-github fa-fw" /></a></li>
              </ul>
            </div>
            <button onClick={handleSidebarToggle} id="docs-sidebar-toggler" className="docs-sidebar-toggler docs-sidebar-visible mr-2 d-xl-none" type="button">
                <span />
                <span />
                <span />
              </button>
          </div>
        </div>
      </header>
    );
};

export default Header;