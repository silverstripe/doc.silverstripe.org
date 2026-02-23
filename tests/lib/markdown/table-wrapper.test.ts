import { rehypeWrapTables, type HastNode } from '@/lib/markdown/rehype-wrap-tables';

describe('rehypeWrapTables', () => {
  it('wraps table nodes in a scroll container', () => {
    const tree: HastNode = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'table',
          properties: {},
          children: [],
        },
      ],
    };

    const transform = rehypeWrapTables();
    transform(tree);

    const wrapper = tree.children?.[0];
    expect(wrapper?.tagName).toBe('div');
    expect(wrapper?.properties?.className).toEqual(['table-wrapper']);
    expect(wrapper?.children?.[0]?.tagName).toBe('table');
  });

  it('does not double-wrap tables inside an existing wrapper', () => {
    const tree: HastNode = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-wrapper'] },
          children: [
            {
              type: 'element',
              tagName: 'table',
              properties: {},
              children: [],
            },
          ],
        },
      ],
    };

    const transform = rehypeWrapTables();
    transform(tree);

    const wrapper = tree.children?.[0];
    expect(wrapper?.tagName).toBe('div');
    expect(wrapper?.children?.[0]?.tagName).toBe('table');
  });
});
