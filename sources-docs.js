module.exports = [
    {
        resolve: `gatsby-source-git`,
        options: {
          name: `docs--4`,
          remote: `https://github.com/silverstripe/developer-docs.git`,
          branch: `4.11`,
          patterns: `en/**`
        }
      },    
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `docs--3`,
          remote: `https://github.com/silverstripe/developer-docs.git`,
          branch: `3`,
          patterns: `en/**`
        }
      },    
];