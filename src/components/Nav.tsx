import React from 'react';
import { getNavChildren, getHomePage, getCurrentNode } from '../utils/nodes';
import { SilverstripeDocument } from '../types';
import { Link } from 'gatsby';

const Nav = () => {
    const currentNode = getCurrentNode();
    const top = getHomePage();
    if (!top) {
        return <nav>boo</nav>;
    }

    return (
        <nav id="docs-nav" className="docs-nav navbar">
        <ul className="section-items list-unstyled nav flex-column pb-3">
            {getNavChildren(top).map((node: SilverstripeDocument) => {
                const { slug, title } = node;
                const childItems = getNavChildren(node);
                return (
                    <React.Fragment key={slug}>
                    <li className="nav-item section-title">
                        <Link activeClassName='active' className="nav-link" to={slug}>{title}</Link>
                    </li>
                    {childItems.map((node: SilverstripeDocument) => {
                        const { slug: childSlug, title: childTitle } = node;
                        const shouldShowChildren = currentNode && currentNode.slug.startsWith(childSlug);
                        return (
                            <React.Fragment key={childSlug}>
                            <li key={childSlug} className="nav-item">
                                <Link activeClassName='active' className="nav-link" to={childSlug}>{childTitle}</Link>
                            </li>
                            {shouldShowChildren && getNavChildren(node).map((child: SilverstripeDocument) => {
                                const { title: grandchildTitle, slug: grandchildSlug } = child;
                                return (
                                    <li key={grandchildSlug} className="nav-item third-level">
                                        <Link activeClassName='active' className="nav-link" to={grandchildSlug}>{grandchildTitle}</Link>
                                    </li>
                                );
                            })}
                            </React.Fragment>
                        );
                    })}
                    </React.Fragment>
                );
                
            })}
        </ul>
      </nav>
    );
};

export default Nav;