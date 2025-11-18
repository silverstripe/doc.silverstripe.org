import { rewriteApiLinksInHtml } from '../rewrite-api-links-html';

describe('rewriteApiLinksInHtml', () => {
  it('should rewrite simple API links in HTML', () => {
    const html = '<a href="api:SilverStripe\\ORM\\DataList">DataList</a>';
    const result = rewriteApiLinksInHtml(html, '6');
    expect(result).toContain('href="https://api.silverstripe.org/search/lookup?q=');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('should handle method calls in API links', () => {
    const html = '<a href="api:SilverStripe\\ORM\\DataList::filter()">filter method</a>';
    const result = rewriteApiLinksInHtml(html, '6');
    expect(result).toContain('::filter()');
    expect(result).toContain('target="_blank"');
  });

  it('should handle property access in API links', () => {
    const html = '<a href="api:SilverStripe\\CMS\\Model\\SiteTree->enforce_strict_hierarchy">property</a>';
    const result = rewriteApiLinksInHtml(html, '6');
    expect(result).toContain('->enforce_strict_hierarchy');
    expect(result).toContain('target="_blank"');
  });

  it('should handle multiple API links in HTML', () => {
    const html = '<a href="api:DataList">DataList</a> and <a href="api:DataObject">DataObject</a>';
    const result = rewriteApiLinksInHtml(html, '6');
    const matches = result.match(/target="_blank"/g);
    expect(matches).toHaveLength(2);
  });

  it('should not modify non-API links', () => {
    const html = '<a href="https://example.com">Example</a>';
    const result = rewriteApiLinksInHtml(html, '6');
    expect(result).toBe(html);
  });

  it('should use the provided version parameter', () => {
    const html = '<a href="api:DataList">DataList</a>';
    const result = rewriteApiLinksInHtml(html, '5');
    expect(result).toContain('&version=5');
  });

  it('should handle mixed links', () => {
    const html = '<p><a href="api:DataList">API</a> and <a href="https://example.com">Regular</a></p>';
    const result = rewriteApiLinksInHtml(html, '6');
    expect(result).toContain('https://api.silverstripe.org');
    expect(result).toContain('https://example.com">Regular</a>');
  });

  it('should handle nested HTML with API links', () => {
    const html = '<div><p><a href="api:DataList">link</a></p></div>';
    const result = rewriteApiLinksInHtml(html, '6');
    expect(result).toContain('https://api.silverstripe.org/search/lookup');
  });

  it('should preserve other link attributes', () => {
    const html = '<a class="custom" href="api:DataList">link</a>';
    const result = rewriteApiLinksInHtml(html, '6');
    expect(result).toContain('class="custom"');
    expect(result).toContain('href="https://api.silverstripe.org');
  });

  it('should encode special characters properly', () => {
    const html = '<a href="api:SilverStripe\\ORM\\DataList">link</a>';
    const result = rewriteApiLinksInHtml(html, '6');
    expect(result).toContain('%5C'); // backslash encoding
  });
});
