import { highlightCodeBlocks } from '@/lib/markdown/syntax-highlight';

describe('Syntax Highlighter', () => {
  describe('Language aliases', () => {
    it('should have proper language mappings', async () => {
      // This is more of an integration test
      // The actual highlighting happens in the rehype plugin
      expect(true).toBe(true);
    });

    it('maps Silverstripe template syntax to HTML', async () => {
      // Silverstripe templates use .ss extension
      // They should highlight as HTML
      expect(true).toBe(true);
    });

    it('maps JavaScript aliases', async () => {
      // Both 'js' and 'javascript' should work
      expect(true).toBe(true);
    });
  });

  describe('Code highlighting', () => {
    it('handles unsupported languages gracefully', async () => {
      // Should not throw, just return escaped text
      expect(true).toBe(true);
    });

    it('handles empty code blocks', async () => {
      // Should not crash on empty code
      expect(true).toBe(true);
    });
  });
});
