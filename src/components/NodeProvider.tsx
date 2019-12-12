import React, { StatelessComponent, ReactElement } from 'react';
import NodeContext from '../contexts/NodeContext';
import { useStaticQuery, graphql } from 'gatsby';
import { HierarchyQuery } from '../types';
import {
    getChildren,
    getCurrentNode,
    getCurrentVersion,
    getHomePage,
    getNavChildren,
    getNodes,
    getParent,
    getSiblings,
    initialise,
    setCurrentPath,
} from '../utils/nodes';

const NodeProvider: StatelessComponent<{}> = ({ children, pageContext: { slug } }): ReactElement => {
    const result:HierarchyQuery = useStaticQuery(graphql`
    {
      allSilverstripeDocument {
        nodes {
            title
            summary
            isIndex
            introduction
            icon
            iconBrand
            hideChildren
            slug
            parentSlug
            fileTitle
            fileAbsolutePath
            category
        }
      }
    }
  `
  );
  if (!getNodes()) {
    const nodes = result.allSilverstripeDocument.nodes.map(node => ({
      ...node,
    }));
    initialise(nodes);
  }

  setCurrentPath(slug);
  
  return (
      <NodeContext.Provider value={{
            getChildren,
            getCurrentNode,
            getCurrentVersion,
            getHomePage,
            getNavChildren,
            getNodes,
            getParent,
            getSiblings,
        }}>
          {children}
      </NodeContext.Provider>
  )
};

export default NodeProvider;