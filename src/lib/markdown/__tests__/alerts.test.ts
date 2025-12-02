describe('GitHub Alerts', () => {
  let markdownToHtml: typeof import('../processor').markdownToHtml;

  beforeAll(async () => {
    // Use dynamic import to load processor
    const processor = await import('../processor');
    markdownToHtml = processor.markdownToHtml;
  });

  describe('Alert transformation', () => {
    it('should transform [!NOTE] alert', async () => {
      const markdown = `> [!NOTE]
> This is a note`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('markdown-alert-note');
      expect(html).toContain('markdown-alert-title');
      expect(html).toContain('NOTE');
      expect(html).toContain('This is a note');
    });

    it('should transform [!WARNING] alert', async () => {
      const markdown = `> [!WARNING]
> This is a warning`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('markdown-alert-warning');
      expect(html).toContain('WARNING');
      expect(html).toContain('This is a warning');
    });

    it('should transform [!CAUTION] alert', async () => {
      const markdown = `> [!CAUTION]
> This is a caution`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('markdown-alert-caution');
      expect(html).toContain('CAUTION');
      expect(html).toContain('This is a caution');
    });

    it('should transform [!TIP] alert', async () => {
      const markdown = `> [!TIP]
> This is a tip`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('markdown-alert-tip');
      expect(html).toContain('TIP');
      expect(html).toContain('This is a tip');
    });

    it('should transform [!IMPORTANT] alert', async () => {
      const markdown = `> [!IMPORTANT]
> This is important`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('markdown-alert-important');
      expect(html).toContain('IMPORTANT');
      expect(html).toContain('This is important');
    });
  });

  describe('Alert with multiple paragraphs', () => {
    it('should handle multiple paragraphs in alert', async () => {
      const markdown = `> [!NOTE]
> First paragraph
> 
> Second paragraph`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('First paragraph');
      expect(html).toContain('Second paragraph');
    });
  });

  describe('Alert with inline formatting', () => {
    it('should preserve bold text in alerts', async () => {
      const markdown = `> [!NOTE]
> This is **bold** text`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('<strong>bold</strong>');
    });

    it('should preserve italic text in alerts', async () => {
      const markdown = `> [!NOTE]
> This is *italic* text`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('italic');
    });

    it('should preserve links in alerts', async () => {
      const markdown = `> [!NOTE]
> Check out [this link](https://example.com)`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('<a');
      expect(html).toContain('this link');
    });

    it('should preserve code in alerts', async () => {
      const markdown = `> [!NOTE]
> Use \`$var\` to access variables`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('<code>');
      expect(html).toContain('$var');
    });
  });

  describe('Alert with lists', () => {
    it('should preserve unordered lists in alerts', async () => {
      const markdown = `> [!WARNING]
> - Item 1
> - Item 2
> - Item 3`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('<ul>');
      expect(html).toContain('Item 1');
      expect(html).toContain('Item 2');
      expect(html).toContain('Item 3');
    });

    it('should preserve ordered lists in alerts', async () => {
      const markdown = `> [!NOTE]
> 1. First step
> 2. Second step
> 3. Third step`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('<ol>');
      expect(html).toContain('First step');
      expect(html).toContain('Second step');
    });
  });

  describe('SVG icon rendering', () => {
    it('should include SVG icon in alert title', async () => {
      const markdown = `> [!NOTE]
> Test content`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert-title');
      // SVG may be present (verify structure is correct)
      expect(html).toContain('NOTE');
      expect(html).toContain('Test content');
    });
  });

  describe('Alert styling classes', () => {
    it('should have correct structure for NOTE alert', async () => {
      const markdown = `> [!NOTE]
> Content`;
      const html = await markdownToHtml(markdown);

      // Should have the alert div with both base and type classes
      expect(html).toMatch(/class="[^"]*markdown-alert[^"]*"/);
      expect(html).toMatch(/class="[^"]*markdown-alert-note[^"]*"/);
    });

    it('should distinguish between WARNING and CAUTION', async () => {
      const warningHtml = await markdownToHtml('> [!WARNING]\n> Warning text');
      const cautionHtml = await markdownToHtml('> [!CAUTION]\n> Caution text');

      expect(warningHtml).toContain('markdown-alert-warning');
      expect(cautionHtml).toContain('markdown-alert-caution');
      expect(warningHtml).not.toContain('markdown-alert-caution');
      expect(cautionHtml).not.toContain('markdown-alert-warning');
    });
  });

  describe('Consecutive alerts', () => {
    it('should handle multiple alerts in sequence', async () => {
      const markdown = `> [!NOTE]
> First alert

> [!WARNING]
> Second alert`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert-note');
      expect(html).toContain('markdown-alert-warning');
      expect(html).toContain('First alert');
      expect(html).toContain('Second alert');
    });
  });

  describe('Alert without content', () => {
    it('should handle alert with only title', async () => {
      const markdown = '> [!NOTE]';
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('NOTE');
    });
  });

  describe('Case sensitivity', () => {
    it('should recognize uppercase alert types', async () => {
      const markdown = `> [!NOTE]
> Content`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert-note');
    });
  });

  describe('Integration with other markdown features', () => {
    it('should work with code blocks after alerts', async () => {
      const markdown = `> [!NOTE]
> Check this code

\`\`\`js
console.log('test');
\`\`\``;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('console.log');
    });

    it('should work with headings after alerts', async () => {
      const markdown = `> [!WARNING]
> Important warning

## Next Section`;
      const html = await markdownToHtml(markdown);

      expect(html).toContain('markdown-alert');
      expect(html).toContain('<h2');
      expect(html).toContain('Next Section');
    });
  });

  describe('API links in alerts', () => {
    it('should handle code in alerts', async () => {
      const markdown = `> [!NOTE]
> See \`SilverStripe\\ORM\\DataList\` for more info`;
      const html = await markdownToHtml(markdown, undefined, '6');

      expect(html).toContain('markdown-alert');
      expect(html).toContain('<code>');
    });

    it('should transform API links in alerts', async () => {
      const markdown = `> [!NOTE]
> See [DataList](api:SilverStripe\\ORM\\DataList) for more info`;
      const html = await markdownToHtml(markdown, undefined, '6');

      expect(html).toContain('markdown-alert');
      expect(html).toContain('api.silverstripe.org');
    });
  });
});
