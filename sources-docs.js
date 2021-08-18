module.exports = [
    {
        resolve: `gatsby-source-git`,
        options: {
          name: `docs--4`,
          remote: `https://github.com/silverstripe/silverstripe-framework.git`,
          branch: `4`,
          patterns: `docs/en/**`
        }
      },    
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `docs--3`,
          remote: `https://github.com/silverstripe/silverstripe-framework.git`,
          branch: `3`,
          patterns: `docs/en/**`
        }
      },    
];