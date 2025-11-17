import {
  DocumentNode,
  DocumentMeta,
  ContentTree,
  ChildrenOfProps,
} from '../../types/index';

describe('Type Definitions', () => {
  describe('DocumentNode', () => {
    it('should validate required fields', () => {
      const node: DocumentNode = {
        slug: 'getting-started',
        version: '6',
        filePath: 'docs/getting-started.md',
        fileTitle: 'Getting_Started',
        fileAbsolutePath: '/path/to/docs/getting-started.md',
        isIndex: false,
        parentSlug: 'root',
        title: 'Getting Started',
        content: '# Getting Started\n\nWelcome!',
        category: 'docs',
      };

      expect(node.slug).toBe('getting-started');
      expect(node.version).toBe('6');
      expect(node.isIndex).toBe(false);
      expect(node.category).toBe('docs');
    });

    it('should support optional fields', () => {
      const node: DocumentNode = {
        slug: 'getting-started',
        version: '6',
        filePath: 'docs/getting-started.md',
        fileTitle: 'Getting_Started',
        fileAbsolutePath: '/path/to/docs/getting-started.md',
        isIndex: false,
        parentSlug: 'root',
        title: 'Getting Started',
        content: '# Getting Started',
        category: 'docs',
        summary: 'An overview',
        icon: 'rocket',
        hideChildren: false,
      };

      expect(node.summary).toBe('An overview');
      expect(node.icon).toBe('rocket');
      expect(node.hideChildren).toBe(false);
    });

    it('should support user category', () => {
      const node: DocumentNode = {
        slug: 'help',
        version: '6',
        filePath: 'user-help/page.md',
        fileTitle: 'Page',
        fileAbsolutePath: '/path/to/user-help/page.md',
        isIndex: true,
        parentSlug: 'root',
        title: 'Help',
        content: 'Help content',
        category: 'user',
      };

      expect(node.category).toBe('user');
      expect(node.isIndex).toBe(true);
    });
  });

  describe('DocumentMeta', () => {
    it('should validate frontmatter fields', () => {
      const meta: DocumentMeta = {
        title: 'Page Title',
        summary: 'Short description',
        icon: 'download',
        order: 1,
      };

      expect(meta.title).toBe('Page Title');
      expect(meta.order).toBe(1);
    });

    it('should support all boolean flags', () => {
      const meta: DocumentMeta = {
        hideChildren: true,
        hideSelf: true,
        unhideSelf: false,
      };

      expect(meta.hideChildren).toBe(true);
      expect(meta.hideSelf).toBe(true);
      expect(meta.unhideSelf).toBe(false);
    });

    it('should allow arbitrary additional fields', () => {
      const meta: DocumentMeta = {
        title: 'Page',
        customField: 'custom value',
        anotherField: 123,
      };

      expect(meta.customField).toBe('custom value');
      expect(meta.anotherField).toBe(123);
    });
  });

  describe('ContentTree', () => {
    it('should represent hierarchical structure', () => {
      const childNode: DocumentNode = {
        slug: 'child',
        version: '6',
        filePath: 'child.md',
        fileTitle: 'Child',
        fileAbsolutePath: '/path/child.md',
        isIndex: false,
        parentSlug: 'parent',
        title: 'Child Page',
        content: 'Content',
        category: 'docs',
      };

      const parentNode: DocumentNode = {
        slug: 'parent',
        version: '6',
        filePath: 'parent.md',
        fileTitle: 'Parent',
        fileAbsolutePath: '/path/parent.md',
        isIndex: true,
        parentSlug: 'root',
        title: 'Parent Page',
        content: 'Content',
        category: 'docs',
      };

      const tree: ContentTree = {
        node: parentNode,
        children: [
          {
            node: childNode,
            children: [],
          },
        ],
      };

      expect(tree.node.slug).toBe('parent');
      expect(tree.children).toHaveLength(1);
      expect(tree.children[0].node.slug).toBe('child');
    });

    it('should support nested hierarchies', () => {
      const level3: DocumentNode = {
        slug: 'level-3',
        version: '6',
        filePath: 'level3.md',
        fileTitle: 'Level3',
        fileAbsolutePath: '/path/level3.md',
        isIndex: false,
        parentSlug: 'level-2',
        title: 'Level 3',
        content: 'Content',
        category: 'docs',
      };

      const level2: ContentTree = {
        node: {
          slug: 'level-2',
          version: '6',
          filePath: 'level2.md',
          fileTitle: 'Level2',
          fileAbsolutePath: '/path/level2.md',
          isIndex: true,
          parentSlug: 'level-1',
          title: 'Level 2',
          content: 'Content',
          category: 'docs',
        },
        children: [
          {
            node: level3,
            children: [],
          },
        ],
      };

      const level1: ContentTree = {
        node: {
          slug: 'level-1',
          version: '6',
          filePath: 'level1.md',
          fileTitle: 'Level1',
          fileAbsolutePath: '/path/level1.md',
          isIndex: true,
          parentSlug: 'root',
          title: 'Level 1',
          content: 'Content',
          category: 'docs',
        },
        children: [level2],
      };

      expect(level1.children[0].children[0].node.slug).toBe('level-3');
    });
  });

  describe('ChildrenOfProps', () => {
    it('should validate folder parameter', () => {
      const props: ChildrenOfProps = {
        folderName: 'model',
        currentNode: null,
      };

      expect(props.folderName).toBe('model');
    });

    it('should validate exclude parameter', () => {
      const props: ChildrenOfProps = {
        exclude: 'installation,composer',
        currentNode: null,
      };

      expect(props.exclude).toBe('installation,composer');
    });

    it('should validate only parameter', () => {
      const props: ChildrenOfProps = {
        only: 'advanced',
        currentNode: null,
      };

      expect(props.only).toBe('advanced');
    });

    it('should support boolean options', () => {
      const props: ChildrenOfProps = {
        asList: true,
        includeFolders: true,
        reverse: true,
        currentNode: null,
      };

      expect(props.asList).toBe(true);
      expect(props.includeFolders).toBe(true);
      expect(props.reverse).toBe(true);
    });

    it('should allow currentNode to be DocumentNode', () => {
      const node: DocumentNode = {
        slug: 'current',
        version: '6',
        filePath: 'current.md',
        fileTitle: 'Current',
        fileAbsolutePath: '/path/current.md',
        isIndex: false,
        parentSlug: 'root',
        title: 'Current Page',
        content: 'Content',
        category: 'docs',
      };

      const props: ChildrenOfProps = {
        currentNode: node,
      };

      expect(props.currentNode?.slug).toBe('current');
    });

    it('should support complex combination of options', () => {
      const props: ChildrenOfProps = {
        folderName: 'model',
        asList: true,
        reverse: true,
        currentNode: null,
      };

      expect(props.folderName).toBe('model');
      expect(props.asList).toBe(true);
      expect(props.reverse).toBe(true);
    });
  });
});
