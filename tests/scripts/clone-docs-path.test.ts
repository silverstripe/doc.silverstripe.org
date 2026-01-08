import path from 'path';

/**
 * Mock implementation of buildRepoConfig from clone-docs.mjs
 * This replicates the path construction logic to validate context-specific outputs
 */
function buildRepoConfig(sourceConfig: any, version: string): any {
  const { remote, branch, patterns, name, docsPath } = sourceConfig.options;

  // Extract context from name (e.g., "docs--6" or "user--6" -> "docs" or "user")
  const contextMatch = name.match(/^(docs|user)--/);
  const context = contextMatch ? contextMatch[1] : 'docs';

  // Determine output directory based on name
  // name format: "docs--6" or "docs--6--optional_features/linkfield"
  // Parts are separated by -- and / (forward slash is used in optional feature names)
  let relPath;

  if (name.includes('optional_features')) {
    // Extract the optional feature path after '{context}--{version}--'
    const prefix = `${context}--${version}--`;
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
    docsPath: docsPath || 'en',
  };
}

/**
 * Mock temp clone directory construction
 */
function buildTempClonePath(
  repoName: string,
  branch: string
): string {
  const rootDir = '/mock/root';
  return path.join(rootDir, '.cache', 'temp-clones', `${repoName}--${branch}`);
}

describe('clone-docs.mjs path construction', () => {
  describe('buildRepoConfig output paths', () => {
    it('returns correct output path for docs context (main docs)', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '6',
          patterns: 'en/**',
          name: 'docs--6',
          docsPath: 'en',
        },
      };

      const config = buildRepoConfig(sourceConfig, '6');

      expect(config.outputDir).toBe('/mock/root/.cache/docs/v6');
    });

    it('returns correct output path for user context (main docs)', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-userhelp.git',
          branch: '6',
          patterns: 'docs/en/**',
          name: 'user--6',
          docsPath: 'docs/en',
        },
      };

      const config = buildRepoConfig(sourceConfig, '6');

      expect(config.outputDir).toBe('/mock/root/.cache/user/v6');
    });

    it('returns correct output path for optional features with docs context', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
          branch: '1.5',
          patterns: 'docs/en/**',
          name: 'docs--6--optional_features/linkfield',
          docsPath: 'docs/en',
        },
      };

      const config = buildRepoConfig(sourceConfig, '6');

      expect(config.outputDir).toBe('/mock/root/.cache/docs/v6/optional_features/linkfield');
    });

    it('returns correct output path for optional features with user context', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
          branch: '1.5',
          patterns: 'docs/en/userguide/**',
          name: 'user--6--optional_features/linkfield',
          docsPath: 'docs/en/userguide',
        },
      };

      const config = buildRepoConfig(sourceConfig, '6');

      expect(config.outputDir).toBe('/mock/root/.cache/user/v6/optional_features/linkfield');
    });

    it('works with version 5', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '5',
          patterns: 'en/**',
          name: 'docs--5',
          docsPath: 'en',
        },
      };

      const config = buildRepoConfig(sourceConfig, '5');

      expect(config.outputDir).toBe('/mock/root/.cache/docs/v5');
    });

    it('extracts context from source name', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '6',
          patterns: 'en/**',
          name: 'docs--6',
          docsPath: 'en',
        },
      };

      const config = buildRepoConfig(sourceConfig, '6');

      expect(config.outputDir).toContain('/.cache/docs/v6');
    });

    it('extracts user context from source name', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-userhelp.git',
          branch: '6',
          patterns: 'docs/en/**',
          name: 'user--6',
          docsPath: 'docs/en',
        },
      };

      const config = buildRepoConfig(sourceConfig, '6');

      expect(config.outputDir).toContain('/.cache/user/v6');
    });

    it('preserves docsPath in returned config', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
          branch: '1.5',
          patterns: 'docs/en/userguide/**',
          name: 'user--6--optional_features/linkfield',
          docsPath: 'docs/en/userguide',
        },
      };

      const config = buildRepoConfig(sourceConfig, '6');

      expect(config.docsPath).toBe('docs/en/userguide');
    });
  });

  describe('temp clone path construction', () => {
    it('creates temp path without context', () => {
      const tempPath = buildTempClonePath('silverstripe-cms', '6');

      expect(tempPath).toBe('/mock/root/.cache/temp-clones/silverstripe-cms--6');
    });

    it('creates separate temp paths for different branches', () => {
      const path1 = buildTempClonePath('silverstripe-cms', '6');
      const path2 = buildTempClonePath('silverstripe-cms', '5');

      expect(path1).not.toBe(path2);
    });

    it('creates separate temp paths for different repositories', () => {
      const path1 = buildTempClonePath('silverstripe-cms', '6');
      const path2 = buildTempClonePath('silverstripe-linkfield', '6');

      expect(path1).not.toBe(path2);
    });
  });

  describe('context extraction from source name', () => {
    it('correctly identifies docs context from source name', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '6',
          patterns: 'en/**',
          name: 'docs--6',
          docsPath: 'en',
        },
      };

      const config = buildRepoConfig(sourceConfig, '6');

      expect(config.outputDir).toContain('/.cache/docs/v6');
    });

    it('correctly identifies user context from source name', () => {
      const sourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-userhelp.git',
          branch: '6',
          patterns: 'docs/en/**',
          name: 'user--6',
          docsPath: 'docs/en',
        },
      };

      const config = buildRepoConfig(sourceConfig, '6');

      expect(config.outputDir).toContain('/.cache/user/v6');
    });

    it('correctly identifies context in optional feature names', () => {
      const docsConfig = buildRepoConfig({
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
          branch: '1.5',
          patterns: 'docs/en/**',
          name: 'docs--6--optional_features/linkfield',
          docsPath: 'docs/en',
        },
      }, '6');

      const userConfig = buildRepoConfig({
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-linkfield.git',
          branch: '1.5',
          patterns: 'docs/en/userguide/**',
          name: 'user--6--optional_features/linkfield',
          docsPath: 'docs/en/userguide',
        },
      }, '6');

      expect(docsConfig.outputDir).toContain('/.cache/docs/v6/optional_features/linkfield');
      expect(userConfig.outputDir).toContain('/.cache/user/v6/optional_features/linkfield');
    });
  });

  describe('path isolation between contexts', () => {
    it('ensures docs and user contexts have separate cache directories', () => {
      const docsSourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-cms.git',
          branch: '6',
          patterns: 'en/**',
          name: 'docs--6',
          docsPath: 'en',
        },
      };

      const userSourceConfig = {
        options: {
          remote: 'https://github.com/silverstripe/silverstripe-userhelp.git',
          branch: '6',
          patterns: 'docs/en/**',
          name: 'user--6',
          docsPath: 'docs/en',
        },
      };

      const docsConfig = buildRepoConfig(docsSourceConfig, '6');
      const userConfig = buildRepoConfig(userSourceConfig, '6');

      expect(docsConfig.outputDir).toContain('/.cache/docs/v6');
      expect(userConfig.outputDir).toContain('/.cache/user/v6');
      expect(docsConfig.outputDir).not.toEqual(userConfig.outputDir);
    });
  });
});
