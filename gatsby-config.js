module.exports = {
  siteMetadata: {
    title: `SilverStripe Documentation`,
    description: `Developer documentation for the SilverStripe CMS and framework.`,
    author: `The Silverstripe Community`,
    stableVersions: [
      '3.x',
      '4.x',
    ]
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
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
        branch: `3`,
        patterns: `docs/en/**`
      }
    },    
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-prismjs',
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
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
