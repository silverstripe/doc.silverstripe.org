import path from 'path';
import { DocumentNode } from '@/types';
import { getConfig } from '@/lib/config';
import { normalizeSlug } from '@/lib/utils/slug-utils';
import { getAllVersions } from '@/lib/versions/version-utils';
import fs from 'fs/promises';
import { buildContentTree } from './build-tree';

// Cache for documents to avoid rebuilding on every request
let cachedDocuments: Map<string, DocumentNode[]> | null = null;

/**
 * Deprecated optional feature folder names that should be filtered out.
 * These exist as duplicates in the main developer-docs repo alongside
 * the correctly-named folders cloned from individual module repos.
 *
 * Mapping: deprecated folder -> canonical folder
 * - content_blocks -> elemental
 * - forms -> userforms
 * - multi-factor_authentication -> mfa
 * - setting_up_advancedworkflow -> advancedworkflow
 */
const DEPRECATED_OPTIONAL_FEATURES = [
  'content_blocks',
  'forms',
  'multi-factor_authentication',
  'setting_up_advancedworkflow',
];

/**
 * Resolve content base path and effective context
 * Returns {path, context} where context may be different from config.docsContext
 * if using a fallback content path
 *
 * Behavior:
 * - If using mock data: uses configured context (docs or user)
 * - If using real content:
 *   1. Tries context-specific path: .cache/{docsContext}/ (e.g., .cache/docs/ or .cache/user/)
 *   2. If not found, falls back to: .cache/content/ (for backward compatibility)
 *   3. When using fallback, context is forced to 'docs' since .cache/content/ only contains docs
 *
 * This means:
 * - First time users with only docs cloned: `npm run dev` and `npm run dev:docs` work
 * - Users who want user content: must run `npm run clone:user` first, then `npm run dev:user`
 * - Without clone, user context falls back to docs fallback, which returns no user content
 *   (500 error)
 */
async function resolveContentBasePathWithContext(): Promise<{ path: string; context: 'docs' | 'user' }> {
  const config = getConfig();

  if (config.useMockData) {
    // Mock data path is context-agnostic, use configured context
    const mockPaths = [
      path.join(process.cwd(), 'tests/fixtures/mock-content'),
      path.join(__dirname, '../../../tests/fixtures/mock-content'),
    ];

    for (const p of mockPaths) {
      try {
        await fs.access(p);
        return { path: p, context: config.docsContext };
      } catch {
        // Continue to next path
      }
    }

    // Return default if none exist
    return { path: mockPaths[0], context: config.docsContext };
  }

  // Real content - try context-specific path first
  const contextSpecificPath = path.join(process.cwd(), '.cache', config.docsContext);
  try {
    await fs.access(contextSpecificPath);
    return { path: contextSpecificPath, context: config.docsContext };
  } catch {
    // Fallback to old location for backward compatibility
    const fallbackPath = path.join(process.cwd(), '.cache', 'content');
    // When using fallback, force context to 'docs' since that's what it contains
    return { path: fallbackPath, context: 'docs' };
  }
}

/**
 * Get all documents from content tree (real or mock), filtered by current DOCS_CONTEXT
 */
async function getAllDocumentsInternal(): Promise<DocumentNode[]> {
  // Determine content base path and effective context first to check cache key
  const contextPath = await resolveContentBasePathWithContext();
  const { path: contentBase, context: effectiveContext } = contextPath;

  if (cachedDocuments) {
    const allCached = Array.from(cachedDocuments.values()).flat();
    return filterByContext(allCached, effectiveContext);
  }

  const documents: DocumentNode[] = [];

  // Use local variable during loading to avoid race conditions
  // across parallel workers - only set cachedDocuments after fully loaded
  const localCache = new Map<string, DocumentNode[]>();

  // Build versions map - v3, v4, v5, and v6
  const versionDirs = getAllVersions().map((v) => `v${v}`);

  for (const versionDir of versionDirs) {
    const versionPath = path.join(contentBase, versionDir);
    try {
      // Load main docs for this version
      const versionDocs = await buildContentTree(
        versionPath,
        versionDir.replace(/^v/, ''),
        effectiveContext,
      );
      documents.push(...versionDocs);
      localCache.set(versionDir, versionDocs);

      // Load optional_features and its subdirectories
      const optionalFeaturesPath = path.join(versionPath, 'optional_features');
      try {
        // Load everything under optional_features with the optional_features parameter
        // For docs context: the optional_features/index.md IS the Optional Features section,
        // parent is version root
        // For user context: the 03_Optional_features/index.md is the section, so
        // optional_features modules should be children of /en/{version}/optional_features/
        // (not siblings)
        const versionNum = versionDir.replace(/^v/, '');
        const rootParentSlug = effectiveContext === 'user'
          ? `/en/${versionNum}/optional_features/` // User: optional features are children of the section
          : `/en/${versionNum}/`; // Docs: optional features index is a root child
        const optionalFeaturesDocs = await buildContentTree(
          optionalFeaturesPath,
          versionNum,
          effectiveContext,
          'optional_features',
          rootParentSlug,
        );

        // Process optional feature documents to set the correct optionalFeature field
        // and adjust filePath to be relative to the specific feature (not optional_features)
        const processedDocs = optionalFeaturesDocs.map((doc) => {
          // Extract feature name from slug: /en/6/optional_features/linkfield/... -> linkfield
          // The optional_features index itself (slug ending with /optional_features/)
          // should NOT have optionalFeature set
          const slugParts = doc.slug.split('/').filter(Boolean);
          const featureIndex = slugParts.indexOf('optional_features');

          if (featureIndex >= 0 && featureIndex + 1 < slugParts.length) {
            const featureName = slugParts[featureIndex + 1];

            // Adjust filePath: remove the feature name prefix since buildGithubEditUrl
            // expects filePath relative to the feature module
            // (e.g., "index.md" not "linkfield/index.md")
            let adjustedFilePath = doc.filePath;
            if (adjustedFilePath.startsWith(`${featureName}/`)) {
              adjustedFilePath = adjustedFilePath.substring(featureName.length + 1);
            }

            return {
              ...doc,
              optionalFeature: featureName,
              filePath: adjustedFilePath,
            };
          }
          return doc;
        });

        // Filter out documents from deprecated optional feature folders
        // NOTE: This only applies to docs context. For user context, these folder
        // names are correct.
        // In docs context, the main developer-docs repo has deprecated folders
        // (content_blocks, forms, etc.)
        // that duplicate content from the properly-named module repos (elemental, userforms, etc.)
        const filteredDocs = processedDocs.filter((doc) => {
          if (!doc.optionalFeature) return true;
          // Only filter deprecated folders in docs context
          if (effectiveContext === 'user') return true;
          return !DEPRECATED_OPTIONAL_FEATURES.includes(doc.optionalFeature);
        });

        documents.push(...filteredDocs);
        localCache.set(`${versionDir}/optional_features`, filteredDocs);
      } catch (error) {
        // optional_features directory may not exist, continue
      }
    } catch (error) {
      // Version directory may not exist, continue
      console.warn(`Version ${versionDir} not found, skipping`);
    }
  }

  // Set the module-level cache after all loading is complete
  // This prevents race conditions in parallel workers
  cachedDocuments = localCache;

  return filterByContext(documents, effectiveContext);
}

/**
 * Filter documents by context
 */
function filterByContext(documents: DocumentNode[], context?: 'docs' | 'user'): DocumentNode[] {
  const config = getConfig();
  const filterContext = context ?? config.docsContext;
  return documents.filter((doc) => doc.category === filterContext);
}

/**
 * Get all documents from content tree
 */
export async function getAllDocuments(): Promise<DocumentNode[]> {
  return getAllDocumentsInternal();
}

/**
 * Get a document by its slug
 * Slug format: /en/{version}/{category}/{page}/
 */
export async function getDocumentBySlug(slug: string): Promise<DocumentNode | null> {
  const docs = await getAllDocuments();

  const normalizedSlugEnd = normalizeSlug(slug);

  // Find exact match first
  const exactMatch = docs.find((doc) => doc.slug === normalizedSlugEnd);
  if (exactMatch) return exactMatch;

  // Case-insensitive search for flexibility
  const caseInsensitiveMatch = docs.find(
    (doc) => doc.slug.toLowerCase() === normalizedSlugEnd.toLowerCase(),
  );
  if (caseInsensitiveMatch) return caseInsensitiveMatch;

  return null;
}

/**
 * Get document by version and path segments
 * Converts params from dynamic route to full slug
 */
export async function getDocumentByParams(
  version: string,
  slug?: string[],
): Promise<DocumentNode | null> {
  // Build full slug from params
  const parts = ['en', version, ...(slug || [])];
  const fullSlug = `/${parts.join('/')}/`;

  return getDocumentBySlug(fullSlug);
}

/**
 * Get child documents of a given parent
 */
export async function getChildDocuments(parentSlug: string): Promise<DocumentNode[]> {
  const docs = await getAllDocuments();
  return docs.filter((doc) => doc.parentSlug === parentSlug && !doc.hideSelf);
}

/**
 * Clear cache (for testing)
 */
export function clearDocumentCache(): void {
  cachedDocuments = null;
}
