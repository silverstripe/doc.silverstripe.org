import fs from 'fs';
import path from 'path';

/**
 * Get available mock data versions by scanning tests/fixtures/mock-content/
 * Returns an array of version strings (e.g., ['3', '4', '5', '6', '7'])
 */
export function getAvailableMockVersions(): string[] {
  const mockContentPath = path.join(process.cwd(), 'tests', 'fixtures', 'mock-content');
  
  try {
    const entries = fs.readdirSync(mockContentPath, { withFileTypes: true });
    const versions = entries
      .filter(entry => entry.isDirectory() && entry.name.startsWith('v'))
      .map(entry => entry.name.substring(1)) // Remove 'v' prefix
      .sort(); // Ensure consistent ordering
    
    return versions;
  } catch (error) {
    // If directory doesn't exist or can't be read, return empty array
    return [];
  }
}
