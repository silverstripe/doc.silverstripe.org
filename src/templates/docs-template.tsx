import React, { StatelessComponent, ReactElement } from 'react';
import { graphql } from 'gatsby';
import DocsPage from '../components/DocsPage';
import { SingleFileQuery } from '../types';

const Template: StatelessComponent<SingleFileQuery> = (result): ReactElement => {
    const currentNode = result.data.silverstripeDocument;
    const { title } = currentNode;
    const  { html } = currentNode.watchFile;
    const { relativePath, gitRemote } = currentNode.parent.parent;
    const { ref, href } = gitRemote;
    
    return (
        <DocsPage
            title={title}
            html={html}
            relPath={relativePath}
            branch={ref}
            gitURL={href}
        />
    );
};

export default Template;

export const pageQuery = graphql`
  query DocsBySlug($slug: String!) {
    silverstripeDocument(slug: { eq: $slug }) {
      title
      slug
      id
      watchFile {
        html
      }
      parent {
        ... on MarkdownRemark {
          html
          parent {
            ... on File {
              relativePath
              gitRemote {
                ref
                sourceInstanceName
              }
            }
          }
        }
      }
    }
  }
`
;