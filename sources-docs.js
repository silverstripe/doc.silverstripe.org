module.exports = [
    {
        resolve: `gatsby-source-git`,
        options: {
          name: `docs--4`,
          remote: `https://github.com/unclecheese/silverstripe-framework.git`,
          branch: `pulls/4/schemageddon`,
          patterns: `docs/en/**`
        }
      },
       
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `docs--3`,
          remote: `https://github.com/silverstripe/silverstripe-framework.git`,
          branch: `3.7`,
          patterns: `docs/en/**`
        }
      },    
];