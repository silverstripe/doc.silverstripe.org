/**
 * Source configuration mapping for developer docs GitHub repositories
 * Maps doc version and optional feature to repository and branch information
 * Branch versions match the actual git branches docs are cloned from
 * Used for: npm run build:docs and EditOnGithub links
 */

export interface SourceConfig {
  repo: string;
  owner: string;
  branch: string;
  docsPath?: string; // e.g., 'en' or 'docs/en'
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
      repo: 'developer-docs',
      owner: 'silverstripe',
      branch: '6.1',
      docsPath: 'en'
    },
    optionalFeatures: {
      'login-forms': {
        repo: 'silverstripe-login-forms',
        owner: 'silverstripe',
        branch: '6.1',
        docsPath: 'docs/en'
      },
      'gridfieldextensions': {
        repo: 'silverstripe-gridfieldextensions',
        owner: 'silverstripe',
        branch: '5.1',
        docsPath: 'docs/en'
      },
      'gridfield-bulk-editing-tools': {
        repo: 'silverstripe-gridfield-bulk-editing-tools',
        owner: 'silverstripe',
        branch: '5.1',
        docsPath: 'docs/en'
      },
      'realme': {
        repo: 'silverstripe-realme',
        owner: 'silverstripe',
        branch: '6.0',
        docsPath: 'docs/en'
      },
      'staticpublishqueue': {
        repo: 'silverstripe-staticpublishqueue',
        owner: 'silverstripe',
        branch: '7.0',
        docsPath: 'docs/en'
      },
      'tagfield': {
        repo: 'silverstripe-tagfield',
        owner: 'silverstripe',
        branch: '4.1',
        docsPath: 'docs/en'
      },
      'textextraction': {
        repo: 'silverstripe-textextraction',
        owner: 'silverstripe',
        branch: '5.0',
        docsPath: 'docs/en'
      },
      'advancedworkflow': {
        repo: 'silverstripe-advancedworkflow',
        owner: 'silverstripe',
        branch: '7.1',
        docsPath: 'docs/en'
      },
      'queuedjobs': {
        repo: 'silverstripe-queuedjobs',
        owner: 'silverstripe',
        branch: '6.1',
        docsPath: 'docs/en'
      },
      'fluent': {
        repo: 'silverstripe-fluent',
        owner: 'tractorcow',
        branch: '8.1',
        docsPath: 'docs/en'
      },
      'htmleditor-tinymce': {
        repo: 'silverstripe-htmleditor-tinymce',
        owner: 'silverstripe',
        branch: '1.0',
        docsPath: 'docs/en'
      },
      'linkfield': {
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '5.1',
        docsPath: 'docs/en'
      },
      'userforms': {
        repo: 'silverstripe-userforms',
        owner: 'silverstripe',
        branch: '7.0',
        docsPath: 'docs/en'
      },
      'elemental': {
        repo: 'silverstripe-elemental',
        owner: 'silverstripe',
        branch: '6.1',
        docsPath: 'docs/en'
      },
      'mfa': {
        repo: 'silverstripe-mfa',
        owner: 'silverstripe',
        branch: '6.1',
        docsPath: 'docs/en'
      },
      'graphql': {
        repo: 'silverstripe-graphql',
        owner: 'silverstripe',
        branch: '6.1',
        docsPath: 'docs/en'
      },
      'totp-authenticator': {
        repo: 'silverstripe-totp-authenticator',
        owner: 'silverstripe',
        branch: '6.0',
        docsPath: 'docs/en'
      },
      'taxonomies': {
        repo: 'silverstripe-taxonomy',
        owner: 'silverstripe',
        branch: '4.1',
        docsPath: 'docs/en'
      },
    }
  },
  '5': {
    main: {
      repo: 'developer-docs',
      owner: 'silverstripe',
      branch: '5.4',
      docsPath: 'en'
    },
    optionalFeatures: {
      'login-forms': {
        repo: 'silverstripe-login-forms',
        owner: 'silverstripe',
        branch: '5.3',
        docsPath: 'docs/en'
      },
      'gridfieldextensions': {
        repo: 'silverstripe-gridfieldextensions',
        owner: 'silverstripe',
        branch: '4.1',
        docsPath: 'docs/en'
      },
      'gridfield-bulk-editing-tools': {
        repo: 'silverstripe-gridfield-bulk-editing-tools',
        owner: 'silverstripe',
        branch: '4.1',
        docsPath: 'docs/en'
      },
      'realme': {
        repo: 'silverstripe-realme',
        owner: 'silverstripe',
        branch: '5.5',
        docsPath: 'docs/en'
      },
      'staticpublishqueue': {
        repo: 'silverstripe-staticpublishqueue',
        owner: 'silverstripe',
        branch: '6.3',
        docsPath: 'docs/en'
      },
      'tagfield': {
        repo: 'silverstripe-tagfield',
        owner: 'silverstripe',
        branch: '3.4',
        docsPath: 'docs/en'
      },
      'textextraction': {
        repo: 'silverstripe-textextraction',
        owner: 'silverstripe',
        branch: '4.1',
        docsPath: 'docs/en'
      },
      'advancedworkflow': {
        repo: 'silverstripe-advancedworkflow',
        owner: 'silverstripe',
        branch: '6.4',
        docsPath: 'docs/en'
      },
      'queuedjobs': {
        repo: 'silverstripe-queuedjobs',
        owner: 'silverstripe',
        branch: '5.3',
        docsPath: 'docs/en'
      },
      'fluent': {
        repo: 'silverstripe-fluent',
        owner: 'tractorcow-farm',
        branch: '7.3',
        docsPath: 'docs/en'
      },
      'linkfield': {
        repo: 'silverstripe-linkfield',
        owner: 'silverstripe',
        branch: '4.2',
        docsPath: 'docs/en'
      },
      'userforms': {
        repo: 'silverstripe-userforms',
        owner: 'silverstripe',
        branch: '6.4',
        docsPath: 'docs/en'
      },
      'elemental': {
        repo: 'silverstripe-elemental',
        owner: 'silverstripe',
        branch: '5.4',
        docsPath: 'docs/en'
      },
      'mfa': {
        repo: 'silverstripe-mfa',
        owner: 'silverstripe',
        branch: '5.4',
        docsPath: 'docs/en'
      },
      'totp-authenticator': {
        repo: 'silverstripe-totp-authenticator',
        owner: 'silverstripe',
        branch: '5.3',
        docsPath: 'docs/en'
      },
      'webauthn-authenticator': {
        repo: 'silverstripe-webauthn-authenticator',
        owner: 'silverstripe',
        branch: '5.3',
        docsPath: 'docs/en'
      },
      'taxonomies': {
        repo: 'silverstripe-taxonomy',
        owner: 'silverstripe',
        branch: '3.2',
        docsPath: 'docs/en'
      },
      'non-blocking-sessions': {
        repo: 'silverstripe-non-blocking-sessions',
        owner: 'silverstripe',
        branch: '1.0',
        docsPath: 'docs/en'
      },
    }
  },
  '4': {
    main: {
      repo: 'developer-docs',
      owner: 'silverstripe',
      branch: '4.13',
      docsPath: 'en'
    }
  },
  '3': {
    main: {
      repo: 'developer-docs',
      owner: 'silverstripe',
      branch: '3',
      docsPath: 'en'
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
 * Build GitHub edit URL for a developer docs document
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

  // If this is from an optional feature, the filePath should be relative to docs/en
  if (optionalFeature && config.docsPath) {
    // Path is already relative to the clone directory, e.g., "index.md" or "01_Advanced/index.md"
    cleanPath = `${config.docsPath}/${cleanPath}`;
  } else if (!optionalFeature && config.docsPath) {
    // For main docs, path is relative to version dir, e.g., "01_Getting_Started/index.md"
    cleanPath = `${config.docsPath}/${cleanPath}`;
  }

  const url = `https://github.com/${config.owner}/${config.repo}/blob/${config.branch}/${cleanPath}`;
  return url;
}
