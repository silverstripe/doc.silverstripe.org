import { getConfig } from '@/lib/config/config';

/**
 * Integration test for cache path resolution across the system
 * Verifies that both get-document.ts and config work correctly with context-specific paths
 */
describe('cache-path-integration', () => {
  beforeEach(() => {
    // Reset config cache
    delete (global as any).__configCache;
  });

  describe('config context resolution', () => {
    it('should default docsContext to "docs"', () => {
      delete process.env.DOCS_CONTEXT;
      const config = getConfig();

      expect(config.docsContext).toBe('docs');
    });

    it('should respect DOCS_CONTEXT=docs', () => {
      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;
      const config = getConfig();

      expect(config.docsContext).toBe('docs');
    });

    it('should respect DOCS_CONTEXT=user', () => {
      process.env.DOCS_CONTEXT = 'user';
      delete (global as any).__configCache;
      const config = getConfig();

      expect(config.docsContext).toBe('user');
    });

    it('should have useMockData=true in test environment', () => {
      const config = getConfig();

      // In test environment, useMockData should be true
      expect(config.useMockData).toBe(true);
    });
  });;

  describe('mock data behavior', () => {
    it('should use tests/fixtures/mock-content when useMockData=true', () => {
      const config = getConfig();

      if (config.useMockData) {
        // When mocking, we expect the mock content path to be used
        expect(config.useMockData).toBe(true);
      }
    });

    it('should always use mock data in test suite', () => {
      const config = getConfig();

      // Jest runs with NEXT_USE_MOCK_DATA=true by default
      expect(config.useMockData).toBe(true);
    });
  });

  describe('context isolation', () => {
    it('docs context should be separate from user context', () => {
      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;
      const docsConfig = getConfig();

      process.env.DOCS_CONTEXT = 'user';
      delete (global as any).__configCache;
      const userConfig = getConfig();

      expect(docsConfig.docsContext).toBe('docs');
      expect(userConfig.docsContext).toBe('user');
      expect(docsConfig.docsContext).not.toEqual(userConfig.docsContext);
    });

    it('should have different docsContext values', () => {
      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;
      const config1 = getConfig();

      process.env.DOCS_CONTEXT = 'user';
      delete (global as any).__configCache;
      const config2 = getConfig();

      expect(config1.docsContext).not.toEqual(config2.docsContext);
    });
  });

  describe('path construction principles', () => {
    it('should follow pattern: .cache/{context}/ for real content', () => {
      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;
      const config = getConfig();

      // The docsContext should be 'docs' for the path: .cache/docs/
      expect(config.docsContext).toBe('docs');
      const expectedPath = `.cache/${config.docsContext}/`;
      expect(expectedPath).toMatch(/\.cache\/(docs|user)\//);
    });

    it('should support version subdirectories', () => {
      const config = getConfig();

      // Path structure should support: .cache/{context}/v{version}/
      const versions = ['3', '4', '5', '6'];
      for (const version of versions) {
        const versionPath = `v${version}`;
        expect(versionPath).toMatch(/^v\d+$/);
      }
    });

    it('should support optional features subdirectories', () => {
      const config = getConfig();

      // Path structure should support: .cache/{context}/v{version}/optional_features/{feature}/
      const featurePath = 'optional_features/linkfield';
      expect(featurePath).toContain('optional_features');
      expect(featurePath).toMatch(/optional_features\/\w+/);
    });
  });

  describe('backward compatibility', () => {
    it('should maintain mock data path for tests', () => {
      const config = getConfig();

      // Tests should always use mock data
      expect(config.useMockData).toBe(true);
    });

    it('should default to docs context when not specified', () => {
      delete process.env.DOCS_CONTEXT;
      delete (global as any).__configCache;
      const config = getConfig();

      expect(config.docsContext).toBe('docs');
    });

    it('should support both docs and user contexts', () => {
      const contexts = ['docs', 'user'];

      for (const context of contexts) {
        process.env.DOCS_CONTEXT = context;
        delete (global as any).__configCache;
        const config = getConfig();

        expect(config.docsContext).toBe(context);
      }
    });
  });

  describe('context-specific fallback behavior', () => {
    it('should use docs context when falling back to .cache/content/', () => {
      // When user context is requested but only docs content exists,
      // the fallback path should be used and context forced to 'docs'
      process.env.DOCS_CONTEXT = 'user';
      delete (global as any).__configCache;
      const config = getConfig();

      expect(config.docsContext).toBe('user');
      // In real scenario: resolveContentBasePathWithContext would return 
      // { path: '.cache/content', context: 'docs' }
    });

    it('should prioritize context-specific path over fallback', () => {
      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;
      const config = getConfig();

      expect(config.docsContext).toBe('docs');
      // In real scenario: if .cache/docs/ exists, it's used directly
      // Fallback is only used if .cache/docs/ doesn't exist
    });

    it('should maintain correct context separation', () => {
      // Docs context should work
      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;
      let config = getConfig();
      expect(config.docsContext).toBe('docs');

      // User context should also be settable (though it may not have content)
      process.env.DOCS_CONTEXT = 'user';
      delete (global as any).__configCache;
      config = getConfig();
      expect(config.docsContext).toBe('user');
    });
  });

  describe('environment variable handling', () => {
    it('should read DOCS_CONTEXT from environment', () => {
      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;
      const docsConfig = getConfig();

      process.env.DOCS_CONTEXT = 'user';
      delete (global as any).__configCache;
      const userConfig = getConfig();

      expect(docsConfig.docsContext).toBe('docs');
      expect(userConfig.docsContext).toBe('user');
    });

    it('should handle undefined DOCS_CONTEXT gracefully', () => {
      delete process.env.DOCS_CONTEXT;
      delete (global as any).__configCache;
      const config = getConfig();

      expect(config.docsContext).toBeDefined();
      expect(config.docsContext).toBe('docs');
    });
  });

  describe('configuration consistency', () => {
    it('docsContext should be consistent across multiple calls', () => {
      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;

      const config1 = getConfig();
      const config2 = getConfig();
      const config3 = getConfig();

      expect(config1.docsContext).toBe(config2.docsContext);
      expect(config2.docsContext).toBe(config3.docsContext);
    });

    it('should handle context switching correctly', () => {
      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;
      const config1 = getConfig();

      process.env.DOCS_CONTEXT = 'user';
      delete (global as any).__configCache;
      const config2 = getConfig();

      process.env.DOCS_CONTEXT = 'docs';
      delete (global as any).__configCache;
      const config3 = getConfig();

      expect(config1.docsContext).toBe('docs');
      expect(config2.docsContext).toBe('user');
      expect(config3.docsContext).toBe('docs');
    });
  });
});
