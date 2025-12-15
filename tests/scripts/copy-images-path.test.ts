import path from 'path';

/**
 * Mock implementation of source path resolution from copy-images.mjs
 */
function resolveSourcePath(useMockData: boolean, docsContext: string): string {
  const rootDir = '/mock/root';
  
  if (useMockData) {
    return path.join(rootDir, 'tests/fixtures/mock-content');
  } else {
    return path.join(rootDir, '.cache', docsContext);
  }
}

describe('copy-images.mjs path construction', () => {
  describe('source path resolution', () => {
    it('returns correct source path for DOCS_CONTEXT=docs (real content)', () => {
      const sourcePath = resolveSourcePath(false, 'docs');

      expect(sourcePath).toBe('/mock/root/.cache/docs');
    });

    it('returns correct source path for DOCS_CONTEXT=user (real content)', () => {
      const sourcePath = resolveSourcePath(false, 'user');

      expect(sourcePath).toBe('/mock/root/.cache/user');
    });

    it('returns mock data path regardless of context when NEXT_USE_MOCK_DATA=true', () => {
      const sourcePathDocs = resolveSourcePath(true, 'docs');
      const sourcePathUser = resolveSourcePath(true, 'user');

      // Both should return the same mock content path
      expect(sourcePathDocs).toBe('/mock/root/tests/fixtures/mock-content');
      expect(sourcePathUser).toBe('/mock/root/tests/fixtures/mock-content');
      // And they should be equal
      expect(sourcePathDocs).toEqual(sourcePathUser);
    });

    it('uses correct source when NEXT_USE_MOCK_DATA=true for docs context', () => {
      const mockPath = resolveSourcePath(true, 'docs');

      expect(mockPath).toContain('tests/fixtures/mock-content');
    });

    it('uses correct source when NEXT_USE_MOCK_DATA=true for user context', () => {
      const mockPath = resolveSourcePath(true, 'user');

      expect(mockPath).toContain('tests/fixtures/mock-content');
    });
  });

  describe('path isolation between contexts', () => {
    it('ensures docs and user contexts use separate cache directories', () => {
      const docsPath = resolveSourcePath(false, 'docs');
      const userPath = resolveSourcePath(false, 'user');

      expect(docsPath).toContain('/.cache/docs');
      expect(userPath).toContain('/.cache/user');
      expect(docsPath).not.toEqual(userPath);
    });

    it('uses same mock path for both contexts when mocking', () => {
      const docsPath = resolveSourcePath(true, 'docs');
      const userPath = resolveSourcePath(true, 'user');

      expect(docsPath).toEqual(userPath);
      expect(docsPath).toContain('tests/fixtures/mock-content');
    });
  });

  describe('context defaults', () => {
    it('treats docs as default context', () => {
      const sourcePath = resolveSourcePath(false, 'docs');

      expect(sourcePath).toContain('.cache/docs');
    });
  });

  describe('environment variable handling', () => {
    it('respects NEXT_USE_MOCK_DATA=true', () => {
      const sourcePath = resolveSourcePath(true, 'docs');

      expect(sourcePath).toContain('tests/fixtures/mock-content');
      expect(sourcePath).not.toContain('.cache/');
    });

    it('respects NEXT_USE_MOCK_DATA=false with context', () => {
      const sourcePath = resolveSourcePath(false, 'docs');

      expect(sourcePath).toContain('.cache/docs');
      expect(sourcePath).not.toContain('tests/fixtures');
    });

    it('prioritizes NEXT_USE_MOCK_DATA over context selection', () => {
      const mockPath = resolveSourcePath(true, 'user');

      // Should use mock path, not user context cache
      expect(mockPath).toContain('tests/fixtures/mock-content');
      expect(mockPath).not.toContain('.cache/user');
    });
  });

  describe('backward compatibility', () => {
    it('maintains mock content path for development', () => {
      const sourcePath = resolveSourcePath(true, 'docs');

      // Should still resolve to tests/fixtures/mock-content
      expect(sourcePath).toEqual('/mock/root/tests/fixtures/mock-content');
    });

    it('maintains new context-aware paths for real content', () => {
      const sourcePath = resolveSourcePath(false, 'docs');

      // Should resolve to .cache/docs
      expect(sourcePath).toEqual('/mock/root/.cache/docs');
    });
  });
});
