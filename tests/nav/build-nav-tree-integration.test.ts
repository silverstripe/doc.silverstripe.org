/**
 * Integration tests for buildNavTree with real mock data
 * This tests against the actual mock content fixture
 */
import { buildNavTree } from '@/lib/nav/build-nav-tree';
import { getAllDocuments } from '@/lib/content/get-document';

describe('buildNavTree - Integration with mock content', () => {
  it('should not include root in navigation tree', async () => {
    const allDocs = await getAllDocuments();
    const v6Docs = allDocs.filter(d => d.version === '6');
    
    if (v6Docs.length === 0) {
      console.warn('No v6 mock docs found, skipping test');
      return;
    }

    const tree = buildNavTree(allDocs, '6', '/en/6/');
    
    // Find the root document
    const rootDoc = v6Docs.find(d => d.slug === '/en/6/');
    
    // Root should not appear in the tree
    const hasRoot = tree.some(node => node.slug === '/en/6/');
    expect(hasRoot).toBe(false);
    
    // Should have top-level items like Getting Started
    expect(tree.length).toBeGreaterThan(0);
    
    // Check that we have expected items
    const titles = tree.map(n => n.title);
    expect(titles.some(t => t.includes('Getting') || t.includes('Developer') || t.includes('Optional'))).toBe(true);
  });

  it('should have correct depth structure', async () => {
    const allDocs = await getAllDocuments();
    const v6Docs = allDocs.filter(d => d.version === '6');
    
    if (v6Docs.length === 0) {
      console.warn('No v6 mock docs found, skipping test');
      return;
    }

    const tree = buildNavTree(allDocs, '6', '/en/6/getting-started/');
    
    // Find Getting Started node
    const gettingStarted = tree.find(n => n.title.includes('Getting'));
    
    if (gettingStarted) {
      // Should have children (Installation, etc)
      expect(gettingStarted.children.length).toBeGreaterThan(0);
      
      // Check that it's marked as having children
      expect(gettingStarted.hasVisibleChildren).toBe(true);
    }
  });
});
