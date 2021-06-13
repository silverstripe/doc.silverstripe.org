module.exports = [
  /******* main content *********/
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

  
  // v3
  {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/versionedfiles`,
        remote: `https://github.com/symbiote/silverstripe-versionedfiles`,
        branch: `master`,        
        patterns: `docs/en/userguide/**`        
      }
    },

  
  // v3
  {
      // Running a fork. Switch remote back once merged.
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/setting_up_advancedworkflow`,
        remote: `https://github.com/symbiote/silverstripe-advancedworkflow`,
        branch: `4`,
        patterns: `docs/en/userguide/**`        
      }
    },

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/setting_up_advancedworkflow`,
        remote: `https://github.com/symbiote/silverstripe-advancedworkflow`,
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* registry ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/online_databases_and_registries`,
        remote: `https://github.com/silverstripe/silverstripe-registry`,
        branch: `1.0`,          
        patterns: `docs/en/userguide/**`        
      }
    },

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/online_databases_and_registries`,
        remote: `https://github.com/silverstripe/silverstripe-registry`,
        branch: `master`,          
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* forum ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/forums`,
        remote: `https://github.com/silverstripe-archive/silverstripe-forum`,
        branch: `0.8`,        
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* contentreview ********/


    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/content_review`,
        remote: `https://github.com/silverstripe/silverstripe-contentreview`,
        branch: `master`,          
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* blog ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/blogs`,
        remote: `https://github.com/silverstripe/silverstripe-blog`,
        branch: `2`,          
        patterns: `docs/en/userguide/**`        
      }
    },

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/blogs`,
        remote: `https://github.com/silverstripe/silverstripe-blog`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* userforms ********/

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/forms`,
        remote: `https://github.com/silverstripe/silverstripe-userforms`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* translatable ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/working_with_translations`,
        remote: `https://github.com/silverstripe/silverstripe-translatable`,
        branch: `2.1`,          
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* subsites ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/working_with_multiple_websites`,
        remote: `https://github.com/silverstripe/silverstripe-subsites`,
        branch: `1.1`,          
        patterns: `docs/en/userguide/**`        
      }
    },

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/working_with_multiple_websites`,
        remote: `https://github.com/silverstripe/silverstripe-subsites`,
        branch: `1.1`,          
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* secureassets ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/securing_files`,
        remote: `https://github.com/silverstripe/silverstripe-secureassets`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* taxonomy ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/taxonomies`,
        remote: `https://github.com/silverstripe/silverstripe-taxonomy`,          
        branch: `1`,
        patterns: `docs/en/userguide/**`        
      }
    },

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/taxonomies`,
        remote: `https://github.com/silverstripe/silverstripe-taxonomy`,
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* iframe ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/iframe`,
        remote: `https://github.com/silverstripe/silverstripe-iframe`,
        branch: `1.0`,          
        patterns: `docs/en/userguide/**`        
      }
    },

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/iframe`,
        remote: `https://github.com/silverstripe/silverstripe-iframe`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* versionfeed ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/site_wide_rss_feeds`,
        remote: `https://github.com/silverstripe/silverstripe-versionfeed`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/site_wide_rss_feeds`,
        remote: `https://github.com/silverstripe/silverstripe-versionfeed`,
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* dms ********/

    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--optional_features/document_management_system`,
        remote: `https://github.com/silverstripe/silverstripe-dms`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* elemental ********/

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/content_blocks`,        
        remote: `https://github.com/dnadesign/silverstripe-elemental`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },


    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/modules_report`,
        remote: `https://github.com/bringyourownideas/silverstripe-maintenance`,        
        branch: `1`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* sharedraftcontent ********/

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/share_draft_content`,
        remote: `https://github.com/silverstripe/silverstripe-sharedraftcontent`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* documentconverter ********/

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/document_converter`,
        remote: `https://github.com/silverstripe/silverstripe-documentconverter`,
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* ckan-registry ********/

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/ckan_registry`,
        remote: `https://github.com/silverstripe/silverstripe-ckan-registry`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******* mfa ********/

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/multi-factor_authentication`,
        remote: `https://github.com/silverstripe/silverstripe-mfa`,
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },

    /******** securityreport ********/
    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--managing_your_website/reports/security_report`,
        remote: `https://github.com/silverstripe/silverstripe-securityreport`,          
        branch: `master`,
        patterns: `docs/en/userguide/**`,
      }        
    },
    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--managing_your_website/reports/security_report`,
        remote: `https://github.com/silverstripe/silverstripe-securityreport`,
        branch: `master`,
        patterns: `docs/en/userguide/**`,
      }        
    },

    /******** sitewide-content-report ********/
    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--managing_your_website/reports/sitewide_content_report`,
        remote: `https://github.com/silverstripe/silverstripe-sitewidecontent-report`,
        branch: `master`,
        patterns: `docs/en/userguide/**`,
      }        
    },
    // v3
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--3--managing_your_website/reports/sitewide_content_report`,
        remote: `https://github.com/silverstripe/silverstripe-sitewidecontent-report`,
        branch: `2.0`,
        patterns: `docs/en/userguide/**`,
      }        
    },

    /******* session-manager ********/

    // v4
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `user--4--optional_features/managing_devices`,
        remote: `https://github.com/silverstripe/silverstripe-session-manager`,
        branch: `master`,
        patterns: `docs/en/userguide/**`        
      }
    },
];
