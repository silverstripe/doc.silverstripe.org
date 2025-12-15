/**
 * Tests for sources-loader.mjs
 * Verifies that source configurations are correctly loaded from TypeScript files
 */

import { execSync } from 'child_process';
import path from 'path';

const rootDir = path.resolve(__dirname, '../..');

describe('sources-loader', () => {
  // Helper to run a Node script and get JSON output
  function runLoader(script: string): unknown {
    const result = execSync(`node -e "${script}"`, {
      cwd: rootDir,
      encoding: 'utf-8',
    });
    return JSON.parse(result.trim());
  }

  describe('loadSources', () => {
    it('should load sources for docs context', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        console.log(JSON.stringify(loadSources('docs')));
      `;
      const sources = runLoader(script) as Record<string, { main: { branch: string } }>;
      expect(sources).toBeDefined();
      expect(sources['6']).toBeDefined();
      expect(sources['6'].main).toBeDefined();
      expect(sources['6'].main.branch).toBe('6.1');
    });

    it('should load sources for user context', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        console.log(JSON.stringify(loadSources('user')));
      `;
      const sources = runLoader(script) as Record<string, { main: { branch: string } }>;
      expect(sources).toBeDefined();
      expect(sources['6']).toBeDefined();
      expect(sources['6'].main).toBeDefined();
      expect(sources['6'].main.branch).toBe('6');
    });

    it('should include all versions (3, 4, 5, 6) for docs', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        console.log(JSON.stringify(Object.keys(loadSources('docs'))));
      `;
      const versions = runLoader(script) as string[];
      expect(versions).toContain('3');
      expect(versions).toContain('4');
      expect(versions).toContain('5');
      expect(versions).toContain('6');
    });

    it('should include all versions (3, 4, 5, 6) for user', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        console.log(JSON.stringify(Object.keys(loadSources('user'))));
      `;
      const versions = runLoader(script) as string[];
      expect(versions).toContain('3');
      expect(versions).toContain('4');
      expect(versions).toContain('5');
      expect(versions).toContain('6');
    });
  });

  describe('branch matching with sources-docs.ts', () => {
    it('should have matching main branches for docs', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('docs');
        console.log(JSON.stringify({
          v3: sources['3'].main.branch,
          v4: sources['4'].main.branch,
          v5: sources['5'].main.branch,
          v6: sources['6'].main.branch
        }));
      `;
      const branches = runLoader(script) as Record<string, string>;
      expect(branches.v3).toBe('3');
      expect(branches.v4).toBe('4.13');
      expect(branches.v5).toBe('5.4');
      expect(branches.v6).toBe('6.1');
    });

    it('should include optional features for docs v6', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('docs');
        console.log(JSON.stringify(Object.keys(sources['6'].optionalFeatures || {})));
      `;
      const features = runLoader(script) as string[];
      expect(features).toContain('linkfield');
      expect(features).toContain('elemental');
      expect(features).toContain('mfa');
    });
  });

  describe('branch matching with sources-user.ts', () => {
    it('should have matching main branches for user', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('user');
        console.log(JSON.stringify({
          v3: sources['3'].main.branch,
          v4: sources['4'].main.branch,
          v5: sources['5'].main.branch,
          v6: sources['6'].main.branch
        }));
      `;
      const branches = runLoader(script) as Record<string, string>;
      expect(branches.v3).toBe('3');
      expect(branches.v4).toBe('4');
      expect(branches.v5).toBe('5');
      expect(branches.v6).toBe('6');
    });

    it('should include optional features for user v5', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('user');
        console.log(JSON.stringify(Object.keys(sources['5'].optionalFeatures || {})));
      `;
      const features = runLoader(script) as string[];
      expect(features).toContain('linkfield');
      expect(features).toContain('userforms');
      expect(features).toContain('blog');
    });
  });

  describe('docsPath configuration', () => {
    it('should include docsPath for docs main entries', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('docs');
        console.log(JSON.stringify(sources['6'].main.docsPath));
      `;
      const docsPath = runLoader(script) as string;
      expect(docsPath).toBe('en');
    });

    it('should include docsPath for user main entries', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('user');
        console.log(JSON.stringify(sources['6'].main.docsPath));
      `;
      const docsPath = runLoader(script) as string;
      expect(docsPath).toBe('docs/en');
    });

    it('should include docsPath for optional features', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('docs');
        console.log(JSON.stringify(sources['6'].optionalFeatures['linkfield'].docsPath));
      `;
      const docsPath = runLoader(script) as string;
      expect(docsPath).toBe('docs/en');
    });
  });

  describe('excludePath configuration', () => {
    it('should include excludePath for docs optional features with userguide', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('docs');
        console.log(JSON.stringify(sources['6'].optionalFeatures['mfa'].excludePath));
      `;
      const excludePath = runLoader(script) as string;
      expect(excludePath).toBe('docs/en/userguide');
    });

    it('should not have excludePath for user optional features', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('user');
        const excludePath = sources['6'].optionalFeatures['mfa'].excludePath;
        console.log(JSON.stringify(excludePath === undefined ? null : excludePath));
      `;
      const excludePath = runLoader(script) as string | null;
      expect(excludePath).toBeNull();
    });

    it('should include excludePath for all docs v6 optional features', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('docs');
        const features = sources['6'].optionalFeatures;
        const hasExcludePath = Object.keys(features).every(key => features[key].excludePath === 'docs/en/userguide');
        console.log(JSON.stringify(hasExcludePath));
      `;
      const hasExcludePath = runLoader(script) as boolean;
      expect(hasExcludePath).toBe(true);
    });

    it('should include excludePath for all docs v5 optional features', () => {
      const script = `
        import { loadSources } from './scripts/sources-loader.mjs';
        const sources = loadSources('docs');
        const features = sources['5'].optionalFeatures;
        const hasExcludePath = Object.keys(features).every(key => features[key].excludePath === 'docs/en/userguide');
        console.log(JSON.stringify(hasExcludePath));
      `;
      const hasExcludePath = runLoader(script) as boolean;
      expect(hasExcludePath).toBe(true);
    });
  });
});
