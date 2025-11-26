module.exports = [
  // CMS 6
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6',
      remote: 'https://github.com/silverstripe/developer-docs.git',
      branch: '6.1',
      patterns: 'en/**',
      excludeDirs: ['01_Managing_your_website', '02_Creating_pages_and_content']
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/login-forms',
      remote: 'https://github.com/silverstripe/silverstripe-login-forms.git',
      branch: '6.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/gridfieldextensions',
      remote: 'https://github.com/silverstripe/silverstripe-gridfieldextensions.git',
      branch: '5.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/gridfield-bulk-editing-tools',
      remote: 'https://github.com/silverstripe/silverstripe-gridfield-bulk-editing-tools.git',
      branch: '5.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/realme',
      remote: 'https://github.com/silverstripe/silverstripe-realme.git',
      branch: '6.0',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/staticpublishqueue',
      remote: 'https://github.com/silverstripe/silverstripe-staticpublishqueue.git',
      branch: '7.0',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/tagfield',
      remote: 'https://github.com/silverstripe/silverstripe-tagfield.git',
      branch: '4.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/textextraction',
      remote: 'https://github.com/silverstripe/silverstripe-textextraction.git',
      branch: '5.0',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/advancedworkflow',
      remote: 'https://github.com/silverstripe/silverstripe-advancedworkflow.git',
      branch: '7.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/queuedjobs',
      remote: 'https://github.com/silverstripe/silverstripe-queuedjobs.git',
      branch: '6.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/fluent',
      remote: 'https://github.com/tractorcow-farm/silverstripe-fluent.git',
      branch: '8.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/htmleditor-tinymce',
      remote: 'https://github.com/silverstripe/silverstripe-htmleditor-tinymce.git',
      branch: '1.0',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/linkfield',
      remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
      branch: '5.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/userforms',
      remote: 'https://github.com/silverstripe/silverstripe-userforms.git',
      branch: '7.0',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/elemental',
      remote: 'https://github.com/silverstripe/silverstripe-elemental.git',
      branch: '6.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/mfa',
      remote: 'https://github.com/silverstripe/silverstripe-mfa.git',
      branch: '6.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `docs--6--optional_features/graphql`,
      remote: `https://github.com/silverstripe/silverstripe-graphql.git`,
      branch: `6.1`,
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/mfa/authenticators/totp-authenticator',
      remote: 'https://github.com/silverstripe/silverstripe-totp-authenticator.git',
      branch: '6.0',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--6--optional_features/taxonomies',
      remote: 'https://github.com/silverstripe/silverstripe-taxonomy.git',
      branch: '4.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },

  // CMS 5
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5',
      remote: 'https://github.com/silverstripe/developer-docs.git',
      branch: '5.4',
      patterns: 'en/**',
      excludeDirs: ['01_Managing_your_website', '02_Creating_pages_and_content']
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/login-forms',
      remote: 'https://github.com/silverstripe/silverstripe-login-forms.git',
      branch: '5.3',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/gridfieldextensions',
      remote: 'https://github.com/silverstripe/silverstripe-gridfieldextensions.git',
      branch: '4.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/gridfield-bulk-editing-tools',
      remote: 'https://github.com/silverstripe/silverstripe-gridfield-bulk-editing-tools.git',
      branch: '4.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/realme',
      remote: 'https://github.com/silverstripe/silverstripe-realme.git',
      branch: '5.5',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/staticpublishqueue',
      remote: 'https://github.com/silverstripe/silverstripe-staticpublishqueue.git',
      branch: '6.3',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/tagfield',
      remote: 'https://github.com/silverstripe/silverstripe-tagfield.git',
      branch: '3.4',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/textextraction',
      remote: 'https://github.com/silverstripe/silverstripe-textextraction.git',
      branch: '4.1',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/advancedworkflow',
      remote: 'https://github.com/silverstripe/silverstripe-advancedworkflow.git',
      branch: '6.4',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/queuedjobs',
      remote: 'https://github.com/silverstripe/silverstripe-queuedjobs.git',
      branch: '5.3',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/fluent',
      remote: 'https://github.com/tractorcow-farm/silverstripe-fluent.git',
      branch: '7.3',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/linkfield',
      remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
      branch: '4.2',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/userforms',
      remote: 'https://github.com/silverstripe/silverstripe-userforms.git',
      branch: '6.4',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/elemental',
      remote: 'https://github.com/silverstripe/silverstripe-elemental.git',
      branch: '5.4',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/mfa',
      remote: 'https://github.com/silverstripe/silverstripe-mfa.git',
      branch: '5.4',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/mfa/authenticators/totp-authenticator',
      remote: 'https://github.com/silverstripe/silverstripe-totp-authenticator.git',
      branch: '5.3',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/mfa/authenticators/webauthn-authenticator',
      remote: 'https://github.com/silverstripe/silverstripe-webauthn-authenticator.git',
      branch: '5.3',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/taxonomies',
      remote: 'https://github.com/silverstripe/silverstripe-taxonomy.git',
      branch: '3.2',
      patterns: 'docs/en/!(userguide)/**'
    }
  },
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--5--optional_features/non-blocking-sessions',
      remote: 'https://github.com/silverstripe/silverstripe-non-blocking-sessions',
      branch: '1.0',
      patterns: 'docs/en/!(userguide)/**'
    }
  },

  // CMS 4
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--4',
      remote: 'https://github.com/silverstripe/developer-docs.git',
      branch: '4.13',
      patterns: 'en/**',
      excludeDirs: ['01_Managing_your_website', '02_Creating_pages_and_content']
    }
  },

  // CMS 3
  {
    resolve: 'gatsby-source-git',
    options: {
      name: 'docs--3',
      remote: 'https://github.com/silverstripe/developer-docs.git',
      branch: '3',
      patterns: 'en/**',
      excludeDirs: ['01_Managing_your_website', '02_Creating_pages_and_content']
    }
  },
];
