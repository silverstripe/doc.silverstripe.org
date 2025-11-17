const purgeCSSConfig = require('./purgecss.config');
const isUser = process.env.DOCS_CONTEXT === 'user';
const sources = isUser
  ? require('./sources-user')
  : require('./sources-docs');

module.exports = {
  siteMetadata: {
    title: `Silverstripe CMS Documentation`,
    description: isUser
    	? `Silverstripe CMS user help guide`
    	: `Developer documentation for Silverstripe CMS and framework`,
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
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 850,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              ignoreFileExtensions: [`md`],
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
        ...purgeCSSConfig,
      },
    },
    `gatsby-plugin-remove-serviceworker`,
  ],
}
