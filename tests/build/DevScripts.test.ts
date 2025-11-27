/**
 * Tests to verify dev scripts include image copying
 */

import fs from 'fs';
import path from 'path';

describe('DevScripts', () => {
  let packageJson: any;

  beforeAll(() => {
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(content);
  });

  it('should verify dev:docs includes copy-images:docs', () => {
    const devDocsScript = packageJson.scripts['dev:docs'];
    expect(devDocsScript).toBeDefined();
    expect(devDocsScript).toContain('copy-images:docs');
    expect(devDocsScript).toContain('DOCS_CONTEXT=docs');
    expect(devDocsScript).toContain('next dev');
  });

  it('should verify dev:user includes copy-images:user', () => {
    const devUserScript = packageJson.scripts['dev:user'];
    expect(devUserScript).toBeDefined();
    expect(devUserScript).toContain('copy-images:user');
    expect(devUserScript).toContain('DOCS_CONTEXT=user');
    expect(devUserScript).toContain('next dev');
  });

  it('should verify dev is alias for dev:docs', () => {
    const devScript = packageJson.scripts.dev;
    const devDocsScript = packageJson.scripts['dev:docs'];
    expect(devScript).toBe(devDocsScript);
  });

  it('should verify copy-images:docs script exists', () => {
    const copyImagesDocsScript = packageJson.scripts['copy-images:docs'];
    expect(copyImagesDocsScript).toBeDefined();
    expect(copyImagesDocsScript).toContain('copy-images.mjs');
  });

  it('should verify copy-images:user script exists', () => {
    const copyImagesUserScript = packageJson.scripts['copy-images:user'];
    expect(copyImagesUserScript).toBeDefined();
    expect(copyImagesUserScript).toContain('copy-images.mjs');
  });

  it('should verify copy-images:mock script exists', () => {
    const copyImagesMockScript = packageJson.scripts['copy-images:mock'];
    expect(copyImagesMockScript).toBeDefined();
    expect(copyImagesMockScript).toContain('copy-images.mjs');
  });

  it('should verify mock script includes copy-images:mock', () => {
    const mockScript = packageJson.scripts.mock;
    expect(mockScript).toBeDefined();
    expect(mockScript).toContain('copy-images:mock');
    expect(mockScript).toContain('NEXT_USE_MOCK_DATA=true');
    expect(mockScript).toContain('next dev');
  });

  it('should verify build:docs includes copy-images:docs', () => {
    const buildDocsScript = packageJson.scripts['build:docs'];
    expect(buildDocsScript).toBeDefined();
    expect(buildDocsScript).toContain('copy-images:docs');
    expect(buildDocsScript).toContain('clone:docs');
    expect(buildDocsScript).toContain('next build');
  });

  it('should verify build:user includes copy-images:user', () => {
    const buildUserScript = packageJson.scripts['build:user'];
    expect(buildUserScript).toBeDefined();
    expect(buildUserScript).toContain('copy-images:user');
    expect(buildUserScript).toContain('clone:user');
    expect(buildUserScript).toContain('next build');
  });
});
