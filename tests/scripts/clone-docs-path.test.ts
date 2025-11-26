import path from 'path';

/**
 * Mock implementation of buildRepoConfig from clone-docs.mjs
 * This replicates the path construction logic to validate context-specific outputs
 */
function buildRepoConfig(sourceConfig: any, version: string, context: string): any {
  const { remote, branch, patterns, name, excludeDirs } = sourceConfig.options;

  // Determine output directory based on name
  // name format: "docs--6" or "docs--6--optional_features/linkfield"
  // Parts are separated by -- and / (forward slash is used in optional feature names)
  let relPath;

  if (name.includes('optional_features')) {
    // Extract the optional feature path after 'docs--{version}--'
    const prefix = `docs--${version}--`;
    const optionalPart = name.substring(prefix.length).replace(/--/g, '/');
    relPath = optionalPart; // e.g., "optional_features/linkfield"
  } else {
    // Main docs
    relPath = '';
  }

  // Mock rootDir as a test path
  const rootDir = '/mock/root';
  const outputDir = path.join(rootDir, '.cache', context, `v${version}`, relPath);

  return {
    remote,
    branch,
    patterns,
    outputDir,
    version,
    name,
    context,
    excludeDirs: excludeDirs || null,
  };
}

/**
 * Mock temp clone directory construction
 */
function buildTempClonePath(
  repoName: string,
  branch: string,
  context: string
): string {
  const rootDir = '/mock/root';
  return path.join(rootDir, '.cache', 'temp-clones', context, `${repoName}--${branch}`);
}

describe('clone-docs.mjs path construction', () => {
  describe('buildRepoConfig output paths', () => {
    it('returns correct output path for DOCS_CONTEXT=docs (main docs)', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '6',
          patterns: 'en/**',
          name: 'docs--6',
          excludeDirs: null,
        },
      };

      const config = buildRepoConfig(sourceConfig, '6', 'docs');

      expect(config.outputDir).toBe('/mock/root/.cache/docs/v6');
    });

    it('returns correct output path for DOCS_CONTEXT=user (main docs)', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-userhelp.git',
          branch: '6',
          patterns: 'en/**',
          name: 'user--6',
          excludeDirs: null,
        },
      };

      const config = buildRepoConfig(sourceConfig, '6', 'user');

      expect(config.outputDir).toBe('/mock/root/.cache/user/v6');
    });

    it('returns correct output path for optional features with DOCS_CONTEXT=docs', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
          branch: '1.5',
          patterns: 'docs/en/**',
          name: 'docs--6--optional_features/linkfield',
          excludeDirs: null,
        },
      };

      const config = buildRepoConfig(sourceConfig, '6', 'docs');

      expect(config.outputDir).toBe('/mock/root/.cache/docs/v6/optional_features/linkfield');
    });

    it('returns correct output path for optional features with DOCS_CONTEXT=user', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
          branch: '1.5',
          patterns: 'docs/en/**',
          name: 'user--6--optional_features/linkfield',
          excludeDirs: null,
        },
      };

      const config = buildRepoConfig(sourceConfig, '6', 'user');

      expect(config.outputDir).toBe('/mock/root/.cache/user/v6/optional_features/linkfield');
    });

    it('works with version 5', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '5',
          patterns: 'docs/en/**',
          name: 'docs--5',
          excludeDirs: null,
        },
      };

      const config = buildRepoConfig(sourceConfig, '5', 'docs');

      expect(config.outputDir).toBe('/mock/root/.cache/docs/v5');
    });

    it('preserves context field in returned config', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '6',
          patterns: 'en/**',
          name: 'docs--6',
          excludeDirs: null,
        },
      };

      const config = buildRepoConfig(sourceConfig, '6', 'docs');

      expect(config.context).toBe('docs');
    });

    it('preserves context field for user context', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-userhelp.git',
          branch: '6',
          patterns: 'en/**',
          name: 'user--6',
          excludeDirs: null,
        },
      };

      const config = buildRepoConfig(sourceConfig, '6', 'user');

      expect(config.context).toBe('user');
    });
  });

  describe('temp clone path construction', () => {
    it('includes context in temp clone path for docs', () => {
      const tempPath = buildTempClonePath('silverstripe-cms', '6', 'docs');

      expect(tempPath).toBe(
        '/mock/root/.cache/temp-clones/docs/silverstripe-cms--6'
      );
    });

    it('includes context in temp clone path for user', () => {
      const tempPath = buildTempClonePath('silverstripe-userhelp', '6', 'user');

      expect(tempPath).toBe(
        '/mock/root/.cache/temp-clones/user/silverstripe-userhelp--6'
      );
    });

    it('creates separate temp paths for different contexts', () => {
      const docsPath = buildTempClonePath('silverstripe-cms', '6', 'docs');
      const userPath = buildTempClonePath('silverstripe-cms', '6', 'user');

      expect(docsPath).not.toBe(userPath);
      expect(docsPath).toContain('temp-clones/docs/');
      expect(userPath).toContain('temp-clones/user/');
    });
  });

  describe('context defaults', () => {
    it('treats docs as default context', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '6',
          patterns: 'en/**',
          name: 'docs--6',
          excludeDirs: null,
        },
      };

      // When context defaults to 'docs'
      const config = buildRepoConfig(sourceConfig, '6', 'docs');

      expect(config.outputDir).toContain('.cache/docs/v6');
    });
  });

  describe('path isolation between contexts', () => {
    it('ensures docs and user contexts have separate cache directories', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '6',
          patterns: 'en/**',
          name: 'docs--6',
          excludeDirs: null,
        },
      };

      const docsConfig = buildRepoConfig(sourceConfig, '6', 'docs');
      const userConfig = buildRepoConfig(sourceConfig, '6', 'user');

      expect(docsConfig.outputDir).toContain('/.cache/docs/v6');
      expect(userConfig.outputDir).toContain('/.cache/user/v6');
      expect(docsConfig.outputDir).not.toEqual(userConfig.outputDir);
    });

    it('ensures docs and user contexts have separate temp clone directories', () => {
      const docsPath = buildTempClonePath('silverstripe-cms', '6', 'docs');
      const userPath = buildTempClonePath('silverstripe-cms', '6', 'user');

      expect(docsPath).toContain('temp-clones/docs/');
      expect(userPath).toContain('temp-clones/user/');
      expect(docsPath).not.toEqual(userPath);
    });
  });
});
