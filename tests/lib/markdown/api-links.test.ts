import {
  rewriteAPILink, cleanApiTags, setCurrentVersion, getCurrentVersion,
} from '@/lib/markdown/api-links';

describe('API Links', () => {
  beforeEach(() => {
    setCurrentVersion('6');
  });

  describe('getCurrentVersion / setCurrentVersion', () => {
    it('should get and set the current version', () => {
      expect(getCurrentVersion()).toBe('6');
      setCurrentVersion('5');
      expect(getCurrentVersion()).toBe('5');
      setCurrentVersion('6');
    });
  });

  describe('rewriteAPILink', () => {
    it('should rewrite a class name to api.silverstripe.org URL', () => {
      const result = rewriteAPILink('api:SilverStripe\\ORM\\DataList');
      expect(result).toBe('https://api.silverstripe.org/search/lookup?q=SilverStripe%5CORM%5CDataList&version=6');
    });

    it('should handle method calls with ::', () => {
      const result = rewriteAPILink('api:SilverStripe\\TinyMCE\\TinyMCEConfig::enablePlugins()');
      expect(result).toBe('https://api.silverstripe.org/search/lookup?q=SilverStripe%5CTinyMCE%5CTinyMCEConfig::enablePlugins()&version=6');
    });

    it('should handle property access with ->', () => {
      const result = rewriteAPILink('api:SilverStripe\\CMS\\Model\\SiteTree->enforce_strict_hierarchy');
      expect(result).toBe('https://api.silverstripe.org/search/lookup?q=SilverStripe%5CCMS%5CModel%5CSiteTree->enforce_strict_hierarchy&version=6');
    });

    it('should handle nested namespaces', () => {
      const result = rewriteAPILink('api:SilverStripe\\StaticPublishQueue\\Job\\GenerateStaticCacheJob');
      expect(result).toBe('https://api.silverstripe.org/search/lookup?q=SilverStripe%5CStaticPublishQueue%5CJob%5CGenerateStaticCacheJob&version=6');
    });

    it('should handle interface links', () => {
      const result = rewriteAPILink('api:SilverStripe\\StaticPublishQueue\\Contract\\StaticallyPublishable');
      expect(result).toBe('https://api.silverstripe.org/search/lookup?q=SilverStripe%5CStaticPublishQueue%5CContract%5CStaticallyPublishable&version=6');
    });

    it('should use provided version parameter', () => {
      const result = rewriteAPILink('api:SilverStripe\\ORM\\DataList', '5');
      expect(result).toContain('&version=5');
    });

    it('should use current version if not provided', () => {
      setCurrentVersion('4');
      const result = rewriteAPILink('api:SilverStripe\\ORM\\DataList');
      expect(result).toContain('&version=4');
    });

    it('should return original link if not an api link', () => {
      const link = 'https://example.com';
      const result = rewriteAPILink(link);
      expect(result).toBe(link);
    });

    it('should handle methods without parentheses', () => {
      const result = rewriteAPILink('api:SilverStripe\\Forms\\Form::loadDataFrom');
      expect(result).toContain('::loadDataFrom');
    });

    it('should handle methods with parameters', () => {
      const result = rewriteAPILink('api:SilverStripe\\ORM\\DataList::filter($name, $value)');
      expect(result).toContain('::filter(');
      expect(result).toContain(')');
    });

    it('should encode backslashes as %5C', () => {
      const result = rewriteAPILink('api:SilverStripe\\ORM\\DataList');
      expect(result).toContain('%5C');
      expect(result).not.toContain('%255C'); // no double encoding
    });

    it('should not double-encode pre-encoded backslashes', () => {
      // When input already has %5C, should not become %255C
      const result = rewriteAPILink('api:SilverStripe%5CORM%5CDataObject', '6');
      expect(result).toBe('https://api.silverstripe.org/search/lookup?q=SilverStripe%5CORM%5CDataObject&version=6');
      expect(result).not.toContain('%255C');
    });

    it('should handle multiple pre-encoded backslashes correctly', () => {
      const result = rewriteAPILink('api:SilverStripe%5CStaticPublishQueue%5CJob%5CGenerateStaticCacheJob', '6');
      expect(result).toBe('https://api.silverstripe.org/search/lookup?q=SilverStripe%5CStaticPublishQueue%5CJob%5CGenerateStaticCacheJob&version=6');
    });

    it('should not double-encode special characters in :: and ->', () => {
      const result = rewriteAPILink('api:SilverStripe\\ORM\\DataList::filter()');
      expect(result).toContain('::');
      expect(result).not.toContain('%3A%3A');
    });

    it('should handle static method calls', () => {
      const result = rewriteAPILink('api:SilverStripe\\ORM\\DataObject::create()');
      expect(result).toContain('::create()');
    });

    it('should handle magic methods', () => {
      const result = rewriteAPILink('api:SilverStripe\\Forms\\Form::__construct()');
      expect(result).toContain('::__construct()');
    });
  });

  describe('cleanApiTags', () => {
    it('should convert shorthand [api:...] to markdown link syntax', () => {
      const markdown = 'This is [api:SilverStripe\\ORM\\DataList] in the text.';
      const result = cleanApiTags(markdown);
      expect(result).toBe('This is [SilverStripe\\ORM\\DataList](api:SilverStripe\\ORM\\DataList) in the text.');
    });

    it('should handle multiple api tags in text', () => {
      const markdown = 'Use [api:DataList] and [api:DataObject] together.';
      const result = cleanApiTags(markdown);
      expect(result).toContain('[DataList](api:DataList)');
      expect(result).toContain('[DataObject](api:DataObject)');
    });

    it('should handle method calls', () => {
      const markdown = 'Call the [api:SilverStripe\\ORM\\DataList::filter()] method.';
      const result = cleanApiTags(markdown);
      expect(result).toContain('[SilverStripe\\ORM\\DataList::filter()](api:SilverStripe\\ORM\\DataList::filter())');
    });

    it('should handle property access', () => {
      const markdown = 'Set [api:SilverStripe\\CMS\\Model\\SiteTree->enforce_strict_hierarchy] property.';
      const result = cleanApiTags(markdown);
      expect(result).toContain('[SilverStripe\\CMS\\Model\\SiteTree->enforce_strict_hierarchy](api:SilverStripe\\CMS\\Model\\SiteTree->enforce_strict_hierarchy)');
    });

    it('should not process [api:...] that already has a markdown link', () => {
      const markdown = '[api:SilverStripe\\ORM\\DataList](something)';
      const result = cleanApiTags(markdown);
      // Should not double-process, the (?!\() should prevent this
      expect(result).toBe(markdown);
    });

    it('should handle interfaces', () => {
      const markdown = 'Implement [api:SilverStripe\\StaticPublishQueue\\Contract\\StaticallyPublishable].';
      const result = cleanApiTags(markdown);
      expect(result).toContain('[SilverStripe\\StaticPublishQueue\\Contract\\StaticallyPublishable](api:SilverStripe\\StaticPublishQueue\\Contract\\StaticallyPublishable)');
    });

    it('should handle nested namespace classes', () => {
      const markdown = 'The [api:SilverStripe\\StaticPublishQueue\\Job\\GenerateStaticCacheJob] class.';
      const result = cleanApiTags(markdown);
      expect(result).toContain('[SilverStripe\\StaticPublishQueue\\Job\\GenerateStaticCacheJob](api:SilverStripe\\StaticPublishQueue\\Job\\GenerateStaticCacheJob)');
    });

    it('should preserve surrounding punctuation', () => {
      const markdown = 'See [api:DataList], [api:DataObject]; or [api:ArrayList].';
      const result = cleanApiTags(markdown);
      expect(result).toContain('[DataList](api:DataList),');
      expect(result).toContain('[DataObject](api:DataObject);');
      expect(result).toContain('[ArrayList](api:ArrayList).');
    });

    it('should handle api links at the beginning of text', () => {
      const markdown = '[api:SilverStripe\\ORM\\DataList] is used for database queries.';
      const result = cleanApiTags(markdown);
      expect(result).toBe('[SilverStripe\\ORM\\DataList](api:SilverStripe\\ORM\\DataList) is used for database queries.');
    });

    it('should handle api links at the end of text', () => {
      const markdown = 'For more info, see [api:SilverStripe\\ORM\\DataList]';
      const result = cleanApiTags(markdown);
      expect(result).toBe('For more info, see [SilverStripe\\ORM\\DataList](api:SilverStripe\\ORM\\DataList)');
    });

    it('should handle mixed case class names', () => {
      const markdown = '[api:SilverStripe\\Forms\\HTMLEditor\\HTMLEditorField]';
      const result = cleanApiTags(markdown);
      expect(result).toBe('[SilverStripe\\Forms\\HTMLEditor\\HTMLEditorField](api:SilverStripe\\Forms\\HTMLEditor\\HTMLEditorField)');
    });

    it('should not modify existing markdown links', () => {
      const markdown = '[Link text](https://example.com)';
      const result = cleanApiTags(markdown);
      expect(result).toBe(markdown);
    });

    it('should handle api tags with underscores in names', () => {
      const markdown = '[api:My_Custom_Class]';
      const result = cleanApiTags(markdown);
      expect(result).toBe('[My_Custom_Class](api:My_Custom_Class)');
    });

    it('should handle complex method signatures', () => {
      const markdown = '[api:SilverStripe\\ORM\\DataList::where($sql)] method call.';
      const result = cleanApiTags(markdown);
      expect(result).toContain('[SilverStripe\\ORM\\DataList::where($sql)](api:SilverStripe\\ORM\\DataList::where($sql))');
    });

    it('should handle multiple parameters', () => {
      const markdown = '[api:SilverStripe\\ORM\\DataList::filter($name, $value, $caseSensitive)]';
      const result = cleanApiTags(markdown);
      expect(result).toContain('[SilverStripe\\ORM\\DataList::filter($name, $value, $caseSensitive)](api:SilverStripe\\ORM\\DataList::filter($name, $value, $caseSensitive))');
    });

    it('should handle static properties', () => {
      const markdown = '[api:SilverStripe\\ORM\\DataObject->config]';
      const result = cleanApiTags(markdown);
      expect(result).toBe('[SilverStripe\\ORM\\DataObject->config](api:SilverStripe\\ORM\\DataObject->config)');
    });

    it('should not interfere with code blocks', () => {
      const markdown = '```php\n// [api:SomeClass] in code\n```';
      // Note: cleanApiTags doesn't check for code blocks, that's handled by the parser
      // But we should still process it correctly
      const result = cleanApiTags(markdown);
      expect(result).toContain('[SomeClass](api:SomeClass) in code');
    });
  });
});
