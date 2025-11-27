import * as fs from 'fs';
import * as path from 'path';

describe('Build Scripts', () => {
  let packageJson: { scripts: Record<string, string> };

  beforeAll(() => {
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(content);
  });

  describe('build:user script', () => {
    it('should set DOCS_CONTEXT=user for the entire build chain including next build', () => {
      const script = packageJson.scripts['build:user'];
      expect(script).toBeDefined();
      
      // The script should wrap the entire chain with DOCS_CONTEXT=user
      // Pattern: DOCS_CONTEXT=user sh -c '...'
      expect(script).toMatch(/^DOCS_CONTEXT=user\s+sh\s+-c\s+'/);
      expect(script).toContain('next build');
    });

    it('should include clone:user step', () => {
      const script = packageJson.scripts['build:user'];
      expect(script).toContain('clone:user');
    });

    it('should include copy-images:user step', () => {
      const script = packageJson.scripts['build:user'];
      expect(script).toContain('copy-images:user');
    });
  });

  describe('build:docs script', () => {
    it('should set DOCS_CONTEXT=docs for the entire build chain including next build', () => {
      const script = packageJson.scripts['build:docs'];
      expect(script).toBeDefined();
      
      // The script should wrap the entire chain with DOCS_CONTEXT=docs
      // Pattern: DOCS_CONTEXT=docs sh -c '...'
      expect(script).toMatch(/^DOCS_CONTEXT=docs\s+sh\s+-c\s+'/);
      expect(script).toContain('next build');
    });

    it('should include clone:docs step', () => {
      const script = packageJson.scripts['build:docs'];
      expect(script).toContain('clone:docs');
    });

    it('should include copy-images:docs step', () => {
      const script = packageJson.scripts['build:docs'];
      expect(script).toContain('copy-images:docs');
    });
  });

  describe('script consistency', () => {
    it('should have both build:docs and build:user scripts defined', () => {
      expect(packageJson.scripts['build:docs']).toBeDefined();
      expect(packageJson.scripts['build:user']).toBeDefined();
    });

    it('should use parallel structure for docs and user builds', () => {
      const docsScript = packageJson.scripts['build:docs'];
      const userScript = packageJson.scripts['build:user'];
      
      // Both should follow same pattern, just with docs/user swapped
      expect(docsScript.replace(/docs/g, 'user')).toBe(userScript);
    });
  });
});
