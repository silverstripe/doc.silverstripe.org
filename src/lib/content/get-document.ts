import path from 'path';
import { DocumentNode } from '@/types';
import { buildContentTree } from './build-tree';
import { getConfig } from '@/lib/config';
import { normalizeSlug } from '@/lib/utils';
import { getAllVersions } from '@/lib/versions';
import fs from 'fs/promises';

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
 * Resolve content base path - handles both testing and production
 */
async function resolveContentBasePath(): Promise<string> {
  const config = getConfig();
  
  // Try multiple paths in order
  const pathsToTry = config.useMockData
    ? [
        path.join(process.cwd(), 'tests/fixtures/mock-content'),
        path.join(__dirname, '../../../tests/fixtures/mock-content'),
      ]
    : [
        path.join(process.cwd(), '.cache/content'),
      ];

  for (const p of pathsToTry) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // Continue to next path
    }
  }

  // Return default if none exist (will error when actually trying to read)
  return pathsToTry[0];
}

/**
 * Get all documents from content tree (real or mock), filtered by current DOCS_CONTEXT
 */
async function getAllDocumentsInternal(): Promise<DocumentNode[]> {
  if (cachedDocuments) {
    const allCached = Array.from(cachedDocuments.values()).flat();
    return filterByContext(allCached);
  }

  const config = getConfig();
  const documents: DocumentNode[] = [];
  
  // Determine content base path
  const contentBase = await resolveContentBasePath();

  // Build versions map - v3, v4, v5, and v6
  const versionDirs = getAllVersions().map(v => `v${v}`);
  
  if (!cachedDocuments) {
    cachedDocuments = new Map();
  }
  
  for (const versionDir of versionDirs) {
    const versionPath = path.join(contentBase, versionDir);
    try {
      // Load main docs for this version
      const versionDocs = await buildContentTree(
        versionPath,
        versionDir.replace(/^v/, ''),
        config.docsContext
      );
      documents.push(...versionDocs);
      cachedDocuments.set(versionDir, versionDocs);
      
      // Load optional_features and its subdirectories
      const optionalFeaturesPath = path.join(versionPath, 'optional_features');
      try {
        // Load everything under optional_features with the optional_features parameter
        // The root parent slug should be the version root so Optional Features index becomes a root child
        const optionalFeaturesDocs = await buildContentTree(
          optionalFeaturesPath,
          versionDir.replace(/^v/, ''),
          config.docsContext,
          'optional_features',
          `/en/${versionDir.replace(/^v/, '')}/` // rootParentSlug = version root
        );
        
        // Process optional feature documents to set the correct optionalFeature field
        // and adjust filePath to be relative to the specific feature (not optional_features)
        const processedDocs = optionalFeaturesDocs.map(doc => {
          // Extract feature name from slug: /en/6/optional_features/linkfield/... -> linkfield
          // The optional_features index itself (slug ending with /optional_features/) should NOT have optionalFeature set
          const slugParts = doc.slug.split('/').filter(Boolean);
          const featureIndex = slugParts.indexOf('optional_features');
          
          if (featureIndex >= 0 && featureIndex + 1 < slugParts.length) {
            const featureName = slugParts[featureIndex + 1];
            
            // Adjust filePath: remove the feature name prefix since buildGithubEditUrl 
            // expects filePath relative to the feature module (e.g., "index.md" not "linkfield/index.md")
            let adjustedFilePath = doc.filePath;
            if (adjustedFilePath.startsWith(`${featureName}/`)) {
              adjustedFilePath = adjustedFilePath.substring(featureName.length + 1);
            }
            
            return { 
              ...doc, 
              optionalFeature: featureName,
              filePath: adjustedFilePath
            };
          }
          return doc;
        });
        
        // Filter out documents from deprecated optional feature folders
        const filteredDocs = processedDocs.filter(doc => {
          if (!doc.optionalFeature) return true;
          return !DEPRECATED_OPTIONAL_FEATURES.includes(doc.optionalFeature);
        });
        
        documents.push(...filteredDocs);
        cachedDocuments.set(`${versionDir}/optional_features`, filteredDocs);
      } catch (error) {
        // optional_features directory may not exist, continue
      }
    } catch (error) {
      // Version directory may not exist, continue
      console.warn(`Version ${versionDir} not found, skipping`);
    }
  }

  return filterByContext(documents);
}

/**
 * Filter documents by the current DOCS_CONTEXT configuration
 */
function filterByContext(documents: DocumentNode[]): DocumentNode[] {
  const config = getConfig();
  return documents.filter(doc => doc.category === config.docsContext);
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
  const exactMatch = docs.find(doc => doc.slug === normalizedSlugEnd);
  if (exactMatch) return exactMatch;

  // Case-insensitive search for flexibility
  const caseInsensitiveMatch = docs.find(
    doc => doc.slug.toLowerCase() === normalizedSlugEnd.toLowerCase()
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
  slug?: string[]
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
  return docs.filter(doc => doc.parentSlug === parentSlug && !doc.hideSelf);
}

/**
 * Clear cache (for testing)
 */
export function clearDocumentCache(): void {
  cachedDocuments = null;
}
