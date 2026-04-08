import fs from 'fs';
import path from 'path';

describe('Dark Mode Table Striping', () => {
  let markdownContentCss: string;
  let variablesCss: string;

  beforeAll(() => {
    markdownContentCss = fs.readFileSync(
      path.join(__dirname, '../../src/components/MarkdownContent.module.css'),
      'utf-8',
    );
    variablesCss = fs.readFileSync(
      path.join(__dirname, '../../src/styles/variables.css'),
      'utf-8',
    );
  });

  describe('table striping rule (MarkdownContent.module.css)', () => {
    it('should have dark mode rule for table striping using nth-child', () => {
      expect(markdownContentCss).toMatch(/tbody\s+tr:nth-child/);
    });

    it('should use --theme-table-bg-light variable for striped row background', () => {
      expect(markdownContentCss).toMatch(
        /tbody\s+tr:nth-child[\s\S]*?background-color:\s*var\(--theme-table-bg-light\)/,
      );
    });

    it('should use --theme-bg-grey for code inside striped rows', () => {
      expect(markdownContentCss).toMatch(
        /tbody\s+tr:nth-child[\s\S]*?code\s*\{[\s\S]*?background-color:\s*var\(--theme-bg-grey\)/,
      );
    });

    it('should stripe odd rows (2n+1 pattern)', () => {
      expect(markdownContentCss).toMatch(/tbody\s+tr:nth-child\(2n\+1\)/);
    });
  });

  describe('table background CSS variable (variables.css)', () => {
    it('should define --theme-table-bg-light in light mode', () => {
      expect(variablesCss).toMatch(/--theme-table-bg-light:\s*var\(--color-blue-grey-10\)/);
    });

    it('should define --theme-table-bg-light in dark mode with grey value', () => {
      expect(variablesCss).toMatch(
        /\.dark:root\s*\{[\s\S]*?--theme-table-bg-light:\s*var\(--color-grey-70\)/,
      );
    });

    it('should define dark mode table background after light mode', () => {
      const lightIndex = variablesCss.indexOf('--theme-table-bg-light: var(--color-blue-grey-10)');
      const darkIndex = variablesCss.indexOf('--theme-table-bg-light: var(--color-grey-70)');

      expect(lightIndex).toBeGreaterThanOrEqual(0);
      expect(darkIndex).toBeGreaterThan(lightIndex);
    });
  });

  describe('table structure rules (global.css)', () => {
    let globalsCss: string;

    beforeAll(() => {
      globalsCss = fs.readFileSync(
        path.join(__dirname, '../../src/styles/global.css'),
        'utf-8',
      );
    });

    it('should have table border-collapse rule', () => {
      expect(globalsCss).toMatch(/table\s*\{[\s\S]*?border-collapse:\s*collapse/);
    });

    it('should have table td vertical-align rule', () => {
      expect(globalsCss).toMatch(/td\s*\{[\s\S]*?vertical-align:\s*top/);
    });
  });
});
