import { getAvailableMockVersions } from './mock-versions';
import fs from 'fs';
import path from 'path';

describe('getAvailableMockVersions', () => {
  it('should return an array of version strings', () => {
    const versions = getAvailableMockVersions();
    expect(Array.isArray(versions)).toBe(true);
    expect(versions.length).toBeGreaterThan(0);
  });

  it('should return versions without the "v" prefix', () => {
    const versions = getAvailableMockVersions();
    versions.forEach(version => {
      expect(version).not.toMatch(/^v/);
      expect(version).toMatch(/^\d+$/);
    });
  });

  it('should return versions in sorted order', () => {
    const versions = getAvailableMockVersions();
    const sorted = [...versions].sort();
    expect(versions).toEqual(sorted);
  });

  it('should match actual directory structure', () => {
    const mockContentPath = path.join(process.cwd(), 'tests', 'fixtures', 'mock-content');
    const entries = fs.readdirSync(mockContentPath, { withFileTypes: true });
    const expectedVersions = entries
      .filter(entry => entry.isDirectory() && entry.name.startsWith('v'))
      .map(entry => entry.name.substring(1))
      .sort();

    const versions = getAvailableMockVersions();
    expect(versions).toEqual(expectedVersions);
  });

  it('should return empty array if directory does not exist', () => {
    const originalReaddir = fs.readdirSync;
    jest.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('Directory not found');
    });

    const versions = getAvailableMockVersions();
    expect(versions).toEqual([]);

    (fs.readdirSync as jest.Mock).mockRestore();
  });
});
