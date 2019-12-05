module.exports = [

    // v3
    {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--3--versionedfiles`,
          remote: `https://github.com/silverstripe-australia/silverstripe-versionedfiles`,
          branch: `master`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
    /******* advancedworkflow ********/
    
    // v3
    {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--3--setting_up_advancedworkflow`,
          remote: `https://github.com/symbiote/silverstripe-advancedworkflow`,
          branch: `4`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
      // v4
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--4--setting_up_advancedworkflow`,
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
          name: `user--3--online_databases_and_registries`,
          remote: `https://github.com/silverstripe/silverstripe-registry`,
          branch: `1.0`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
      // v4
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--4--online_databases_and_registries`,
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
          name: `user--3--forums`,
          remote: `https://github.com/silverstripe/silverstripe-forum`,
          branch: `0.8`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
      /******* contentreview ********/
  
  
      // v4
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--4--content_review`,
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
          name: `user--3--blogs`,
          remote: `https://github.com/silverstripe/silverstripe-blog`,
          branch: `2`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
      // v4
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--4--blogs`,
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
          name: `user--4--forms`,
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
          name: `user--3--working_with_translations`,
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
          name: `user--3--working_with_multiple_websites`,
          remote: `https://github.com/silverstripe/silverstripe-subsites`,
          branch: `1.1`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
      // v4
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--4--working_with_multiple_websites`,
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
          name: `user--3--securing_files`,
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
          name: `user--3--taxonomies`,
          remote: `https://github.com/silverstripe/silverstripe-taxonomy`,
          branch: `1`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
      // v4
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--4--taxonomies`,
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
          name: `user--3--iframe`,
          remote: `https://github.com/silverstripe/silverstripe-iframe`,
          branch: `1.0`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
      // v4
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--4--iframe`,
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
          name: `user--3--site_wide_rss_feeds`,
          remote: `https://github.com/silverstripe/silverstripe-versionfeed`,
          branch: `master`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
      // v4
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--4--site_wide_rss_feeds`,
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
          name: `user--3--document_management_system`,
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
          name: `user--4--content_blocks`,
          remote: `https://github.com/dnadesign/silverstripe-elemental`,
          branch: `master`,
          patterns: `docs/en/userguide/**`        
        }
      },
  
      /******* maintenance ********/
  
      // v4
      {
        resolve: `gatsby-source-git`,
        options: {
          name: `user--4--modules_report`,
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
          name: `user--4--share_draft_content`,
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
          name: `user--4--document_converter`,
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
          name: `user--4--ckan_registry`,
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
          name: `user--4--multi-factor_authentication`,
          remote: `https://github.com/silverstripe/silverstripe-mfa`,
          branch: `master`,
          patterns: `docs/en/userguide/**`        
        }
      }
];