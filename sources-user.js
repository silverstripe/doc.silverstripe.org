module.exports = [
  // v4
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4`,
      remote: `https://github.com/silverstripe/silverstripe-userhelp-content.git`,
      branch: `4`,
      patterns: `docs/en/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/setting_up_advancedworkflow`,
      remote: `https://github.com/symbiote/silverstripe-advancedworkflow`,
      branch: `5`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/online_databases_and_registries`,
      remote: `https://github.com/silverstripe/silverstripe-registry`,
      branch: `2`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/content_review`,
      remote: `https://github.com/silverstripe/silverstripe-contentreview`,
      branch: `4`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/blogs`,
      remote: `https://github.com/silverstripe/silverstripe-blog`,
      branch: `3`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/forms`,
      remote: `https://github.com/silverstripe/silverstripe-userforms`,
      branch: `5`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/working_with_multiple_websites`,
      remote: `https://github.com/silverstripe/silverstripe-subsites`,
      branch: `2`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/taxonomies`,
      remote: `https://github.com/silverstripe/silverstripe-taxonomy`,
      branch: `2`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/iframe`,
      remote: `https://github.com/silverstripe/silverstripe-iframe`,
      branch: `2`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/site_wide_rss_feeds`,
      remote: `https://github.com/silverstripe/silverstripe-versionfeed`,
      branch: `2`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/content_blocks`,
      remote: `https://github.com/dnadesign/silverstripe-elemental`,
      branch: `4`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/modules_report`,
      remote: `https://github.com/bringyourownideas/silverstripe-maintenance`,
      branch: `2`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/share_draft_content`,
      remote: `https://github.com/silverstripe/silverstripe-sharedraftcontent`,
      branch: `2`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/document_converter`,
      remote: `https://github.com/silverstripe/silverstripe-documentconverter`,
      branch: `2`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/ckan_registry`,
      remote: `https://github.com/silverstripe/silverstripe-ckan-registry`,
      branch: `1`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/multi-factor_authentication`,
      remote: `https://github.com/silverstripe/silverstripe-mfa`,
      branch: `4`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--managing_your_website/reports/security_report`,
      remote: `https://github.com/silverstripe/silverstripe-securityreport`,
      branch: `2`,
      patterns: `docs/en/userguide/**`,
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--managing_your_website/reports/sitewide_content_report`,
      remote: `https://github.com/silverstripe/silverstripe-sitewidecontent-report`,
      branch: `3`,
      patterns: `docs/en/userguide/**`,
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--4--optional_features/managing_devices`,
      remote: `https://github.com/silverstripe/silverstripe-session-manager`,
      branch: `1`,
      patterns: `docs/en/userguide/**`
    }
  },

  // v3
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3`,
      remote: `https://github.com/silverstripe/silverstripe-userhelp-content.git`,
      branch: `3`,
      patterns: `docs/en/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/versionedfiles`,
      remote: `https://github.com/symbiote/silverstripe-versionedfiles`,
      branch: `master`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/setting_up_advancedworkflow`,
      remote: `https://github.com/symbiote/silverstripe-advancedworkflow`,
      branch: `4`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/online_databases_and_registries`,
      remote: `https://github.com/silverstripe/silverstripe-registry`,
      branch: `1.0`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/forums`,
      remote: `https://github.com/silverstripe-archive/silverstripe-forum`,
      branch: `0.8`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/blogs`,
      remote: `https://github.com/silverstripe/silverstripe-blog`,
      branch: `2`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/working_with_translations`,
      remote: `https://github.com/silverstripe/silverstripe-translatable`,
      branch: `2.1`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/working_with_multiple_websites`,
      remote: `https://github.com/silverstripe/silverstripe-subsites`,
      branch: `1.1`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/securing_files`,
      remote: `https://github.com/silverstripe/silverstripe-secureassets`,
      branch: `master`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/taxonomies`,
      remote: `https://github.com/silverstripe/silverstripe-taxonomy`,
      branch: `1`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/iframe`,
      remote: `https://github.com/silverstripe/silverstripe-iframe`,
      branch: `1.0`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/site_wide_rss_feeds`,
      remote: `https://github.com/silverstripe/silverstripe-versionfeed`,
      branch: `master`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--optional_features/document_management_system`,
      remote: `https://github.com/silverstripe/silverstripe-dms`,
      branch: `master`,
      patterns: `docs/en/userguide/**`
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--managing_your_website/reports/security_report`,
      remote: `https://github.com/silverstripe/silverstripe-securityreport`,
      branch: `master`,
      patterns: `docs/en/userguide/**`,
    }
  },
  {
    resolve: `gatsby-source-git`,
    options: {
      name: `user--3--managing_your_website/reports/sitewide_content_report`,
      remote: `https://github.com/silverstripe/silverstripe-sitewidecontent-report`,
      branch: `2.0`,
      patterns: `docs/en/userguide/**`,
    }
  },
];
