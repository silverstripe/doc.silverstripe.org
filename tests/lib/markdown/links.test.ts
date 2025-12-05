describe('markdown link rewriting', () => {
  let markdownToHtml: typeof import('@/lib/markdown/processor').markdownToHtml;

  beforeAll(async () => {
    const processor = await import('@/lib/markdown/processor');
    markdownToHtml = processor.markdownToHtml;
  });

  describe('relative .md links are converted to URLs', () => {
    it('converts a simple .md link to proper URL', async () => {
      const markdown = 'See the [Security](./04_security.md) section for more details.';
      const filePath = '/home/project/.cache/docs/v6/optional_features/advancedworkflow/01_adding-workflows.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="/en/6/optional_features/advancedworkflow/security/"');
      expect(html).not.toContain('.md');
    });

    it('converts parent directory .md links', async () => {
      const markdown = 'See the [parent page](../index.md).';
      const filePath = '/home/project/.cache/docs/v6/optional_features/advancedworkflow/01_adding-workflows.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="/en/6/optional_features/"');
    });

    it('preserves non-.md links', async () => {
      const markdown = 'Visit [example](https://example.com) for more.';
      const filePath = '/home/project/.cache/docs/v6/01_getting_started/index.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="https://example.com"');
    });

    it('preserves anchor links', async () => {
      const markdown = 'Jump to [section](#my-section).';
      const filePath = '/home/project/.cache/docs/v6/01_getting_started/index.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="#my-section"');
    });

    it('handles multiple .md links in one document', async () => {
      const markdown = `
Check [getting started](../01_getting_started.md) and [other](./02_other.md).
`;
      const filePath = '/home/project/.cache/docs/v6/01_introduction/index.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="/en/6/getting_started/"');
      expect(html).toContain('href="/en/6/introduction/other/"');
    });

    it('works without filePath (links preserved as-is)', async () => {
      const markdown = 'See [link](./file.md).';

      const html = await markdownToHtml(markdown, undefined, '6');

      // Without filePath, link should remain unchanged
      expect(html).toContain('href="./file.md"');
    });

    it('works without version (links preserved as-is)', async () => {
      const markdown = 'See [link](./file.md).';
      const filePath = '/home/project/.cache/docs/v6/01_getting_started/index.md';

      const html = await markdownToHtml(markdown, filePath);

      // Without version, link should remain unchanged
      expect(html).toContain('href="./file.md"');
    });

    it('converts root-relative links without .md extension', async () => {
      const markdown = 'Check the [request for comment](/project_governance/request_for_comment) section.';
      const filePath = '/home/project/.cache/docs/v6/01_getting_started/index.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="/en/6/project_governance/request_for_comment/"');
    });

    it('converts relative links without .md extension', async () => {
      const markdown = 'See the [code](./code) and [fixtures](../fixtures).';
      const filePath = '/home/project/.cache/docs/v6/10_contributing/01_Code.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="/en/6/contributing/code/"');
      expect(html).toContain('href="/en/6/fixtures/"');
    });

    it('converts parent directory links crossing sections without .md extension', async () => {
      const markdown = 'For testing details, see [unit testing guide](../developer_guides/testing/unit_testing).';
      const filePath = '/home/project/.cache/docs/v6/10_contributing/01_Code.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="/en/6/developer_guides/testing/unit_testing/"');
    });

    it('converts mixed case paths with anchors without .md extension', async () => {
      const markdown = 'See the [release policy](../Project_Governance/Minor_release_policy#section).';
      const filePath = '/home/project/.cache/docs/v6/10_contributing/01_Code.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="/en/6/project_governance/minor_release_policy/#section"');
    });

    it('handles multiple link types in one document', async () => {
      const markdown = `
Check these resources:
- [RFC](/project_governance/request_for_comment)
- [Tests](./testing.md)
- [Unit Testing Guide](../developer_guides/testing/unit_testing#overview)
- [External](https://example.com)
      `;
      const filePath = '/home/project/.cache/docs/v6/10_contributing/01_Code.md';

      const html = await markdownToHtml(markdown, filePath, '6');

      expect(html).toContain('href="/en/6/project_governance/request_for_comment/"');
      expect(html).toContain('href="/en/6/contributing/testing/"');
      expect(html).toContain('href="/en/6/developer_guides/testing/unit_testing/#overview"');
      expect(html).toContain('href="https://example.com"');
    });
  });
});
