import fs from 'fs';
import path from 'path';

describe('Dark Mode Table Striping', () => {
  let globalsCss: string;

  beforeAll(() => {
    const globalsPath = path.join(
      __dirname,
      '../../src/app/globals.css'
    );
    globalsCss = fs.readFileSync(globalsPath, 'utf-8');
  });

  it('should have dark mode rule for table striping', () => {
    // Check for the dark mode table striping rule
    expect(globalsCss).toMatch(/:root\.dark table tbody tr:nth-child\(odd\)/);
  });

  it('should use low-contrast background for dark mode tables', () => {
    // Check for the specific rgba value for subtle contrast
    const darkModeTableRule = globalsCss.match(
      /:root\.dark table tbody tr:nth-child\(odd\)\s*\{([^}]+)\}/
    );
    expect(darkModeTableRule).toBeTruthy();
    if (darkModeTableRule) {
      // Verify the background-color uses rgba with low opacity
      expect(darkModeTableRule[1]).toMatch(/rgba\(255,\s*255,\s*255,\s*0\.03\)/);
    }
  });

  it('should still have light mode table striping rule', () => {
    // Ensure light mode rule is not removed
    expect(globalsCss).toMatch(/table tbody tr:nth-child\(odd\)\s*\{[\s\S]*?background-color:\s*#f5f5f5/);
  });

  it('dark mode rule should come after light mode rule', () => {
    const lightModeIndex = globalsCss.indexOf('table tbody tr:nth-child(odd)');
    const darkModeIndex = globalsCss.indexOf(':root.dark table tbody tr:nth-child(odd)');
    
    expect(lightModeIndex).toBeGreaterThanOrEqual(0);
    expect(darkModeIndex).toBeGreaterThan(lightModeIndex);
  });
});
