const path = require('path');
const sources = process.env.DOCS_CONTEXT === 'user'
  ? require('./sources-user')
  : require('./sources-docs');

module.exports = {
  siteMetadata: {
    title: `Silverstripe CMS Documentation`,
    description: `Developer and user documentation for the Silverstripe CMS and framework.`,
    author: `The Silverstripe Community`,
    siteUrl: `https://doc.silverstripe.org`,
    context: process.env.DOCS_CONTEXT,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-netlify`,

    ...sources,

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `watcher`,
        path: `${__dirname}/.cache/gatsby-source-git/`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        pedantic: false,
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
          // All the markdown in the git repos
          path.join(process.cwd(), '.cache/gatsby-source-git/**/*.md'),
          // Components
          path.join(process.cwd(), 'src/components/!(*.d).{ts,js,jsx,tsx}'),
          // Static pages (e.g. 404)
          path.join(process.cwd(), 'src/pages/!(*.d).{ts,js,jsx,tsx}'),
          // Page templates
          path.join(process.cwd(), 'src/templates/!(*.d).{ts,js,jsx,tsx}'),
        ],
        extractors: [
          {
            // Simple extractor just matches against components and templates (e.g. JSX)
            extractor: class {
              static extract(content) {
                return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
              }
            },
            extensions: ['js', 'ts', 'jsx', 'tsx']
          },
          {
            // Match markdown files for icon classes (icon, iconBrand). Add each one to the
            // allowed selectors defined in FontAwesome. Everything else in FA should be removed.
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
    `gatsby-plugin-remove-serviceworker`,
  ],
}
