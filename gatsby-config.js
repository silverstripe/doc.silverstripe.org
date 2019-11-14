const path = require('path');

module.exports = {
  siteMetadata: {
    title: `SilverStripe Documentation`,
    description: `Developer documentation for the SilverStripe CMS and framework.`,
    author: `The Silverstripe Community`,
    siteUrl: `https://doc.silverstripe.org`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `files`,
        path: `${__dirname}/static`
      }
    },    
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `4`,
        remote: `https://github.com/unclecheese/silverstripe-framework.git`,
        branch: `pulls/4/gatsby-docs`,
        patterns: `docs/en/**`
      }
    },    
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `3`,
        remote: `https://github.com/unclecheese/silverstripe-framework.git`,
        branch: `pulls/3/gatsby-docs`,
        patterns: `docs/en/**`
      }
    },    
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              aliases: {
                ss: 'html',
              }
            }
          },
          `gatsby-remark-copy-linked-files`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 850,
            },
          },          
        ]
      }
    },    
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        // Add any options here
      },
    },
    { 
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: false,
        whitelist: ['algolia-autocomplete'],
        ignore: ['prismjs/','docsearch.js/', 'src/theme/assets/search/algolia.css'],
        content: [
          path.join(process.cwd(), '.cache/gatsby-source-git/**/*.md'),
        ],
        extractors: [,
          {
            extractor: class {
              static extract(content) {
                return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
              }
            },
            extensions: ['js', 'ts', 'jsx', 'tsx', 'md', 'mdx']            
          },          
          {
            extractor: class  {
              static extract(content) {
                const selectors = [`file-alt`]
                const matches = content.match(/icon(Brand)?: ([a-zA-Z0-9_-]+)/);    
                if (matches) {
                  const isBrand = typeof matches[1] !== 'undefined';
                  selectors.push(isBrand ? `fab` : `fas`);
                  selectors.push(`fa-${matches[2]}`);
                }
                return selectors;
              }
            },
            extensions: ['md']
          },
        ]
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/en/4/developer_guides/**`],
      },      
    }   
  ],
}
