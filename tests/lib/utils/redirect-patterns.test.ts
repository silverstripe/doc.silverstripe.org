import { matchRedirectPattern } from '@/lib/utils/redirect-patterns';

describe('matchRedirectPattern', () => {
  const DEFAULT_VERSION = '6';

  // Pattern 1: /en/slug-path -> /en/{version}/slug-path
  describe('Pattern 1: /en/slug-path (missing version after /en/)', () => {
    it('should redirect /en/getting-started to /en/6/getting-started', () => {
      const result = matchRedirectPattern('/en/getting-started', DEFAULT_VERSION);
      expect(result).toBe('/en/6/getting-started');
    });

    it('should not redirect /en/6/getting-started (already has version)', () => {
      const result = matchRedirectPattern('/en/6/getting-started', DEFAULT_VERSION);
      expect(result).toBeNull();
    });

    it('should handle /en/some/nested/path', () => {
      const result = matchRedirectPattern('/en/some/nested/path', DEFAULT_VERSION);
      expect(result).toBe('/en/6/some/nested/path');
    });
  });

  // Pattern 2: /slug-path -> /en/{version}/slug-path
  describe('Pattern 2: /slug-path (missing /en/ prefix)', () => {
    it('should redirect /getting-started to /en/6/getting-started', () => {
      const result = matchRedirectPattern('/getting-started', DEFAULT_VERSION);
      expect(result).toBe('/en/6/getting-started');
    });

    it('should handle /some/nested/path', () => {
      const result = matchRedirectPattern('/some/nested/path', DEFAULT_VERSION);
      expect(result).toBe('/en/6/some/nested/path');
    });
  });

  // Pattern 3: /{version}/slug-path -> /en/{version}/slug-path
  describe('Pattern 3: /{version}/slug-path (missing /en/ prefix with version)', () => {
    it('should redirect /6/getting-started to /en/6/getting-started', () => {
      const result = matchRedirectPattern('/6/getting-started', DEFAULT_VERSION);
      expect(result).toBe('/en/6/getting-started');
    });

    it('should redirect /5/api-docs to /en/5/api-docs', () => {
      const result = matchRedirectPattern('/5/api-docs', DEFAULT_VERSION);
      expect(result).toBe('/en/5/api-docs');
    });

    it('should handle /3/some/nested/path', () => {
      const result = matchRedirectPattern('/3/some/nested/path', DEFAULT_VERSION);
      expect(result).toBe('/en/3/some/nested/path');
    });
  });

  // No match cases
  describe('No match cases', () => {
    it('should return null for /en/', () => {
      const result = matchRedirectPattern('/en/', DEFAULT_VERSION);
      expect(result).toBeNull();
    });

    it('should return null for /', () => {
      const result = matchRedirectPattern('/', DEFAULT_VERSION);
      expect(result).toBeNull();
    });

    it('should return null for /en/6/ (already has version prefix)', () => {
      const result = matchRedirectPattern('/en/6/', DEFAULT_VERSION);
      expect(result).toBeNull();
    });

    it('should return null for /en/5/api-docs (already has version prefix)', () => {
      const result = matchRedirectPattern('/en/5/api-docs', DEFAULT_VERSION);
      expect(result).toBeNull();
    });
  });

  // Different default versions
  describe('Different default versions', () => {
    it('should use provided default version', () => {
      const result = matchRedirectPattern('/getting-started', '5');
      expect(result).toBe('/en/5/getting-started');
    });

    it('should use provided default version in Pattern 1', () => {
      const result = matchRedirectPattern('/en/getting-started', '4');
      expect(result).toBe('/en/4/getting-started');
    });
  });
});
