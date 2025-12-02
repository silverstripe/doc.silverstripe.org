import { escapeHtml } from '../escape-html';

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('AT&T')).toBe('AT&amp;T');
  });

  it('escapes less than', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater than', () => {
    expect(escapeHtml('5 > 3')).toBe('5 &gt; 3');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('Say "hello"')).toBe('Say &quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("It's a test")).toBe('It&#39;s a test');
  });

  it('escapes multiple special characters', () => {
    expect(escapeHtml('<div class="test" data-value=\'5 > 3 & 2\'>')).toBe(
      '&lt;div class=&quot;test&quot; data-value=&#39;5 &gt; 3 &amp; 2&#39;&gt;',
    );
  });

  it('returns empty string unchanged', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('handles text with no special characters', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });
});
