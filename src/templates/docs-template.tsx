import React, { StatelessComponent, ReactElement } from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/SEO';
import { SingleFileQuery } from '../types';
import parseHTML from '../utils/parseHTML';

const Template: StatelessComponent<SingleFileQuery> = (result): ReactElement => {
    const currentNode = result.data.silverstripeDocument;
    const { html } = currentNode.parent;
    const { title } = currentNode;
    const { relativePath, gitRemote: { ref, webLink } } = currentNode.parent.parent;
    const editLink = `${webLink}/edit/${ref}/${relativePath}`;
    return (
    <>
      <SEO title={title} />
      {parseHTML(html)}
      <div className="github-edit">
        <a target="_blank" href={editLink} title="Edit on Github">
          <i className="fas fa-pen fa-fw" />{` `}
          Edit on Github
        </a>
      </div>


    </>
    );
};

export default Template;

export const pageQuery = graphql`
  query DocsBySlug($slug: String!) {
    silverstripeDocument(slug: { eq: $slug }) {
      parent {
        ... on MarkdownRemark {
          html
          parent {
            ... on File {
              relativePath
              gitRemote {
                ref
                webLink
              }
            }
          }
        }
      }

      title

    }
  }
`
;