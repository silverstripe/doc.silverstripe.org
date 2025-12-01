/**
 * Source configuration mapping for user help GitHub repositories
 * Maps doc version and optional feature to repository and branch information
 * Branch versions match the actual git branches content is cloned from
 * Used for: npm run build:user and EditOnGithub links
 */

export interface SourceConfig {
  repo: string;
  owner: string;
  branch: string;
  docsPath?: string; // e.g., 'docs/en'
}

type SourcesMap = {
  [version: string]: {
    main: SourceConfig;
    optionalFeatures?: {
      [featureName: string]: SourceConfig;
    };
  };
};

const SOURCES: SourcesMap = {
  '6': {
    main: {
      repo: 'silverstripe-userhelp-content',
      owner: 'silverstripe',
      branch: '6',
      docsPath: 'docs/en'
    },
    optionalFeatures: {
      'linkfield': {
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '5',
        docsPath: 'docs/en/userguide'
      },
      'advancedworkflow': {
        repo: 'silverstripe-advancedworkflow',
        owner: 'symbiote',
        branch: '5',
        docsPath: 'docs/en/userguide'
      },
      'userforms': {
        repo: 'silverstripe-userforms',
        owner: 'silverstripe',
        branch: '7',
        docsPath: 'docs/en/userguide'
      },
      'taxonomies': {
        repo: 'silverstripe-taxonomy',
        owner: 'silverstripe',
        branch: '4',
        docsPath: 'docs/en/userguide'
      },
      'elemental': {
        repo: 'silverstripe-elemental',
        owner: 'dnadesign',
        branch: '6',
        docsPath: 'docs/en/userguide'
      },
      'sharedraftcontent': {
        repo: 'silverstripe-sharedraftcontent',
        owner: 'silverstripe',
        branch: '4',
        docsPath: 'docs/en/userguide'
      },
      'mfa': {
        repo: 'silverstripe-mfa',
        owner: 'silverstripe',
        branch: '6',
        docsPath: 'docs/en/userguide'
      },
      'session-manager': {
        repo: 'silverstripe-session-manager',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
    }
  },
  '5': {
    main: {
      repo: 'silverstripe-userhelp-content',
      owner: 'silverstripe',
      branch: '5',
      docsPath: 'docs/en'
    },
    optionalFeatures: {
      'linkfield': {
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '4',
        docsPath: 'docs/en/userguide'
      },
      'advancedworkflow': {
        repo: 'silverstripe-advancedworkflow',
        owner: 'symbiote',
        branch: '6',
        docsPath: 'docs/en/userguide'
      },
      'registry': {
        repo: 'silverstripe-registry',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'contentreview': {
        repo: 'silverstripe-contentreview',
        owner: 'silverstripe',
        branch: '5',
        docsPath: 'docs/en/userguide'
      },
      'blog': {
        repo: 'silverstripe-blog',
        owner: 'silverstripe',
        branch: '4',
        docsPath: 'docs/en/userguide'
      },
      'userforms': {
        repo: 'silverstripe-userforms',
        owner: 'silverstripe',
        branch: '6',
        docsPath: 'docs/en/userguide'
      },
      'subsites': {
        repo: 'silverstripe-subsites',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'taxonomies': {
        repo: 'silverstripe-taxonomy',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'iframe': {
        repo: 'silverstripe-iframe',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'versionfeed': {
        repo: 'silverstripe-versionfeed',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'elemental': {
        repo: 'silverstripe-elemental',
        owner: 'dnadesign',
        branch: '5',
        docsPath: 'docs/en/userguide'
      },
      'maintenance': {
        repo: 'silverstripe-maintenance',
        owner: 'bringyourownideas',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'sharedraftcontent': {
        repo: 'silverstripe-sharedraftcontent',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'documentconverter': {
        repo: 'silverstripe-documentconverter',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'ckan-registry': {
        repo: 'silverstripe-ckan-registry',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'mfa': {
        repo: 'silverstripe-mfa',
        owner: 'silverstripe',
        branch: '5',
        docsPath: 'docs/en/userguide'
      },
      'securityreport': {
        repo: 'silverstripe-securityreport',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'sitewidecontent-report': {
        repo: 'silverstripe-sitewidecontent-report',
        owner: 'silverstripe',
        branch: '4',
        docsPath: 'docs/en/userguide'
      },
      'session-manager': {
        repo: 'silverstripe-session-manager',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
    }
  },
  '4': {
    main: {
      repo: 'silverstripe-userhelp-content',
      owner: 'silverstripe',
      branch: '4',
      docsPath: 'docs/en'
    },
    optionalFeatures: {
      'advancedworkflow': {
        repo: 'silverstripe-advancedworkflow',
        owner: 'symbiote',
        branch: '5',
        docsPath: 'docs/en/userguide'
      },
      'registry': {
        repo: 'silverstripe-registry',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'contentreview': {
        repo: 'silverstripe-contentreview',
        owner: 'silverstripe',
        branch: '4',
        docsPath: 'docs/en/userguide'
      },
      'blog': {
        repo: 'silverstripe-blog',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'userforms': {
        repo: 'silverstripe-userforms',
        owner: 'silverstripe',
        branch: '5',
        docsPath: 'docs/en/userguide'
      },
      'subsites': {
        repo: 'silverstripe-subsites',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'taxonomies': {
        repo: 'silverstripe-taxonomy',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'iframe': {
        repo: 'silverstripe-iframe',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'versionfeed': {
        repo: 'silverstripe-versionfeed',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'elemental': {
        repo: 'silverstripe-elemental',
        owner: 'dnadesign',
        branch: '4',
        docsPath: 'docs/en/userguide'
      },
      'maintenance': {
        repo: 'silverstripe-maintenance',
        owner: 'bringyourownideas',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'sharedraftcontent': {
        repo: 'silverstripe-sharedraftcontent',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'documentconverter': {
        repo: 'silverstripe-documentconverter',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'ckan-registry': {
        repo: 'silverstripe-ckan-registry',
        owner: 'silverstripe',
        branch: '1',
        docsPath: 'docs/en/userguide'
      },
      'mfa': {
        repo: 'silverstripe-mfa',
        owner: 'silverstripe',
        branch: '4',
        docsPath: 'docs/en/userguide'
      },
      'securityreport': {
        repo: 'silverstripe-securityreport',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'sitewidecontent-report': {
        repo: 'silverstripe-sitewidecontent-report',
        owner: 'silverstripe',
        branch: '3',
        docsPath: 'docs/en/userguide'
      },
      'session-manager': {
        repo: 'silverstripe-session-manager',
        owner: 'silverstripe',
        branch: '1',
        docsPath: 'docs/en/userguide'
      },
    }
  },
  '3': {
    main: {
      repo: 'silverstripe-userhelp-content',
      owner: 'silverstripe',
      branch: '3',
      docsPath: 'docs/en'
    },
    optionalFeatures: {
      'versionedfiles': {
        repo: 'silverstripe-versionedfiles',
        owner: 'symbiote',
        branch: 'master',
        docsPath: 'docs/en/userguide'
      },
      'advancedworkflow': {
        repo: 'silverstripe-advancedworkflow',
        owner: 'symbiote',
        branch: '4',
        docsPath: 'docs/en/userguide'
      },
      'registry': {
        repo: 'silverstripe-registry',
        owner: 'silverstripe',
        branch: '1.0',
        docsPath: 'docs/en/userguide'
      },
      'forum': {
        repo: 'silverstripe-forum',
        owner: 'silverstripe-archive',
        branch: '0.8',
        docsPath: 'docs/en/userguide'
      },
      'blog': {
        repo: 'silverstripe-blog',
        owner: 'silverstripe',
        branch: '2',
        docsPath: 'docs/en/userguide'
      },
      'translatable': {
        repo: 'silverstripe-translatable',
        owner: 'silverstripe',
        branch: '2.1',
        docsPath: 'docs/en/userguide'
      },
      'subsites': {
        repo: 'silverstripe-subsites',
        owner: 'silverstripe',
        branch: '1.1',
        docsPath: 'docs/en/userguide'
      },
      'secureassets': {
        repo: 'silverstripe-secureassets',
        owner: 'silverstripe',
        branch: 'master',
        docsPath: 'docs/en/userguide'
      },
      'taxonomies': {
        repo: 'silverstripe-taxonomy',
        owner: 'silverstripe',
        branch: '1',
        docsPath: 'docs/en/userguide'
      },
      'iframe': {
        repo: 'silverstripe-iframe',
        owner: 'silverstripe',
        branch: '1.0',
        docsPath: 'docs/en/userguide'
      },
      'versionfeed': {
        repo: 'silverstripe-versionfeed',
        owner: 'silverstripe',
        branch: 'master',
        docsPath: 'docs/en/userguide'
      },
      'dms': {
        repo: 'silverstripe-dms',
        owner: 'silverstripe',
        branch: 'master',
        docsPath: 'docs/en/userguide'
      },
      'securityreport': {
        repo: 'silverstripe-securityreport',
        owner: 'silverstripe',
        branch: 'master',
        docsPath: 'docs/en/userguide'
      },
      'sitewidecontent-report': {
        repo: 'silverstripe-sitewidecontent-report',
        owner: 'silverstripe',
        branch: '2.0',
        docsPath: 'docs/en/userguide'
      },
    }
  }
};

/**
 * Get source configuration for a specific version and optional feature
 */
export function getSourceConfig(
  version: string,
  optionalFeature?: string
): SourceConfig | null {
  const versionConfig = SOURCES[version];
  if (!versionConfig) {
    return null;
  }

  if (optionalFeature && versionConfig.optionalFeatures) {
    return versionConfig.optionalFeatures[optionalFeature] || null;
  }

  return versionConfig.main;
}

/**
 * Build GitHub edit URL for a user help document
 */
export function buildGithubEditUrl(
  version: string,
  filePath: string,
  optionalFeature?: string
): string {
  const config = getSourceConfig(version, optionalFeature);
  if (!config) {
    return '#'; // Fallback if config not found
  }

  // Clean file path - remove leading/trailing slashes, normalize separators
  let cleanPath = filePath.replace(/^\/+|\/+$/g, '').replace(/\\/g, '/');

  // For user help, docsPath is typically 'docs/en' or 'docs/en/userguide'
  if (config.docsPath) {
    cleanPath = `${config.docsPath}/${cleanPath}`;
  }

  const url = `https://github.com/${config.owner}/${config.repo}/blob/${config.branch}/${cleanPath}`;
  return url;
}
