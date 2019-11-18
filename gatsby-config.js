const path = require('path');

module.exports = {
  siteMetadata: {
    title: `Silverstripe CMS Documentation`,
    description: `Developer documentation for the Silverstripe CMS and framework.`,
    author: `The Silverstripe Community`,
    siteUrl: `https://doc.silverstripe.org`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `4`,
        remote: `https://github.com/silverstripe/silverstripe-framework.git`,
        branch: `4`,
        patterns: `docs/en/**`
      }
    },    
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `3`,
        remote: `https://github.com/silverstripe/silverstripe-framework.git`,
        branch: `3`,
        patterns: `docs/en/**`
      }
    },    
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `ss3-files`,
        path: `${__dirname}/.cache/gatsby-source-git/3`
      }
    },    
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `ss4-files`,
        path: `${__dirname}/.cache/gatsby-source-git/4`
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
                ss: `html`,
                sh: `bash`,
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
        whitelist: ['algolia-autocomplete', 'pre', 'code'],
        ignore: ['prismjs/','docsearch.js/', 'src/theme/assets/search/algolia.css'],
        content: [
          path.join(process.cwd(), '.cache/gatsby-source-git/**/*.md'),
          path.join(process.cwd(), 'src/components/!(*.d).{ts,js,jsx,tsx}'),
          path.join(process.cwd(), 'src/pages/!(*.d).{ts,js,jsx,tsx}'),
          path.join(process.cwd(), 'src/templates/!(*.d).{ts,js,jsx,tsx}'),
        ],
        extractors: [
          {
            extractor: class {
              static extract(content) {
                return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
              }
            },
            extensions: ['js', 'ts', 'jsx', 'tsx']            
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
