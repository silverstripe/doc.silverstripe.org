import { buildNavTree, isNodeOrDescendantActiveByPath, getAncestorsByPath } from '@/lib/nav/build-nav-tree';
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

describe('isNodeOrDescendantActiveByPath', () => {
  const node = (slug: string, children: any[] = []): any => ({
    slug,
    title: slug,
    isIndex: false,
    isActive: false,
    hasVisibleChildren: children.length > 0,
    children,
  });

  it('should return true when the node slug matches the path', () => {
    expect(isNodeOrDescendantActiveByPath(node('/en/6/foo/'), '/en/6/foo/')).toBe(true);
  });

  it('should return false when the node slug does not match and there are no children', () => {
    expect(isNodeOrDescendantActiveByPath(node('/en/6/foo/'), '/en/6/bar/')).toBe(false);
  });

  it('should return true when a direct child matches the path', () => {
    const tree = node('/en/6/parent/', [node('/en/6/parent/child/')]);
    expect(isNodeOrDescendantActiveByPath(tree, '/en/6/parent/child/')).toBe(true);
  });

  it('should return true when a deeply nested descendant matches the path', () => {
    const tree = node('/en/6/a/', [
      node('/en/6/a/b/', [
        node('/en/6/a/b/c/'),
      ]),
    ]);
    expect(isNodeOrDescendantActiveByPath(tree, '/en/6/a/b/c/')).toBe(true);
  });

  it('should return false when no node in the tree matches the path', () => {
    const tree = node('/en/6/a/', [node('/en/6/a/b/')]);
    expect(isNodeOrDescendantActiveByPath(tree, '/en/6/other/')).toBe(false);
  });
});

describe('getAncestorsByPath', () => {
  const node = (slug: string, children: any[] = []): any => ({
    slug,
    title: slug,
    isIndex: false,
    isActive: false,
    hasVisibleChildren: children.length > 0,
    children,
  });

  it('should return just the node slug when the node itself matches', () => {
    expect(getAncestorsByPath(node('/en/6/foo/'), '/en/6/foo/')).toEqual(['/en/6/foo/']);
  });

  it('should return empty array when nothing matches', () => {
    const tree = node('/en/6/foo/', [node('/en/6/foo/bar/')]);
    expect(getAncestorsByPath(tree, '/en/6/other/')).toEqual([]);
  });

  it('should return ancestor path to a direct child', () => {
    const tree = node('/en/6/parent/', [node('/en/6/parent/child/')]);
    expect(getAncestorsByPath(tree, '/en/6/parent/child/')).toEqual([
      '/en/6/parent/',
      '/en/6/parent/child/',
    ]);
  });

  it('should return full ancestor chain to a deeply nested node', () => {
    const tree = node('/en/6/a/', [
      node('/en/6/a/b/', [
        node('/en/6/a/b/c/'),
      ]),
    ]);
    expect(getAncestorsByPath(tree, '/en/6/a/b/c/')).toEqual([
      '/en/6/a/',
      '/en/6/a/b/',
      '/en/6/a/b/c/',
    ]);
  });

  it('should not include siblings or unrelated branches', () => {
    const tree = node('/en/6/root/', [
      node('/en/6/root/section-a/', [node('/en/6/root/section-a/page/')]),
      node('/en/6/root/section-b/', [node('/en/6/root/section-b/page/')]),
    ]);
    const result = getAncestorsByPath(tree, '/en/6/root/section-b/page/');
    expect(result).toEqual([
      '/en/6/root/',
      '/en/6/root/section-b/',
      '/en/6/root/section-b/page/',
    ]);
    expect(result).not.toContain('/en/6/root/section-a/');
  });
});
