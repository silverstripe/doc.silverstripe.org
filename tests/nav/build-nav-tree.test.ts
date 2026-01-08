import { buildNavTree, isNodeOrDescendantActive, getActiveAncestorsSlug } from '@/lib/nav/build-nav-tree';
import { DocumentNode, NavNode } from '@/types/types';

describe('buildNavTree', () => {
  const mockDocs: DocumentNode[] = [
    {
      slug: '/en/6/',
      version: '6',
      filePath: 'index.md',
      fileTitle: 'index',
      fileAbsolutePath: '/root/v6/index.md',
      isIndex: true,
      parentSlug: '',
      title: 'Home',
      content: 'Home',
      category: 'docs',
    },
    {
      slug: '/en/6/getting_started/',
      version: '6',
      filePath: 'getting_started/index.md',
      fileTitle: 'index',
      fileAbsolutePath: '/root/v6/getting_started/index.md',
      isIndex: true,
      parentSlug: '/en/6/',
      title: 'Getting Started',
      content: 'Getting Started',
      category: 'docs',
    },
    {
      slug: '/en/6/getting_started/installation/',
      version: '6',
      filePath: 'getting_started/installation.md',
      fileTitle: 'installation',
      fileAbsolutePath: '/root/v6/getting_started/installation.md',
      isIndex: false,
      parentSlug: '/en/6/getting_started/',
      title: 'Installation',
      content: 'Installation',
      category: 'docs',
    },
    {
      slug: '/en/6/developer_guides/',
      version: '6',
      filePath: 'developer_guides/index.md',
      fileTitle: 'index',
      fileAbsolutePath: '/root/v6/developer_guides/index.md',
      isIndex: true,
      parentSlug: '/en/6/',
      title: 'Developer Guides',
      content: 'Developer Guides',
      category: 'docs',
    },
    {
      slug: '/en/6/hidden-section/',
      version: '6',
      filePath: 'hidden-section/index.md',
      fileTitle: 'index',
      fileAbsolutePath: '/root/v6/hidden-section/index.md',
      isIndex: true,
      parentSlug: '/en/6/',
      title: 'Hidden Section',
      content: 'Hidden Section',
      category: 'docs',
      hideSelf: true,
    },
    {
      slug: '/en/5/',
      version: '5',
      filePath: 'index.md',
      fileTitle: 'index',
      fileAbsolutePath: '/root/v5/index.md',
      isIndex: true,
      parentSlug: '',
      title: 'Home v5',
      content: 'Home v5',
      category: 'docs',
    },
  ];

  it('should build navigation tree for a version', () => {
    const tree = buildNavTree(mockDocs, '6');
    
    expect(tree).toHaveLength(2); // Getting Started and Developer Guides (Hidden Section is hidden)
    const titles = tree.map(t => t.title).sort();
    expect(titles).toContain('Getting Started');
    expect(titles).toContain('Developer Guides');
  });

  it('should not include root document in the tree', () => {
    const tree = buildNavTree(mockDocs, '6');
    
    const hasRoot = tree.some(node => node.title === 'Home');
    expect(hasRoot).toBe(false);
  });

  it('should filter out root even if it appears in top-level items', () => {
    // Create mock where root is accidentally included in its own children
    const rootBugMockDocs: DocumentNode[] = [
      {
        slug: '/en/6/',
        version: '6',
        filePath: 'index.md',
        fileTitle: 'index',
        fileAbsolutePath: '/root/v6/index.md',
        isIndex: true,
        parentSlug: '/en/6/', // BUG: root is child of itself
        title: 'Root',
        content: 'Root',
        category: 'docs',
      },
      {
        slug: '/en/6/child/',
        version: '6',
        filePath: 'child/index.md',
        fileTitle: 'index',
        fileAbsolutePath: '/root/v6/child/index.md',
        isIndex: true,
        parentSlug: '/en/6/',
        title: 'Child',
        content: 'Child',
        category: 'docs',
      },
    ];

    const tree = buildNavTree(rootBugMockDocs, '6');
    
    // Should only contain the child, not the root
    expect(tree).toHaveLength(1);
    expect(tree[0].title).toBe('Child');
  });

  it('should filter documents by version', () => {
    const tree = buildNavTree(mockDocs, '5');
    
    expect(tree).toHaveLength(0); // v5 has no children
  });

  it('should build nested children up to 2 levels', () => {
    const tree = buildNavTree(mockDocs, '6');
    
    // Find the Getting Started node
    const gettingStarted = tree.find(n => n.title === 'Getting Started');
    expect(gettingStarted).toBeDefined();
    expect(gettingStarted?.children).toHaveLength(1);
    expect(gettingStarted?.children[0].title).toBe('Installation');
  });

  it('should mark current page as active', () => {
    const tree = buildNavTree(mockDocs, '6', '/en/6/getting_started/installation/');
    
    const gettingStarted = tree.find(n => n.title === 'Getting Started');
    expect(gettingStarted?.children[0].isActive).toBe(true);
  });

  it('should exclude items with hideSelf', () => {
    const tree = buildNavTree(mockDocs, '6');
    
    const hasHidden = tree.some(node => node.title === 'Hidden Section');
    expect(hasHidden).toBe(false);
  });

  it('should set hasVisibleChildren correctly', () => {
    const tree = buildNavTree(mockDocs, '6');
    
    const gettingStarted = tree.find(n => n.title === 'Getting Started');
    const devGuides = tree.find(n => n.title === 'Developer Guides');

    expect(gettingStarted?.hasVisibleChildren).toBe(true);
    expect(devGuides?.hasVisibleChildren).toBe(false);
  });
});

describe('isNodeOrDescendantActive', () => {
  it('should return true if node is active', () => {
    const node = {
      slug: '/test/',
      title: 'Test',
      isIndex: false,
      isActive: true,
      children: [],
      hasVisibleChildren: false,
    };

    expect(isNodeOrDescendantActive(node)).toBe(true);
  });

  it('should return true if any descendant is active', () => {
    const node = {
      slug: '/test/',
      title: 'Test',
      isIndex: false,
      isActive: false,
      children: [
        {
          slug: '/test/child/',
          title: 'Child',
          isIndex: false,
          isActive: true,
          children: [],
          hasVisibleChildren: false,
        },
      ],
      hasVisibleChildren: true,
    };

    expect(isNodeOrDescendantActive(node)).toBe(true);
  });

  it('should return false if node and descendants are inactive', () => {
    const node = {
      slug: '/test/',
      title: 'Test',
      isIndex: false,
      isActive: false,
      children: [
        {
          slug: '/test/child/',
          title: 'Child',
          isIndex: false,
          isActive: false,
          children: [],
          hasVisibleChildren: false,
        },
      ],
      hasVisibleChildren: true,
    };

    expect(isNodeOrDescendantActive(node)).toBe(false);
  });
});

describe('getActiveAncestorsSlug', () => {
  it('should return ancestor path to active node', () => {
    const node = {
      slug: '/test/',
      title: 'Test',
      isIndex: true,
      isActive: false,
      children: [
        {
          slug: '/test/child/',
          title: 'Child',
          isIndex: true,
          isActive: false,
          children: [
            {
              slug: '/test/child/grandchild/',
              title: 'Grandchild',
              isIndex: false,
              isActive: true,
              children: [],
              hasVisibleChildren: false,
            },
          ],
          hasVisibleChildren: true,
        },
      ],
      hasVisibleChildren: true,
    };

    const result = getActiveAncestorsSlug(node);
    expect(result).toEqual(['/test/', '/test/child/', '/test/child/grandchild/']);
  });

  it('should return empty array if no active node found', () => {
    const node = {
      slug: '/test/',
      title: 'Test',
      isIndex: false,
      isActive: false,
      children: [],
      hasVisibleChildren: false,
    };

    const result = getActiveAncestorsSlug(node);
    expect(result).toEqual([]);
  });
});
