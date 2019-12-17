import { graphql, useStaticQuery } from 'gatsby';

const useDocContext = (): string => {
    const result = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          context
        }
      }
    }
  `);

  return result.site.siteMetadata.context;
};

export default useDocContext;