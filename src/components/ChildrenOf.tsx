import React, { StatelessComponent, ReactElement } from 'react';
import { SilverstripeDocument, ChildrenOfProps } from '../types';
import { Link } from 'gatsby';
import { getChildren, getSiblings } from '../utils/nodes';

const createCards = (children: SilverstripeDocument[]): ReactElement[] => {
    return children.map(({ summary, slug, title, icon, iconBrand }) => {
        const iconClass = iconBrand ? `fab fa-${iconBrand}` : `fas fa-${icon || 'file-alt'}`
        return (
            <div className="col-12 col-lg-6 py-3" key={slug}>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">
                            <span className="theme-icon-holder card-icon-holder mr-2">
                                <i className={iconClass}></i>
                            </span>
                            <span className="card-title-text">{title}</span>
                        </h5>
                        <div className="card-text">
                            {summary || ''}
                        </div>
                        <Link className="card-link-mask" to={slug} aria-label={title}></Link>
                    </div>
                </div>
            </div>
        );
    })
};

const createList = (children: SilverstripeDocument[]): ReactElement[] => {
    return children.map(({ summary, slug, title }) => {
        return (
            <React.Fragment key={slug}>
                <dt><Link activeClassName="active" to={slug}>{title}</Link></dt>
                <dd>{summary || ''}</dd>
            </React.Fragment>
        );
    });
};

const ChildrenOf: StatelessComponent<ChildrenOfProps> = ({ folderName, exclude, only, currentNode, asList, includeFolders, reverse }) => {
    if (!currentNode) {
        return null;
    }

    var nodes: SilverstripeDocument[] = [];

    if (!folderName && !exclude && !only) {
        nodes = currentNode.isIndex ? getChildren(currentNode, includeFolders) : getSiblings(currentNode)

    } else if (folderName) {
        const targetFolder = getChildren(currentNode, true).find(
            child => child.isIndex && child.fileTitle.toLowerCase() === folderName.toLowerCase()
        );
        if (targetFolder) {
            nodes = getChildren(targetFolder, false);
        }
    } else if (exclude) {
        const exclusions = exclude.split(',').map(e => e.toLowerCase());
        nodes = getChildren(currentNode, includeFolders).filter(
            child => !exclusions.includes(child.fileTitle.toLowerCase())
        );
    } else if (only) {
        const inclusions = only.split(',').map(e => e.toLowerCase());
        nodes = getChildren(currentNode, includeFolders).filter(
            child => inclusions.includes(child.fileTitle.toLowerCase())
        );
    }

    const clonedNodes = [...nodes];
    reverse && clonedNodes.reverse();

    let children: ReactElement[] = asList ? createList(clonedNodes) : createCards(clonedNodes);

    return (
        <div className="docs-overview py-5">
            {asList &&
                <dl className="cards-list">{children}</dl>
            }
            {!asList &&
            <div className="row">
                {children}
            </div>
            }
        </div>
    )

};

export default ChildrenOf;