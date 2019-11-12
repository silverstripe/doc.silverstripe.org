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
                        <h5 className="card-title mb-3">
                            <span className="theme-icon-holder card-icon-holder mr-2">                                
                                <i className={iconClass}></i>
                            </span>
                            <span className="card-title-text">{title}</span>
                        </h5>
                        <div className="card-text">
                            {summary || ''}
                        </div>
                        <Link className="card-link-mask" to={slug}></Link>
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
                <dt><Link to={slug}>{title}</Link></dt>
                <dd>{summary || ''}</dd>
            </React.Fragment>
        );
    });
};

const ChildrenOf: StatelessComponent<ChildrenOfProps> = ({ folderName, exclude, currentNode, asList }) => {
    if (!currentNode) {
        return null;
    }
    let children: ReactElement[] = [];
    if (!folderName && !exclude) {
        const sourceNodes = currentNode.isIndex ? getChildren(currentNode, false) : getSiblings(currentNode)
        children = asList ? createList(sourceNodes) : createCards(sourceNodes);
    } else if (folderName) {
        const targetFolder = getChildren(currentNode, true).find(
            child => child.isIndex && child.fileTitle.toLowerCase() === folderName.toLowerCase()
        );
        if (targetFolder) {
            children = asList
                ? createList(getChildren(targetFolder, false))
                : createCards(getChildren(targetFolder, false));
        } else {
            children = [];
        }
    } else if (exclude) {
        const exclusions = exclude.split(',').map(e => e.toLowerCase());
        const nodes = getChildren(currentNode, false).filter(
            child => !exclusions.includes(child.fileTitle.toLowerCase())
        );
        children = asList ? createList(nodes) : createCards(nodes);
    }

    return (
        <div className="docs-overview py-5">
            {asList &&
                <dl>{children}</dl>
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