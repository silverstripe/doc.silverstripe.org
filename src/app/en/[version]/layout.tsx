import type { ReactNode } from 'react';
import { getAllDocuments } from '@/lib/content/get-document';
import { buildNavTree } from '@/lib/nav/build-nav-tree';
import { DocsLayout } from '@/components/DocsLayout';

interface VersionLayoutProps {
  children: ReactNode;
  params: Promise<{ version: string }>;
}

/**
 * Version-level layout that wraps all doc pages within a version.
 * Placing DocsLayout here (rather than in page.tsx) prevents the Sidebar
 * from unmounting and remounting on every page navigation within the same version.
 */
export default async function VersionLayout({ children, params }: VersionLayoutProps) {
  const { version } = await params;
  const allDocs = await getAllDocuments();

  // Build nav tree without a currentSlug — active state is determined
  // client-side via usePathname() inside Sidebar and DocsLayout.
  const navTree = buildNavTree(allDocs, version);

  return (
    <DocsLayout navTree={navTree} version={version}>
      {children}
    </DocsLayout>
  );
}
