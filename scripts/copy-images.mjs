/**
 * Copy content images to out directory for static export
 * Also copies to public directory for development server
 * Handles both mock content (development) and real content (production)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function findImages(dir) {
  const files = [];
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...findImages(fullPath));
      } else if (imageExtensions.includes(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Silently skip directories that can't be read
  }
  
  return files;
}

function copyToDestination(sourceDir, destDir, description) {
  // Get list of version directories (v5, v6, etc.)
  const entries = fs.readdirSync(sourceDir);
  const versionDirs = entries.filter(entry => {
    const fullPath = path.join(sourceDir, entry);
    return entry.match(/^v\d+$/) && fs.statSync(fullPath).isDirectory();
  });

  if (versionDirs.length === 0) {
    console.log('  ⚠️  No version directories found');
    return 0;
  }

  let totalCopied = 0;

  // Copy images from each version
  for (const versionDir of versionDirs) {
    const versionPath = path.join(sourceDir, versionDir);
    const imageFiles = findImages(versionPath);

    // Copy each image, preserving directory structure
    for (const imageFile of imageFiles) {
      const relPath = path.relative(sourceDir, imageFile);
      const destPath = path.join(destDir, relPath);
      
      // Create destination directory if needed
      ensureDir(path.dirname(destPath));
      
      // Copy the file
      fs.copyFileSync(imageFile, destPath);
      totalCopied++;
    }
  }

  return totalCopied;
}

async function copyImages() {
  try {
    const useMockData = process.env.NEXT_USE_MOCK_DATA === 'true';
    const docsContext = process.env.DOCS_CONTEXT || 'docs';
    
    // Determine source directory
    let sourceDir;
    if (useMockData) {
      sourceDir = path.join(rootDir, 'tests/fixtures/mock-content');
      console.log('📋 Using mock content images from:', sourceDir);
    } else {
      sourceDir = path.join(rootDir, '.cache', docsContext);
      console.log('📋 Using real content images from:', sourceDir);
    }

    // Check if source exists
    if (!fs.existsSync(sourceDir)) {
      console.log('⚠️  Source directory does not exist:', sourceDir);
      console.log('   This is OK if content hasn\'t been cloned yet.');
      return;
    }

    console.log('📂 Copying images to output directories...');

    // Copy to public/ for dev server
    console.log('  → public/ (development server)');
    const publicCopied = copyToDestination(
      sourceDir,
      path.join(rootDir, 'public'),
      'public'
    );

    // Copy to out/ for static export
    console.log('  → out/ (static export)');
    const outCopied = copyToDestination(
      sourceDir,
      path.join(rootDir, 'out'),
      'out'
    );

    const totalCopied = publicCopied + outCopied;
    console.log(`✅ Copied ${totalCopied} image file(s) to output directories`);
  } catch (error) {
    console.error('❌ Error copying images:', error.message);
    process.exit(1);
  }
}

copyImages();

