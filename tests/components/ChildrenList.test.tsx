import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChildrenList } from '@/components/ChildrenList';
import { DocumentNode } from '@/types/types';
import { clearDocumentCache } from '@/lib/children/get-children';

describe('ChildrenList Component', () => {
  // Mock document node factory
  const createMockDoc = (overrides?: Partial<DocumentNode>): DocumentNode => ({
    slug: '/en/6/example',
    version: '6',
    filePath: 'en/6/example.md',
    fileTitle: 'Example',
    fileAbsolutePath: '/path/to/example.md',
    isIndex: true,
    parentSlug: '/en/6',
    title: 'Example Page',
    content: 'Example content',
    category: 'docs',
    ...overrides,
  });

  const createChild = (
    title: string,
    slug: string,
    parentSlugOrOverrides?: string | Partial<DocumentNode>,
    overrides?: Partial<DocumentNode>,
  ): DocumentNode => {
    let parentSlug = '/en/6/example';
    let finalOverrides: Partial<DocumentNode> = {};

    if (typeof parentSlugOrOverrides === 'string') {
      parentSlug = parentSlugOrOverrides;
      finalOverrides = overrides || {};
    } else if (parentSlugOrOverrides) {
      finalOverrides = parentSlugOrOverrides;
    }

    return createMockDoc({
      title,
      slug: `${parentSlug}/${slug}`,
      fileTitle: slug,
      filePath: `en/6/${slug}.md`,
      isIndex: false,
      parentSlug,
      summary: `This is ${title}`,
      ...finalOverrides,
    });
  };

  beforeEach(() => {
    // Clear cache before each test
    clearDocumentCache();
  });

  describe('Rendering child items', () => {
    it('renders child items as cards by default', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/example',
        isIndex: true,
      });

      const children = [
        createChild('Getting Started', 'getting-started'),
        createChild('Configuration', 'configuration'),
        createChild('Advanced Topics', 'advanced-topics'),
      ];

      const allDocs = [parentDoc, ...children];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
      });

      // Render the JSX returned from the async component
      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      expect(screen.getByText('Configuration')).toBeInTheDocument();
      expect(screen.getByText('Advanced Topics')).toBeInTheDocument();
      expect(screen.getByText('This is Getting Started')).toBeInTheDocument();
    });

    it('renders child items as list when asList option is true', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/example',
        isIndex: true,
      });

      const children = [
        createChild('First Item', 'first-item'),
        createChild('Second Item', 'second-item'),
      ];

      const allDocs = [parentDoc, ...children];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
        options: { asList: true },
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
      expect(screen.getByText('This is First Item')).toBeInTheDocument();
    });

    it('renders empty string when no children exist', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/example',
        isIndex: true,
      });

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs: [parentDoc],
      });

      expect(result).toBe('');
    });

    it('renders empty string for non-index documents', async () => {
      const nonIndexDoc = createMockDoc({
        slug: '/en/6/example',
        isIndex: false,
      });

      const result = await ChildrenList({
        doc: nonIndexDoc,
        allDocs: [nonIndexDoc],
      });

      expect(result).toBe('');
    });
  });

  describe('Filtering options', () => {
    it('filters children by exclude option', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const children = [
        createChild('Getting Started', 'getting-started', '/en/6/docs'),
        createChild('Configuration', 'configuration', '/en/6/docs'),
        createChild('Advanced Topics', 'advanced-topics', '/en/6/docs'),
      ];

      const allDocs = [parentDoc, ...children];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
        options: { exclude: ['configuration'] },
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      expect(screen.queryByText('Configuration')).not.toBeInTheDocument();
      expect(screen.getByText('Advanced Topics')).toBeInTheDocument();
    });

    it('filters children by only option', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const children = [
        createChild('Getting Started', 'getting-started', '/en/6/docs'),
        createChild('Configuration', 'configuration', '/en/6/docs'),
        createChild('Advanced Topics', 'advanced-topics', '/en/6/docs'),
      ];

      const allDocs = [parentDoc, ...children];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
        options: { only: ['getting-started', 'advanced-topics'] },
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      expect(screen.queryByText('Configuration')).not.toBeInTheDocument();
      expect(screen.getByText('Advanced Topics')).toBeInTheDocument();
    });

    it('reverses children order with reverse option', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const children = [
        createChild('First', 'first', '/en/6/docs', { order: 1 }),
        createChild('Second', 'second', '/en/6/docs', { order: 2 }),
        createChild('Third', 'third', '/en/6/docs', { order: 3 }),
      ];

      const allDocs = [parentDoc, ...children];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
        options: { reverse: true },
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      const elements = screen.getAllByRole('link');
      const hrefs = elements.map((el) => el.getAttribute('href'));
      const thirdIndex = hrefs.indexOf('/en/6/docs/third');
      const firstIndex = hrefs.indexOf('/en/6/docs/first');

      expect(thirdIndex).toBeGreaterThan(-1);
      expect(firstIndex).toBeGreaterThan(-1);
      expect(thirdIndex).toBeLessThan(firstIndex);
    });
  });

  describe('Icon rendering', () => {
    it('renders default icon when no icon specified', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const child = createChild('Page', 'page', '/en/6/docs');
      const allDocs = [parentDoc, child];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      const { container } = render(result);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-file-alt');
    });

    it('renders custom icon when icon specified', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const child = createChild('Page', 'page', '/en/6/docs', { icon: 'book' });
      const allDocs = [parentDoc, child];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      const { container } = render(result);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-book');
    });

    it('renders brand icon when iconBrand specified', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const child = createChild('Page', 'page', '/en/6/docs', { iconBrand: 'github' });
      const allDocs = [parentDoc, child];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      const { container } = render(result);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fab', 'fa-github');
    });
  });

  describe('Links and hrefs', () => {
    it('generates correct href links for cards', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const child = createChild('Getting Started', 'getting-started', '/en/6/docs');
      const allDocs = [parentDoc, child];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      const link = screen.getByRole('link', { name: /Getting Started/i });
      expect(link).toHaveAttribute('href', '/en/6/docs/getting-started');
    });

    it('generates correct href links for list items', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const child = createChild('Configuration', 'configuration', '/en/6/docs');
      const allDocs = [parentDoc, child];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
        options: { asList: true },
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      const link = screen.getByRole('link', { name: /Configuration/i });
      expect(link).toHaveAttribute('href', '/en/6/docs/configuration');
    });
  });

  describe('Summary/description rendering', () => {
    it('renders summary when available', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const child = createChild('Getting Started', 'getting-started', '/en/6/docs', {
        summary: 'Learn how to get started',
      });

      const allDocs = [parentDoc, child];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      expect(screen.getByText('Learn how to get started')).toBeInTheDocument();
    });

    it('renders empty string for summary when not available', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const child = createChild('Getting Started', 'getting-started', '/en/6/docs', {
        summary: undefined,
      });

      const allDocs = [parentDoc, child];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      // Should not crash and should render the title
      expect(screen.getByText('Getting Started')).toBeInTheDocument();
    });
  });

  describe('Layout options', () => {
    it('uses card layout by default (not asList)', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const child = createChild('Page', 'page', '/en/6/docs');
      const allDocs = [parentDoc, child];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      const container = render(result).container;
      expect(container.querySelector('.docsOverview')).toBeInTheDocument();
      expect(container.querySelector('.cardGrid')).toBeInTheDocument();
      expect(container.querySelector('.docsList')).not.toBeInTheDocument();
    });

    it('switches to list layout with asList option', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const child = createChild('Page', 'page', '/en/6/docs');
      const allDocs = [parentDoc, child];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
        options: { asList: true },
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      const container = render(result).container;
      expect(container.querySelector('.docsList')).toBeInTheDocument();
      expect(container.querySelector('.cardGrid')).not.toBeInTheDocument();
    });
  });

  describe('Multiple children', () => {
    it('renders multiple children correctly', async () => {
      const parentDoc = createMockDoc({
        slug: '/en/6/docs',
        isIndex: true,
      });

      const children = Array.from({ length: 5 }, (_, i) =>
        createChild(`Item ${i + 1}`, `item-${i + 1}`, '/en/6/docs'),
      );

      const allDocs = [parentDoc, ...children];

      const result = await ChildrenList({
        doc: parentDoc,
        allDocs,
      });

      if (result === '') {
        expect(result).not.toBe('');
        return;
      }

      render(result);

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`Item ${i}`)).toBeInTheDocument();
      }
    });
  });
});
