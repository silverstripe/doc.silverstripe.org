module.exports = [
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5',
      remote: 'https://github.com/silverstripe/developer-docs.git',
      branch: '5.1',
      patterns: 'en/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/linkfield',
      remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
      branch: '4.0',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--4',
      remote: 'https://github.com/silverstripe/developer-docs.git',
      branch: '4.13',
      patterns: 'en/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--3',
      remote: 'https://github.com/silverstripe/developer-docs.git',
      branch: '3',
      patterns: 'en/**'
    }
  },
];
