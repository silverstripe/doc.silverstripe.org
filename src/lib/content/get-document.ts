import path from 'path';
import { DocumentNode } from '@/types';
import { buildContentTree } from './build-tree';
import { getConfig } from '@/lib/config';
import fs from 'fs/promises';

// Cache for documents to avoid rebuilding on every request
let cachedDocuments: Map<string, DocumentNode[]> | null = null;

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
 * Get all documents from content tree (real or mock)
 */
async function getAllDocumentsInternal(): Promise<DocumentNode[]> {
  if (cachedDocuments) {
    return Array.from(cachedDocuments.values()).flat();
  }

  const config = getConfig();
  const documents: DocumentNode[] = [];
  
  // Determine content base path
  const contentBase = await resolveContentBasePath();

  // Build versions map - v5 and v6 (and potentially others)
  const versionDirs = ['v5', 'v6'];
  
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
        // The root parent slug should be the version root so Optional Features appears in nav
        const optionalFeaturesDocs = await buildContentTree(
          optionalFeaturesPath,
          versionDir.replace(/^v/, ''),
          config.docsContext,
          'optional_features',
          `/en/${versionDir.replace(/^v/, '')}/` // rootParentSlug = version root
        );
        documents.push(...optionalFeaturesDocs);
        cachedDocuments.set(`${versionDir}/optional_features`, optionalFeaturesDocs);
      } catch (error) {
        // optional_features directory may not exist, continue
      }
    } catch (error) {
      // Version directory may not exist, continue
      console.warn(`Version ${versionDir} not found, skipping`);
    }
  }

  return documents;
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
  
  // Normalize slug for comparison - remove leading/trailing slashes
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const normalizedSlugEnd = normalizedSlug.endsWith('/') ? normalizedSlug : `${normalizedSlug}/`;

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
