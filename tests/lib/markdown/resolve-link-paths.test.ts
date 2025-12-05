import { resolveMarkdownLink, isRelativeMarkdownLink } from '@/lib/markdown/resolve-link-paths';

describe('resolveMarkdownLink', () => {
  describe('non-markdown links', () => {
    it('returns non-.md links unchanged', () => {
      const result = resolveMarkdownLink(
        'https://example.com',
        '/path/to/file.md',
        '6',
      );
      expect(result).toBe('https://example.com');
    });

    it('returns anchor links unchanged', () => {
      const result = resolveMarkdownLink(
        '#section',
        '/path/to/file.md',
        '6',
      );
      expect(result).toBe('#section');
    });

    it('resolves root-relative paths ending with .md as internal doc links', () => {
      const result = resolveMarkdownLink(
        '/absolute/path/file.md',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/absolute/path/file/');
    });

    it('returns http URLs unchanged even if they end in .md', () => {
      const result = resolveMarkdownLink(
        'http://example.com/file.md',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('http://example.com/file.md');
    });

    it('returns static asset paths unchanged', () => {
      const result = resolveMarkdownLink(
        '/_images/screenshot.png',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/_images/screenshot.png');
    });

    it('returns _resources paths unchanged', () => {
      const result = resolveMarkdownLink(
        '/_resources/file.zip',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/_resources/file.zip');
    });

    it('returns /assets paths unchanged', () => {
      const result = resolveMarkdownLink(
        '/assets/logo.svg',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/assets/logo.svg');
    });
  });

  describe('root-relative markdown paths', () => {
    it('resolves root-relative paths with .md extension', () => {
      const result = resolveMarkdownLink(
        '/developer_guides/security/secure_coding.md',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/security/secure_coding/');
    });

    it('resolves root-relative paths with anchor fragments', () => {
      const result = resolveMarkdownLink(
        '/developer_guides/security/secure_coding.md#filesystem',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/security/secure_coding/#filesystem');
    });

    it('resolves root-relative index.md files', () => {
      const result = resolveMarkdownLink(
        '/developer_guides/index.md',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/');
    });

    it('resolves root-relative paths with numeric prefixes', () => {
      const result = resolveMarkdownLink(
        '/01_developer_guides/02_security/03_secure_coding.md',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/security/secure_coding/');
    });

    it('resolves root-relative paths without .md extension (dynamic detection)', () => {
      const result = resolveMarkdownLink(
        '/developer_guides/security/secure_coding',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/security/secure_coding/');
    });

    it('resolves any new section dynamically without hardcoding', () => {
      const result = resolveMarkdownLink(
        '/project_governance/request_for_comment',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/project_governance/request_for_comment/');
    });

    it('resolves upgrading/deprecations path dynamically', () => {
      const result = resolveMarkdownLink(
        '/upgrading/deprecations',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/upgrading/deprecations/');
    });

    it('resolves any_new_section/any_page path dynamically', () => {
      const result = resolveMarkdownLink(
        '/any_new_section/any_page',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/any_new_section/any_page/');
    });

    it('resolves root-relative paths without .md with anchor', () => {
      const result = resolveMarkdownLink(
        '/developer_guides/security/secure_coding#filesystem',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/security/secure_coding/#filesystem');
    });

    it('leaves paths already prefixed with /en/ unchanged', () => {
      const result = resolveMarkdownLink(
        '/en/6/developer_guides/security/',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/security/');
    });
  });

  describe('relative .md links in .cache/docs', () => {
    it('resolves ./ relative links with numeric prefix', () => {
      const result = resolveMarkdownLink(
        './04_security.md',
        '/home/project/.cache/docs/v6/optional_features/advancedworkflow/01_adding-workflows.md',
        '6',
      );
      expect(result).toBe('/en/6/optional_features/advancedworkflow/security/');
    });

    it('resolves ../ relative links', () => {
      const result = resolveMarkdownLink(
        '../index.md',
        '/home/project/.cache/docs/v6/optional_features/advancedworkflow/01_adding-workflows.md',
        '6',
      );
      expect(result).toBe('/en/6/optional_features/');
    });

    it('resolves links to index.md files', () => {
      const result = resolveMarkdownLink(
        './02_folder/index.md',
        '/home/project/.cache/docs/v6/01_getting_started/index.md',
        '6',
      );
      expect(result).toBe('/en/6/getting_started/folder/');
    });

    it('resolves links without numeric prefix', () => {
      const result = resolveMarkdownLink(
        './configuration.md',
        '/home/project/.cache/docs/v6/01_getting_started/index.md',
        '6',
      );
      expect(result).toBe('/en/6/getting_started/configuration/');
    });

    it('strips numeric prefix from directory and file', () => {
      const result = resolveMarkdownLink(
        '../02_developer_guides/01_model.md',
        '/home/project/.cache/docs/v6/01_getting_started/index.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/model/');
    });
  });

  describe('relative .md links in .cache/user', () => {
    it('resolves ./ relative links in user docs', () => {
      const result = resolveMarkdownLink(
        './02_creating_pages.md',
        '/home/project/.cache/user/v6/01_Managing_your_website/index.md',
        '6',
      );
      expect(result).toBe('/en/6/managing_your_website/creating_pages/');
    });
  });

  describe('relative .md links in mock-content', () => {
    it('resolves links in mock-content', () => {
      const result = resolveMarkdownLink(
        './02_installation.md',
        '/home/project/tests/fixtures/mock-content/v6/01_getting_started/index.md',
        '6',
      );
      expect(result).toBe('/en/6/getting_started/installation/');
    });
  });

  describe('version handling', () => {
    it('uses the provided version in the output URL', () => {
      const result = resolveMarkdownLink(
        './other.md',
        '/home/project/.cache/docs/v5/01_getting_started/index.md',
        '5',
      );
      expect(result).toBe('/en/5/getting_started/other/');
    });

    it('handles version 4', () => {
      const result = resolveMarkdownLink(
        './other.md',
        '/home/project/.cache/docs/v4/01_getting_started/index.md',
        '4',
      );
      expect(result).toBe('/en/4/getting_started/other/');
    });
  });

  describe('relative links without .md extension', () => {
    it('resolves ./ relative link without extension', () => {
      const result = resolveMarkdownLink(
        './code',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('/en/6/contributing/code/');
    });

    it('resolves ../ relative link without extension', () => {
      const result = resolveMarkdownLink(
        '../getting_started',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('/en/6/getting_started/');
    });

    it('resolves deeply nested ../ relative link without extension', () => {
      const result = resolveMarkdownLink(
        '../fixtures',
        '/home/project/.cache/docs/v6/02_Developer_Guides/06_Testing/How_Tos/02_FixtureFactories.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/testing/fixtures/');
    });

    it('preserves anchor fragments in relative links without extension', () => {
      const result = resolveMarkdownLink(
        './code#section',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('/en/6/contributing/code/#section');
    });

    it('does not modify external https links', () => {
      const result = resolveMarkdownLink(
        'https://example.com',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('https://example.com');
    });

    it('does not modify image links like ../_images/screenshot.png', () => {
      const result = resolveMarkdownLink(
        '../_images/screenshot.png',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('../_images/screenshot.png');
    });

    it('does not modify .jpg files', () => {
      const result = resolveMarkdownLink(
        './image.jpg',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('./image.jpg');
    });

    it('does not modify .png files', () => {
      const result = resolveMarkdownLink(
        './image.png',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('./image.png');
    });

    it('does not modify .gif files', () => {
      const result = resolveMarkdownLink(
        './image.gif',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('./image.gif');
    });

    it('does not modify .svg files', () => {
      const result = resolveMarkdownLink(
        './image.svg',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('./image.svg');
    });

    it('does not modify .webp files', () => {
      const result = resolveMarkdownLink(
        './image.webp',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('./image.webp');
    });

    it('preserves anchor fragments with multiple # characters', () => {
      const result = resolveMarkdownLink(
        './code#section1#section2',
        '/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md',
        '6',
      );
      expect(result).toBe('/en/6/contributing/code/#section1#section2');
    });
  });

  describe('cross-section relative links (Phase 3)', () => {
    it('resolves ../developer_guides/testing/unit_testing from contributing/', () => {
      const result = resolveMarkdownLink(
        '../developer_guides/testing/unit_testing',
        '/home/project/.cache/docs/v6/10_contributing/01_Code.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/testing/unit_testing/');
    });

    it('resolves ../developer_guides/testing/unit_testing.md from contributing/', () => {
      const result = resolveMarkdownLink(
        '../developer_guides/testing/unit_testing.md',
        '/home/project/.cache/docs/v6/10_contributing/01_Code.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/testing/unit_testing/');
    });

    it('resolves ../getting_started/composer#contributing from contributing/', () => {
      const result = resolveMarkdownLink(
        '../getting_started/composer#contributing',
        '/home/project/.cache/docs/v6/10_contributing/01_Code.md',
        '6',
      );
      expect(result).toBe('/en/6/getting_started/composer/#contributing');
    });

    it('resolves ../getting_started/composer.md#contributing from contributing/', () => {
      const result = resolveMarkdownLink(
        '../getting_started/composer.md#contributing',
        '/home/project/.cache/docs/v6/10_contributing/01_Code.md',
        '6',
      );
      expect(result).toBe('/en/6/getting_started/composer/#contributing');
    });

    it('resolves ../../getting_started/environment_management from deeply nested path', () => {
      const result = resolveMarkdownLink(
        '../../../getting_started/environment_management',
        '/home/project/.cache/docs/v6/02_developer_guides/06_testing/How_Tos/02_FixtureFactories.md',
        '6',
      );
      expect(result).toBe('/en/6/getting_started/environment_management/');
    });

    it('resolves ../01_developer_guides/testing from contributing with numeric prefixes', () => {
      const result = resolveMarkdownLink(
        '../01_developer_guides/testing',
        '/home/project/.cache/docs/v6/10_contributing/01_Code.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/testing/');
    });

    it('resolves cross-section link with numeric prefixes in all segments', () => {
      const result = resolveMarkdownLink(
        '../02_developer_guides/06_testing/02_unit_testing',
        '/home/project/.cache/docs/v6/10_contributing/01_Code.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/testing/unit_testing/');
    });
  });

  describe('edge cases', () => {
    it('handles deeply nested paths', () => {
      const result = resolveMarkdownLink(
        '../../03_other/04_section.md',
        '/home/project/.cache/docs/v6/01_getting_started/02_installation/01_detail.md',
        '6',
      );
      expect(result).toBe('/en/6/other/section/');
    });

    it('handles filenames with underscores after prefix', () => {
      const result = resolveMarkdownLink(
        './01_getting_started.md',
        '/home/project/.cache/docs/v6/index.md',
        '6',
      );
      expect(result).toBe('/en/6/getting_started/');
    });

    it('handles filenames with hyphens', () => {
      const result = resolveMarkdownLink(
        './04_my-feature.md',
        '/home/project/.cache/docs/v6/01_section/index.md',
        '6',
      );
      expect(result).toBe('/en/6/section/my-feature/');
    });

    it('returns original link if no content match found', () => {
      const result = resolveMarkdownLink(
        './other.md',
        '/some/random/path/file.md',
        '6',
      );
      expect(result).toBe('./other.md');
    });
  });

  describe('mixed case directory names (Phase 4)', () => {
    it('resolves mixed case root-relative paths with .md extension', () => {
      const result = resolveMarkdownLink(
        '/Project_Governance/Minor_release_policy.md',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/project_governance/minor_release_policy/');
    });

    it('resolves mixed case paths with anchor fragments', () => {
      const result = resolveMarkdownLink(
        '/Project_Governance/Minor_release_policy.md#security-patch-windows',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/project_governance/minor_release_policy/#security-patch-windows');
    });

    it('resolves mixed case relative paths', () => {
      const result = resolveMarkdownLink(
        '../Project_Governance/Minor_release_policy',
        '/home/project/.cache/docs/v6/Contributing/Code.md',
        '6',
      );
      expect(result).toBe('/en/6/project_governance/minor_release_policy/');
    });

    it('resolves mixed case paths without .md extension', () => {
      const result = resolveMarkdownLink(
        '/Project_Governance/Minor_release_policy',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/project_governance/minor_release_policy/');
    });

    it('preserves anchor case while lowercasing path segments', () => {
      const result = resolveMarkdownLink(
        '../Project_Governance/Minor_release_policy#Security-Patch-Windows',
        '/home/project/.cache/docs/v6/Contributing/Code.md',
        '6',
      );
      expect(result).toBe('/en/6/project_governance/minor_release_policy/#Security-Patch-Windows');
    });

    it('handles mixed case with numeric prefixes', () => {
      const result = resolveMarkdownLink(
        '/01_Project_Governance/02_Minor_release_policy.md',
        '/current/file.md',
        '6',
      );
      expect(result).toBe('/en/6/project_governance/minor_release_policy/');
    });

    it('handles deeply nested mixed case paths', () => {
      const result = resolveMarkdownLink(
        '../../../Contributing/Code_Standards/Style_Guide',
        '/home/project/.cache/docs/v6/01_Developer_Guides/06_Testing/How_Tos/02_FixtureFactories.md',
        '6',
      );
      expect(result).toBe('/en/6/contributing/code_standards/style_guide/');
    });

    it('resolves mixed case index files', () => {
      const result = resolveMarkdownLink(
        './01_Project_Governance/index.md',
        '/home/project/.cache/docs/v6/index.md',
        '6',
      );
      expect(result).toBe('/en/6/project_governance/');
    });
  });

  describe('bare relative links (sibling references)', () => {
    it('resolves bare sibling link without anchor', () => {
      const result = resolveMarkdownLink(
        'data_types_and_casting',
        '/home/project/.cache/docs/v6/02_Developer_Guides/00_Model/01_Data_Model_and_ORM.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/model/data_types_and_casting/');
    });

    it('resolves bare sibling link with anchor', () => {
      const result = resolveMarkdownLink(
        'data_model_and_orm#subclasses',
        '/home/project/.cache/docs/v6/02_Developer_Guides/00_Model/08_SQL_Select.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/model/data_model_and_orm/#subclasses');
    });

    it('resolves bare sibling link searchfilters', () => {
      const result = resolveMarkdownLink(
        'searchfilters',
        '/home/project/.cache/docs/v6/02_Developer_Guides/00_Model/01_Data_Model_and_ORM.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/model/searchfilters/');
    });

    it('resolves bare sibling link permissions', () => {
      const result = resolveMarkdownLink(
        'permissions',
        '/home/project/.cache/docs/v6/02_Developer_Guides/00_Model/10_Versioning.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/model/permissions/');
    });

    it('resolves bare sibling link in templates directory', () => {
      const result = resolveMarkdownLink(
        'template_inheritance#template-types-and-locations',
        '/home/project/.cache/docs/v6/02_Developer_Guides/01_Templates/01_Syntax.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/templates/template_inheritance/#template-types-and-locations');
    });

    it('does not modify anchor-only links', () => {
      const result = resolveMarkdownLink(
        '#section',
        '/home/project/.cache/docs/v6/02_Developer_Guides/00_Model/01_Data_Model_and_ORM.md',
        '6',
      );
      expect(result).toBe('#section');
    });

    it('does not modify external URLs', () => {
      const result = resolveMarkdownLink(
        'https://example.com',
        '/home/project/.cache/docs/v6/02_Developer_Guides/00_Model/01_Data_Model_and_ORM.md',
        '6',
      );
      expect(result).toBe('https://example.com');
    });

    it('does not modify image file references', () => {
      const result = resolveMarkdownLink(
        'screenshot.png',
        '/home/project/.cache/docs/v6/02_Developer_Guides/00_Model/01_Data_Model_and_ORM.md',
        '6',
      );
      expect(result).toBe('screenshot.png');
    });

    it('resolves bare sibling link with .md extension', () => {
      const result = resolveMarkdownLink(
        'data_types_and_casting.md',
        '/home/project/.cache/docs/v6/02_Developer_Guides/00_Model/01_Data_Model_and_ORM.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/model/data_types_and_casting/');
    });

    it('resolves bare sibling link with path segments', () => {
      const result = resolveMarkdownLink(
        'relations',
        '/home/project/.cache/docs/v6/02_Developer_Guides/00_Model/01_Data_Model_and_ORM.md',
        '6',
      );
      expect(result).toBe('/en/6/developer_guides/model/relations/');
    });

    it('resolves bare sibling link in mock-content', () => {
      const result = resolveMarkdownLink(
        'installation',
        '/home/project/tests/fixtures/mock-content/v6/01_getting_started/index.md',
        '6',
      );
      expect(result).toBe('/en/6/getting_started/installation/');
    });

    it('resolves bare sibling link in user docs', () => {
      const result = resolveMarkdownLink(
        'creating_pages',
        '/home/project/.cache/user/v6/01_Managing_your_website/index.md',
        '6',
      );
      expect(result).toBe('/en/6/managing_your_website/creating_pages/');
    });
  });
});

describe('isRelativeMarkdownLink', () => {
  it('returns true for relative .md links', () => {
    expect(isRelativeMarkdownLink('./file.md')).toBe(true);
    expect(isRelativeMarkdownLink('../file.md')).toBe(true);
    expect(isRelativeMarkdownLink('path/to/file.md')).toBe(true);
  });

  it('returns false for non-.md links', () => {
    expect(isRelativeMarkdownLink('./file.txt')).toBe(false);
    expect(isRelativeMarkdownLink('https://example.com')).toBe(false);
  });

  it('returns false for absolute .md paths', () => {
    expect(isRelativeMarkdownLink('/absolute/path/file.md')).toBe(false);
  });

  it('returns false for http/https .md links', () => {
    expect(isRelativeMarkdownLink('http://example.com/file.md')).toBe(false);
    expect(isRelativeMarkdownLink('https://example.com/file.md')).toBe(false);
  });
});
