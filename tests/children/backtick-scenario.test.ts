import { findChildrenMarkers } from '../../src/lib/children/parse-children-marker';

describe('Backtick scenario from documentation page', () => {
  it('should skip all markers in code tags (like in docs page)', () => {
    // This is what the HTML looks like after markdown conversion
    // All [CHILDREN] markers are wrapped in <code> tags
    const html = `<p>You can list child/sibling pages using the special <code>[CHILDREN]</code> syntax. By default these will render as cards with an icon, a title, and a summary if one is available.</p>

<ul>
<li><code>[CHILDREN Exclude="How_tos,01_Relations"]</code>: Exclude specific folders or files from the list. Note that folders don't need to be excluded unless the <code>includeFolders</code> modifier is also used.</li>
<li><code>[CHILDREN Only="rc,beta"]</code>: Only include the listed items. This is the inverse of the <code>Exclude</code> modifier.</li>
<li><code>[CHILDREN Folder="How_Tos"]</code>: List the children of the named folder, instead of the children of the <em>current</em> folder. This modifier only accepts a single folder as an argument.</li>
</ul>`;

    const markers = findChildrenMarkers(html);
    
    // All markers should be skipped because they're inside <code> tags
    expect(markers).toHaveLength(0);
  });

  it('should process markers that are NOT in code tags', () => {
    const html = `<p>Actual [CHILDREN] marker here</p>
<p>But <code>[CHILDREN Exclude="test"]</code> should be skipped</p>`;
    
    const markers = findChildrenMarkers(html);
    
    // Only the first marker should be found
    expect(markers).toHaveLength(1);
    expect(markers[0].marker).toBe('[CHILDREN]');
  });

  it('handles mixed scenario with code blocks and actual markers', () => {
    const html = `<p>Documentation shows <code>\`[CHILDREN Exclude="How_tos" asList includeFolders reverse]\`</code></p>
<h2>Example</h2>
<p>The example section uses [CHILDREN asList] to show children</p>
<pre><code class="language-text">[CHILDREN Folder="api"]</code></pre>
<p>And another [CHILDREN Exclude="private"] here</p>`;
    
    const markers = findChildrenMarkers(html);
    
    // Should find 2 markers: one on "example section" and one at "another"
    // The ones in <code> tags should be skipped
    expect(markers).toHaveLength(2);
    expect(markers[0].marker).toBe('[CHILDREN asList]');
    expect(markers[1].marker).toBe('[CHILDREN Exclude="private"]');
  });
});
