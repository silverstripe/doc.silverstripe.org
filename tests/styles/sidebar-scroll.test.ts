import fs from 'fs';
import path from 'path';

describe('Sidebar Scrollbar Visibility', () => {
  let docsLayoutCss: string;

  beforeAll(() => {
    const docsLayoutPath = path.join(
      __dirname,
      '../../src/components/DocsLayout.module.css'
    );
    docsLayoutCss = fs.readFileSync(docsLayoutPath, 'utf-8');
  });

  it('should use sticky positioning for sidebar container', () => {
    expect(docsLayoutCss).toMatch(/\.sidebarContainer\s*\{[\s\S]*?position:\s*sticky/);
  });

  it('should set top to header height variable', () => {
    expect(docsLayoutCss).toMatch(/\.sidebarContainer\s*\{[\s\S]*?top:\s*var\(--header-height\)/);
  });

  it('should use height with viewport calculation', () => {
    expect(docsLayoutCss).toMatch(/\.sidebarContainer\s*\{[\s\S]*?height:\s*calc\(100vh\s*-\s*var\(--header-height\)\)/);
  });

  it('should set overflow-y to auto', () => {
    expect(docsLayoutCss).toMatch(/\.sidebarContainer\s*\{[\s\S]*?overflow-y:\s*auto/);
  });

  it('should not use fixed height for desktop sidebar', () => {
    // Ensure old height property using 4rem is removed
    const desktopRule = docsLayoutCss.match(/\.sidebarContainer\s*\{[\s\S]*?\}/);
    expect(desktopRule).toBeTruthy();
    if (desktopRule) {
      expect(desktopRule[0]).not.toMatch(/height:\s*calc\(100vh\s*-\s*4rem\)/);
    }
  });

  it('should use fixed positioning in base sidebarContainer styles for mobile', () => {
    // Mobile uses position: fixed in base class; desktop overrides to sticky via nested media query
    expect(docsLayoutCss).toMatch(/\.sidebarContainer\s*\{[\s\S]*?position:\s*fixed/);
  });

  it('should use height with header-height variable in base sidebarContainer styles', () => {
    // Height is set in base class (not inside a media query)
    expect(docsLayoutCss).toMatch(/\.sidebarContainer\s*\{[\s\S]*?height:\s*calc\(100vh\s*-\s*var\(--header-height\)\)/);
  });

  it('should maintain border-right styling', () => {
    expect(docsLayoutCss).toMatch(/\.sidebarContainer\s*\{[\s\S]*?border-right:\s*0\.1rem solid var\(--theme-border\)/);
  });

  it('should maintain sidebar width', () => {
    const rule = docsLayoutCss.match(/\.sidebarContainer\s*\{[\s\S]*?\}/);
    expect(rule).toBeTruthy();
    if (rule) {
      expect(rule[0]).toMatch(/width:\s*30rem/);
    }
  });
});
