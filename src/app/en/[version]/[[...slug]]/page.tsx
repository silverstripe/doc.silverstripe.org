import { notFound, redirect } from 'next/navigation';
import { getDocumentByParams, getAllDocuments } from '@/lib/content/get-document';
import { buildNavTree } from '@/lib/nav/build-nav-tree';
import { DocsLayout } from '@/components/DocsLayout';
import { VersionBanner } from '@/components/VersionBanner';
import EditOnGithub from '@/components/EditOnGithub';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getVersionPath, getVersionHomepage } from '@/lib/versions/version-utils';
import type { Metadata } from 'next';
import styles from './page.module.css';

interface PageParams {
  version: string;
  slug?: string[];
}

interface PageProps {
  params: Promise<PageParams>;
}

/**
 * Generate static params for all document routes
 * This pre-renders all possible paths at build time
 */
export async function generateStaticParams(): Promise<PageParams[]> {
  const allDocs = await getAllDocuments();
  const params: PageParams[] = [];

  for (const doc of allDocs) {
    // Extract version and slug from document slug
    // Document slug format: /en/{version}/{path}/
    const parts = doc.slug.split('/').filter(Boolean);
    if (parts.length < 2) continue; // Skip invalid slugs

    const [, version, ...slug] = parts;

    params.push({
      version,
      slug: slug.length > 0 ? slug : undefined,
    });
  }

  return params;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { getDefaultVersion, getVersionPath: getVersionPathFn } = await import('@/lib/versions/version-utils');
  const params = await props.params;
  const doc = await getDocumentByParams(params.version, params.slug);

  if (!doc) {
    return {
      title: 'Not Found',
    };
  }

  const metadata = generatePageMetadata(doc);

  // Add canonical URL for non-current versions
  const defaultVersion = getDefaultVersion();
  if (params.version !== defaultVersion) {
    const latestPath = getVersionPathFn(doc.slug, defaultVersion);
    if (metadata.alternates) {
      metadata.alternates.canonical = latestPath;
    }
  }

  return metadata;
}

/**
 * Dynamic page renderer
 */
export default async function Page({ params: paramsPromise }: PageProps) {
  const { markdownToHtmlWithCleanup } = await import('@/lib/markdown/processor');
  const { replaceChildrenMarkers } = await import('@/lib/children/replace-children-markers');
  const { getDefaultVersion } = await import('@/lib/versions/version-utils');

  const params = await paramsPromise;
  const { version, slug } = params;
  const doc = await getDocumentByParams(version, slug);

  if (!doc) {
    // If we're at version root and doc not found, show 404 to prevent redirect loop
    // This can happen if version index is missing from content
    if (!slug || slug.length === 0) {
      notFound();
    }
    // For other pages, redirect to version homepage
    redirect(getVersionHomepage(version));
  }

  // Build navigation tree
  const allDocs = await getAllDocuments();
  const navTree = buildNavTree(allDocs, version, doc.slug);

  // Convert markdown to HTML with image path resolution and API link rewriting
  let htmlContent = await markdownToHtmlWithCleanup(doc.content, doc.fileAbsolutePath, version);

  // Replace [CHILDREN] markers with rendered children
  htmlContent = replaceChildrenMarkers(htmlContent, doc, allDocs);

  const defaultVersion = getDefaultVersion();
  const latestVersionPath = getVersionPath(doc.slug, defaultVersion);

  return (
    <DocsLayout
      navTree={navTree}
      currentSlug={doc.slug}
      version={version}
    >
      <article>
        {/* Version Banner inside article for same width */}
        <VersionBanner
          version={version}
          latestVersionPath={latestVersionPath}
        />

        <div className={`prose ${styles.contentWrapper}`}>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>

        <footer className={styles.footer}>
          <EditOnGithub
            version={doc.version}
            filePath={doc.filePath}
            category={doc.category}
            optionalFeature={doc.optionalFeature}
          />
        </footer>
      </article>
    </DocsLayout>
  );
}
