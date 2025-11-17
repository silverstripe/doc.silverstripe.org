/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import React, { StatelessComponent } from "react";
import Helmet from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import { getCurrentVersion } from '../utils/nodes';

interface MetaProp {
  name: string,
  content: any,
}
interface SEOProps {
  description?: string,
  lang?: string,
  meta?: MetaProp[],
  title: string
}

const SEO: StatelessComponent<SEOProps> = ({ description, lang, meta, title }) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          context
        }
      }
    }
  `);
  const metaDescription = description || site.siteMetadata.description;
  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          name: `twitter:card`,
          content: `summary`
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author
        },
        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: metaDescription
        },
        {
          name: `docsearch:version`,
          content: getCurrentVersion(),
        },
        {
          name: `docsearch:context`,
          content: site.siteMetadata.context,
        },
      ].concat(meta)}
    />
  );
};
SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``
};
export default SEO;
