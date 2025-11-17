import React, { StatelessComponent, ReactElement } from 'react';
import { SilverstripeDocument } from '../types';
import { Link } from 'gatsby';
import classnames from 'classnames';
import { LinkGetProps } from '@reach/router';
import useHierarchy from '../hooks/useHierarchy';

interface NavProps {
    onNavigate?(e: React.MouseEvent): void;
};

const getLinkProps = (props: LinkGetProps): {} => {
    const { isPartiallyCurrent, isCurrent } = props;
    return {
        className: classnames({
            'active': isCurrent,
            'section': isPartiallyCurrent,
            'nav-link': true,
        }),
    };
};

const Nav:StatelessComponent<NavProps> = ({ onNavigate }): ReactElement => {
    const {
        getNavChildren,
        getHomePage,
        getCurrentNode,
    } = useHierarchy();

    const currentNode = getCurrentNode();
    const top = getHomePage();

    if (!top) {
        return <nav />;
    }
    const topLevel = getNavChildren(top);
    return (
        <nav role="navigation" id="docs-nav" className="docs-nav navbar">
        <ul className="section-items list-unstyled nav flex-column pb-3">
            {topLevel.map((node: SilverstripeDocument) => {
                const { slug, title } = node;
                const childItems = getNavChildren(node);
                return (
                    <React.Fragment key={slug}>
                    <li className="nav-item section-title">
                        <Link getProps={getLinkProps} onClick={onNavigate} to={slug}>{title}</Link>
                    </li>
                    {childItems.map((node: SilverstripeDocument) => {
                        const { slug: childSlug, title: childTitle } = node;
                        const shouldShowChildren = currentNode && currentNode.slug.startsWith(childSlug);
                        return (
                            <React.Fragment key={childSlug}>
                            <li key={childSlug} className="nav-item">
                            <Link getProps={getLinkProps} onClick={onNavigate} to={childSlug}>{childTitle}</Link>
                            </li>
                            {shouldShowChildren && getNavChildren(node).map((child: SilverstripeDocument) => {
                                const { title: grandchildTitle, slug: grandchildSlug } = child;
                                return (
                                    <li key={grandchildSlug} className="nav-item third-level">
                                        <Link getProps={getLinkProps} onClick={onNavigate} to={grandchildSlug}>{grandchildTitle}</Link>
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