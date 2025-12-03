import { parseFrontmatter, validateFrontmatter } from '@/lib/content/frontmatter';

describe('frontmatter', () => {
  describe('parseFrontmatter', () => {
    it('extracts frontmatter from markdown', () => {
      const content = `---
title: "Test Title"
summary: "Test summary"
---

# Markdown content
This is the content.`;

      const result = parseFrontmatter(content);

      expect(result.data.title).toBe('Test Title');
      expect(result.data.summary).toBe('Test summary');
      expect(result.content).toContain('# Markdown content');
    });

    it('handles all supported frontmatter fields', () => {
      const content = `---
title: "Full Example"
summary: "A summary"
introduction: "An intro"
icon: "file"
iconBrand: "silverstripe"
hideChildren: true
hideSelf: false
unhideSelf: true
---

Content here`;

      const result = parseFrontmatter(content);

      expect(result.data.title).toBe('Full Example');
      expect(result.data.summary).toBe('A summary');
      expect(result.data.introduction).toBe('An intro');
      expect(result.data.icon).toBe('file');
      expect(result.data.iconBrand).toBe('silverstripe');
      expect(result.data.hideChildren).toBe(true);
      expect(result.data.hideSelf).toBe(false);
      expect(result.data.unhideSelf).toBe(true);
    });

    it('handles missing frontmatter', () => {
      const content = `# Just markdown
No frontmatter here`;

      const result = parseFrontmatter(content);

      expect(result.data).toBeDefined();
      expect(result.content).toContain('# Just markdown');
    });

    it('preserves markdown content correctly', () => {
      const markdown = `# Heading

Some content with [links](http://example.com)

\`\`\`js
const code = true;
\`\`\``;

      const content = `---
title: "Test"
---

${markdown}`;

      const result = parseFrontmatter(content);

      expect(result.content).toContain('# Heading');
      expect(result.content).toContain('[links](http://example.com)');
      expect(result.content).toContain('const code = true;');
    });
  });

  describe('validateFrontmatter', () => {
    it('converts string values correctly', () => {
      const data = {
        title: 'Test',
        summary: 'Summary',
        icon: 'file',
      };

      const result = validateFrontmatter(data);

      expect(typeof result.title).toBe('string');
      expect(typeof result.summary).toBe('string');
      expect(typeof result.icon).toBe('string');
    });

    it('converts boolean values', () => {
      const data = {
        hideChildren: 'true',
        hideSelf: false,
      };

      const result = validateFrontmatter(data);

      expect(result.hideChildren).toBe(true);
      expect(result.hideSelf).toBe(false);
    });

    it('removes undefined values', () => {
      const data = {
        title: 'Test',
        summary: undefined,
      };

      const result = validateFrontmatter(data);

      expect(result.title).toBe('Test');
      expect('summary' in result).toBe(false);
    });

    it('sets defaults for boolean fields', () => {
      const data = {};

      const result = validateFrontmatter(data);

      expect(result.hideChildren).toBe(false);
      expect(result.hideSelf).toBe(false);
    });

    it('handles extra unknown fields gracefully', () => {
      const data = {
        title: 'Test',
        customField: 'value',
        unknownProp: true,
      };

      const result = validateFrontmatter(data);

      expect(result.title).toBe('Test');
      // Unknown fields should still be in the object due to [key: string]: any
      expect(result.customField).toBe('value');
    });
  });
});
