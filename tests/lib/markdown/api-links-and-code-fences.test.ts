import { cleanApiTags } from '@/lib/markdown/api-links';
import { rewriteApiLinksInHtml } from '@/lib/markdown/rewrite-api-links-html';

describe('API Links and Code Fences Processing', () => {
  describe('API Links - cleanApiTags', () => {
    it('should convert shorthand API links to markdown links', () => {
      const markdown = 'See [api:SilverStripe\\ORM\\DataObject] for info.';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('[SilverStripe\\ORM\\DataObject](api:SilverStripe\\ORM\\DataObject)');
    });

    it('should handle method API links', () => {
      const markdown = 'Use [api:SilverStripe\\ORM\\DataList::filter()] to filter.';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('[SilverStripe\\ORM\\DataList::filter()](api:SilverStripe\\ORM\\DataList::filter())');
    });

    it('should handle property API links', () => {
      const markdown = 'Set [api:SilverStripe\\CMS\\Model\\SiteTree->enforce_strict_hierarchy] option.';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('[SilverStripe\\CMS\\Model\\SiteTree->enforce_strict_hierarchy](api:SilverStripe\\CMS\\Model\\SiteTree->enforce_strict_hierarchy)');
    });

    it('should handle multiple API links in same document', () => {
      const markdown = 'Use [api:DataList] and [api:DataObject] together.';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('[DataList](api:DataList)');
      expect(result).toContain('[DataObject](api:DataObject)');
    });

    it('should not double-process already converted links', () => {
      const markdown = '[SilverStripe\\ORM\\DataObject](api:SilverStripe\\ORM\\DataObject)';
      const result = cleanApiTags(markdown);
      
      expect(result).toBe(markdown);
    });

    it('should handle nested namespaces', () => {
      const markdown = 'Use [api:SilverStripe\\StaticPublishQueue\\Job\\GenerateStaticCacheJob] here.';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('[SilverStripe\\StaticPublishQueue\\Job\\GenerateStaticCacheJob](api:SilverStripe\\StaticPublishQueue\\Job\\GenerateStaticCacheJob)');
    });

    it('should handle interface links', () => {
      const markdown = 'Implement [api:SilverStripe\\StaticPublishQueue\\Contract\\StaticallyPublishable].';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('(api:SilverStripe\\StaticPublishQueue\\Contract\\StaticallyPublishable)');
    });
  });

  describe('API Links - rewriteApiLinksInHtml', () => {
    it('should rewrite API links in HTML to api.silverstripe.org URLs', () => {
      const html = '<a href="api:SilverStripe\\ORM\\DataObject">DataObject</a>';
      const result = rewriteApiLinksInHtml(html, '6');
      
      expect(result).toContain('https://api.silverstripe.org/search/lookup?q=');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it('should use version parameter in API links', () => {
      const html = '<a href="api:DataObject">DataObject</a>';
      const result = rewriteApiLinksInHtml(html, '5');
      
      expect(result).toContain('&version=5');
    });

    it('should handle method links', () => {
      const html = '<a href="api:SilverStripe\\ORM\\DataList::filter()">filter</a>';
      const result = rewriteApiLinksInHtml(html, '6');
      
      expect(result).toContain('::filter');
    });

    it('should handle multiple API links', () => {
      const html = '<a href="api:DataList">DataList</a> and <a href="api:DataObject">DataObject</a>';
      const result = rewriteApiLinksInHtml(html, '6');
      
      const linkMatches = result.match(/target="_blank"/g);
      expect(linkMatches?.length).toBe(2);
    });

    it('should not modify non-API links', () => {
      const html = '<a href="https://example.com">Example</a>';
      const result = rewriteApiLinksInHtml(html, '6');
      
      expect(result).toBe(html);
    });
  });

  describe('Full Workflow', () => {
    it('should clean and rewrite API links together', () => {
      const markdown = 'See [api:SilverStripe\\ORM\\DataObject] for info.';
      const cleaned = cleanApiTags(markdown);
      
      // Simulate what the markdown processor does:
      // 1. Clean the markdown
      expect(cleaned).toContain('(api:SilverStripe\\ORM\\DataObject)');
      
      // 2. Would be converted to HTML by the markdown processor
      // 3. Then rewritten by rewriteApiLinksInHtml
      const htmlWithApiLink = '<a href="api:SilverStripe\\ORM\\DataObject">SilverStripe\\ORM\\DataObject</a>';
      const finalHtml = rewriteApiLinksInHtml(htmlWithApiLink, '6');
      
      expect(finalHtml).toContain('https://api.silverstripe.org');
      expect(finalHtml).toContain('target="_blank"');
    });

    it('should handle all variations of API links', () => {
      const testCases = [
        { markdown: '[api:Class]', expected: '(api:Class)' },
        { markdown: '[api:Namespace\\Class]', expected: '(api:Namespace\\Class)' },
        { markdown: '[api:Namespace\\Class::method()]', expected: '(api:Namespace\\Class::method())' },
        { markdown: '[api:Namespace\\Class->property]', expected: '(api:Namespace\\Class->property)' },
      ];

      testCases.forEach(({ markdown, expected }) => {
        const result = cleanApiTags(markdown);
        expect(result).toContain(expected);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle deeply nested namespaces', () => {
      const markdown = 'Use [api:SilverStripe\\A\\B\\C\\D\\E\\ClassName]';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('(api:SilverStripe\\A\\B\\C\\D\\E\\ClassName)');
    });

    it('should handle API links with underscores', () => {
      const markdown = '[api:My_Custom_Class_Name]';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('(api:My_Custom_Class_Name)');
    });

    it('should handle API links with mixed case', () => {
      const markdown = '[api:SilverStripe\\Forms\\HTMLEditor\\HTMLEditorField]';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('(api:SilverStripe\\Forms\\HTMLEditor\\HTMLEditorField)');
    });

    it('should preserve punctuation around API links', () => {
      const markdown = 'See [api:DataObject], [api:DataList]; or [api:ArrayList].';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('[DataObject](api:DataObject),');
      expect(result).toContain('[DataList](api:DataList);');
      expect(result).toContain('[ArrayList](api:ArrayList).');
    });

    it('should handle API links at start of text', () => {
      const markdown = '[api:DataObject] is the base class.';
      const result = cleanApiTags(markdown);
      
      expect(result).toBe('[DataObject](api:DataObject) is the base class.');
    });

    it('should handle API links at end of text', () => {
      const markdown = 'For more information, see [api:DataObject]';
      const result = cleanApiTags(markdown);
      
      expect(result).toBe('For more information, see [DataObject](api:DataObject)');
    });

    it('should handle static methods', () => {
      const markdown = '[api:SilverStripe\\ORM\\DataObject::get()]';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('::get()');
    });

    it('should handle magic methods', () => {
      const markdown = '[api:SilverStripe\\ORM\\DataObject::__call()]';
      const result = cleanApiTags(markdown);
      
      expect(result).toContain('::__call()');
    });
  });
});
