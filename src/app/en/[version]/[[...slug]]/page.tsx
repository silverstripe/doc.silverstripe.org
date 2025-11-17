import { notFound } from 'next/navigation';
import { getDocumentByParams, getAllDocuments } from '@/lib/content/get-document';
import { buildSlugFromParams } from '@/lib/routing';
import { buildNavTree } from '@/lib/nav';
import { DocsLayout } from '@/components/DocsLayout';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

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
      slug: slug.length > 0 ? slug : undefined
    });
  }

  return params;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { getDefaultVersion, getVersionPath } = await import('@/lib/versions');
  const params = await props.params;
  const doc = await getDocumentByParams(params.version, params.slug);

  if (!doc) {
    return {
      title: 'Not Found'
    };
  }

  const metadata = generatePageMetadata(doc);

  // Add canonical URL for non-current versions
  const defaultVersion = getDefaultVersion();
  if (params.version !== defaultVersion) {
    const latestPath = getVersionPath(doc.slug, defaultVersion);
    if (metadata.alternates) {
      metadata.alternates.canonical = latestPath;
    }
  }

  return metadata;
}

/**
 * Dynamic page renderer
 */
export default async function Page(props: PageProps) {
  const { markdownToHtmlWithCleanup } = await import('@/lib/markdown/processor');
  const { replaceChildrenMarkers } = await import('@/lib/children');
  
  const params = await props.params;
  const doc = await getDocumentByParams(params.version, params.slug);

  if (!doc) {
    notFound();
  }

  // Build navigation tree
  const allDocs = await getAllDocuments();
  const navTree = buildNavTree(allDocs, params.version, doc.slug);

  // Convert markdown to HTML with image path resolution
  let htmlContent = await markdownToHtmlWithCleanup(doc.content, doc.fileAbsolutePath);

  // Replace [CHILDREN] markers with rendered children
  htmlContent = replaceChildrenMarkers(htmlContent, doc, allDocs);

  return (
    <DocsLayout
      navTree={navTree}
      currentSlug={doc.slug}
      version={params.version}
    >
      <article>
        <h1 className="text-4xl font-bold mb-4">{doc.title}</h1>
        
        {doc.summary && (
          <p className="text-xl text-gray-600 mb-6">{doc.summary}</p>
        )}

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Version {doc.version} • {doc.category}
          </p>
        </footer>
      </article>
    </DocsLayout>
  );
}
