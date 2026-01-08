import { notFound, redirect } from 'next/navigation';
import { getDocumentByParams, getAllDocuments } from '@/lib/content/get-document';
import { buildNavTree } from '@/lib/nav/build-nav-tree';
import { DocsLayout } from '@/components/DocsLayout';
import { VersionBanner } from '@/components/VersionBanner';
import EditOnGithub from '@/components/EditOnGithub';
import { MarkdownContent } from '@/components/MarkdownContent';
import { generatePageMetadata } from '@/lib/metadata/metadata';
import { getDefaultVersion, getVersionPath, isValidVersion } from '@/lib/versions/version-utils';
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
    const latestPath = getVersionPath(doc.slug, defaultVersion);
    if (metadata.alternates) {
      metadata.alternates.canonical = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://docs.silverstripe.org'}${latestPath}`;
    }
  }

  return metadata;
}

/**
 * Dynamic page renderer
 */
export default async function Page({ params: paramsPromise }: PageProps) {
  // Dynamic imports are used here to keep the initial module
  // evaluation light. This prevents heavy remark/rehype ecosystems from
  // slowing down 'generateStaticParams' or triggering slow cold starts
  // on serverless functions.
  const { markdownToHtmlWithCleanup } = await import('@/lib/markdown/processor');
  const { replaceChildrenMarkers } = await import('@/lib/children/replace-children-markers');
  const { extractHeadings } = await import('@/lib/toc/extract-headings');
  const { generateTocHtml, insertTocAfterH1 } = await import('@/lib/toc/generate-toc-html');

  const params = await paramsPromise;
  const { version, slug } = params;

  // If version is invalid, redirect to the same path with the default version
  // The invalid "version" becomes the first part of the slug path
  if (!isValidVersion(version)) {
    const defaultVersion = getDefaultVersion();
    const pathParts = slug ? [version, ...slug] : [version];
    const slugPath = `/${pathParts.join('/')}/`;
    redirect(`/en/${defaultVersion}${slugPath}`);
  }

  const doc = await getDocumentByParams(version, slug);

  if (!doc) {
    notFound();
  }

  // Build navigation tree
  const allDocs = await getAllDocuments();
  const navTree = buildNavTree(allDocs, version, doc.slug);

  // Extract headings for table of contents (before HTML conversion)
  const headings = extractHeadings(doc.content);
  const tocHtml = generateTocHtml(headings);

  // Convert markdown to HTML with image path resolution and API link rewriting
  let htmlContent = await markdownToHtmlWithCleanup(doc.content, doc.fileAbsolutePath, version);

  // Replace [CHILDREN] markers with rendered children
  htmlContent = replaceChildrenMarkers(htmlContent, doc, allDocs);

  // Insert TOC after the H1 heading
  htmlContent = insertTocAfterH1(htmlContent, tocHtml);

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

        <div className={styles.contentWrapper}>
          <MarkdownContent html={htmlContent} />
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
