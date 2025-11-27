import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';

describe('SidebarScroll', () => {
  it('should have sidebarContainer with position: fixed', () => {
    const cssPath = path.join(__dirname, '../../src/components/DocsLayout.module.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    const sidebarRule = cssContent.match(/\.sidebarContainer\s*\{[\s\S]*?\}/);
    expect(sidebarRule).toBeDefined();
    expect(sidebarRule?.[0]).toContain('position: fixed');
  });

  it('should have sidebarContainer with overflow-y: auto for independent scrolling', () => {
    const cssPath = path.join(__dirname, '../../src/components/DocsLayout.module.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    const sidebarRule = cssContent.match(/\.sidebarContainer\s*\{[\s\S]*?\}/);
    expect(sidebarRule).toBeDefined();
    expect(sidebarRule?.[0]).toContain('overflow-y: auto');
  });

  it('should have fixed height matching viewport bounds', () => {
    const cssPath = path.join(__dirname, '../../src/components/DocsLayout.module.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    const sidebarRule = cssContent.match(/\.sidebarContainer\s*\{[\s\S]*?\}/);
    expect(sidebarRule).toBeDefined();
    expect(sidebarRule?.[0]).toContain('height: calc(100vh - 4rem)');
  });

  it('should have layout with left margin to accommodate fixed sidebar', () => {
    const cssPath = path.join(__dirname, '../../src/components/DocsLayout.module.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    const layoutRule = cssContent.match(/\.layout\s*\{[\s\S]*?\}/);
    expect(layoutRule).toBeDefined();
    expect(layoutRule?.[0]).toContain('margin-left: calc(var(--sidebar-width) + 2rem)');
  });

  it('sidebar should be positioned at top: 2rem', () => {
    const cssPath = path.join(__dirname, '../../src/components/DocsLayout.module.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    const sidebarRule = cssContent.match(/\.sidebarContainer\s*\{[\s\S]*?\}/);
    expect(sidebarRule).toBeDefined();
    expect(sidebarRule?.[0]).toContain('top: 2rem');
  });
});
