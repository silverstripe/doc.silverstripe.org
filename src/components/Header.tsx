import React, { StatelessComponent, SyntheticEvent, ReactElement } from 'react';
import SearchBox from './SearchBox';
import { Link } from 'gatsby';
import logo from '../images/silverstripe-logo.svg';
import { getHomePage } from '../utils/nodes';

interface HeaderProps {
  handleSidebarToggle(e: SyntheticEvent): void
}

const Header: StatelessComponent<HeaderProps> = ({ handleSidebarToggle }): ReactElement => {
    const home = getHomePage();
    return (
    <header className="header fixed-top">	    
        <div className="branding docs-branding">
          <div className="container position-relative py-2 d-flex">
            <div className="docs-logo-wrapper">
              <div className="site-logo">
                <Link className="navbar-brand" to={home.slug} title="Go to the home page">
                  <img src={logo} alt="Silverstripe CMS documentation" />
                  <span>Documentation</span>
                </Link>
              </div>    

            </div>

            <div className="docs-top-utilities d-flex justify-content-between justify-content-lg-end align-items-center">
              <div className="top-search-box d-none d-lg-flex">
                <form className="search-form">
                  <SearchBox identifier="header-search" />
                </form>
              </div>
              <ul className="social-list list-inline d-flex flex-grow-1 flex-lg-grow-0 justify-content-between justify-content-lg-around align-items-center">
                <li className="list-inline-item version-select">
                  <label htmlFor="version-select">Version:</label>
                  <select id="version-select" onChange={() => alert('this doesnt work yet')}>
                      <option value='4'>4.x</option>
                      <option value='3'>3.x</option>
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