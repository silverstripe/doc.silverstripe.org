import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

// Mock the content loading functions
jest.mock('@/lib/content/get-document', () => ({
  getDocumentByParams: jest.fn(),
  getAllDocuments: jest.fn()
}));

jest.mock('@/lib/nav/build-nav-tree', () => ({
  buildNavTree: jest.fn()
}));

jest.mock('@/lib/markdown/processor', () => ({
  markdownToHtmlWithCleanup: jest.fn()
}));

jest.mock('@/lib/children/replace-children-markers', () => ({
  replaceChildrenMarkers: jest.fn()
}));

jest.mock('@/lib/versions/version-utils', () => ({
  getDefaultVersion: jest.fn(),
  getVersionPath: jest.fn()
}));

jest.mock('@/components/DocsLayout', () => ({
  DocsLayout: ({ children }: any) => <div data-testid="docs-layout">{children}</div>
}));

jest.mock('@/components/VersionBanner', () => ({
  VersionBanner: () => null
}));

jest.mock('@/components/EditOnGithub', () => ({
  __esModule: true,
  default: () => <a href="#edit" data-testid="edit-on-github">Edit on GitHub</a>
}));

import Page from '@/app/en/[version]/[[...slug]]/page';
import { getDocumentByParams, getAllDocuments } from '@/lib/content/get-document';
import { buildNavTree } from '@/lib/nav/build-nav-tree';
import { markdownToHtmlWithCleanup } from '@/lib/markdown/processor';
import { replaceChildrenMarkers } from '@/lib/children/replace-children-markers';
import { getDefaultVersion, getVersionPath } from '@/lib/versions/version-utils';

describe('Page Layout - Version Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render version footer text', async () => {
    const mockDoc = {
      slug: '/en/5/getting-started/',
      version: '5',
      filePath: 'getting-started.md',
      fileTitle: 'Getting Started',
      fileAbsolutePath: '/path/to/getting-started.md',
      isIndex: false,
      parentSlug: '/en/5/',
      title: 'Getting Started',
      content: '# Getting Started',
      category: 'docs' as const,
      hideChildren: false,
      hide: false,
      hideSelf: false
    };

    const mockHtmlContent = '<h1>Getting Started</h1>';

    (getDocumentByParams as jest.Mock).mockResolvedValue(mockDoc);
    (getAllDocuments as jest.Mock).mockResolvedValue([mockDoc]);
    (buildNavTree as jest.Mock).mockReturnValue({});
    (markdownToHtmlWithCleanup as jest.Mock).mockResolvedValue(mockHtmlContent);
    (replaceChildrenMarkers as jest.Mock).mockReturnValue(mockHtmlContent);
    (getDefaultVersion as jest.Mock).mockReturnValue('6');
    (getVersionPath as jest.Mock).mockReturnValue('/en/6/getting-started/');

    const result = await Page({
      params: Promise.resolve({
        version: '5',
        slug: ['getting-started']
      })
    });

    const { container } = render(result as React.ReactElement);

    // Verify version footer text is NOT present
    expect(screen.queryByText(/Version \d+ • docs/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Version \d+ • user/)).not.toBeInTheDocument();

    // Verify EditOnGithub link IS present
    expect(screen.getByTestId('edit-on-github')).toBeInTheDocument();

    // Verify footer element exists (but without version text)
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should render EditOnGithub component in footer', async () => {
    const mockDoc = {
      slug: '/en/5/getting-started/',
      version: '5',
      filePath: 'getting-started.md',
      fileTitle: 'Getting Started',
      fileAbsolutePath: '/path/to/getting-started.md',
      isIndex: false,
      parentSlug: '/en/5/',
      title: 'Getting Started',
      content: '# Getting Started',
      category: 'docs' as const,
      hideChildren: false,
      hide: false,
      hideSelf: false
    };

    const mockHtmlContent = '<h1>Getting Started</h1>';

    (getDocumentByParams as jest.Mock).mockResolvedValue(mockDoc);
    (getAllDocuments as jest.Mock).mockResolvedValue([mockDoc]);
    (buildNavTree as jest.Mock).mockReturnValue({});
    (markdownToHtmlWithCleanup as jest.Mock).mockResolvedValue(mockHtmlContent);
    (replaceChildrenMarkers as jest.Mock).mockReturnValue(mockHtmlContent);
    (getDefaultVersion as jest.Mock).mockReturnValue('6');
    (getVersionPath as jest.Mock).mockReturnValue('/en/6/getting-started/');

    const result = await Page({
      params: Promise.resolve({
        version: '5',
        slug: ['getting-started']
      })
    });

    render(result as React.ReactElement);

    expect(screen.getByTestId('edit-on-github')).toBeInTheDocument();
  });
});
