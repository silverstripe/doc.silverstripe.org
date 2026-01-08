import jestConfig from '../jest.config.cjs';

describe('jest.config.cjs', () => {
  it('should export a valid Jest configuration', () => {
    expect(jestConfig).toBeDefined();
    expect(typeof jestConfig).toBe('object');
  });

  it('should have modulePathIgnorePatterns with .cache exclusion', () => {
    expect(jestConfig.modulePathIgnorePatterns).toBeDefined();
    expect(Array.isArray(jestConfig.modulePathIgnorePatterns)).toBe(true);
    expect(jestConfig.modulePathIgnorePatterns).toContain('<rootDir>/.cache');
  });

  it('should exclude cloned content from module path scanning', () => {
    const ignoredPaths = jestConfig.modulePathIgnorePatterns;
    expect(ignoredPaths.length).toBeGreaterThan(0);
    expect(ignoredPaths).toContain('<rootDir>/.cache');
  });

  it('should preserve other Jest configuration options', () => {
    expect(jestConfig.preset).toBe('ts-jest');
    expect(jestConfig.testEnvironment).toBe('jsdom');
    expect(jestConfig.extensionsToTreatAsEsm).toContain('.ts');
    expect(jestConfig.extensionsToTreatAsEsm).toContain('.tsx');
  });
});
