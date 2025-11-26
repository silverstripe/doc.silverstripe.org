#!/usr/bin/env node

/**
 * Clone documentation content from git repositories to .cache/content/
 * Reads git clone sources from src/config/sources-{context}.cjs
 * Handles multiple versions (v3-v6) and optional features
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

/**
 * Parse glob patterns to determine include/exclude paths
 */
function parsePattern(pattern) {
  // Extract the base path from patterns like 'en/**' or 'docs/en/!(userguide)/**'
  if (pattern.startsWith('docs/en')) {
    return 'docs/en';
  } else if (pattern.startsWith('en')) {
    return 'en';
  }
  return '';
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Copy files matching pattern from source to destination
 * For 'en/**': copy from en/ directly to destDir (e.g., en/01_Getting_Started/ -> v6/01_Getting_Started/)
 * For 'docs/en/**': copy from docs/en/ directly to destDir (skip docs/en prefix)
 * Also copies image files (.png, .jpg, .jpeg, .gif, .webp, .svg)
 */
function copyFiles(sourceDir, destDir, sourcePath, optionalFeatureName = null) {
  const fullSourcePath = path.join(sourceDir, sourcePath);
  
  if (!fs.existsSync(fullSourcePath)) {
    return;
  }
  
  // Image file extensions to copy
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'];
  
  function walk(dir, rel = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(rel, entry.name);
      
      if (entry.isDirectory()) {
        // For optional features, skip anything not in the expected path
        // This filters out 'userguide' when we want docs, or docs when we want userguide
        if (optionalFeatureName && relPath === 'userguide') {
          // For docs context optional features, skip userguide
          // For user context, keep userguide
          continue;
        }
        walk(fullPath, relPath);
      } else {
        // Check if it's a markdown file or image
        const isMarkdown = entry.name.endsWith('.md');
        const isImage = imageExtensions.includes(path.extname(entry.name).toLowerCase());
        
        if (isMarkdown || isImage) {
          // For optional features, strip the leading path and optionalFeatureName if present
          let finalPath = relPath;
          
          // If the relPath starts with 'userguide/', remove it
          if (finalPath.startsWith('userguide' + path.sep)) {
            finalPath = finalPath.substring('userguide/'.length);
          }
          
          const destPath = path.join(destDir, finalPath);
          ensureDir(path.dirname(destPath));
          fs.copyFileSync(fullPath, destPath);
        }
      }
    }
  }
  
  walk(fullSourcePath);
}

/**
 * Clone a single repository
 */
async function cloneRepository(config) {
  const { remote, branch, patterns, outputDir, version, name } = config;
  
  // Use unique directory per repository+branch to avoid conflicts
  const repoName = path.basename(remote, '.git');
  const tempDir = path.join(rootDir, '.cache', 'temp-clones', `${repoName}--${branch}`);
  ensureDir(tempDir);
  
  try {
    // Clone the repository if not already cloned for this branch
    if (!fs.existsSync(path.join(tempDir, '.git'))) {
      execSync(`git clone --depth 1 --branch ${branch} ${remote} .`, {
        cwd: tempDir,
        stdio: 'pipe'
      });
    }
    
    // Copy files matching pattern
    const sourcePath = parsePattern(patterns);
    if (sourcePath) {
      const isOptionalFeature = name.includes('optional_features');
      copyFiles(tempDir, outputDir, sourcePath, isOptionalFeature ? name : null);
    }
    
  } catch (error) {
    throw error;
  }
}

/**
 * Build repository config from Gatsby sources
 */
function buildRepoConfig(gatsbySource, version, context) {
  const { remote, branch, patterns, name } = gatsbySource.options;
  
  // Determine output directory based on name
  // name format: "docs--6" or "docs--6--optional_features/linkfield"
  // Parts are separated by -- and / (forward slash is used in optional feature names)
  let relPath;
  
  if (name.includes('optional_features')) {
    // Extract the optional feature path after 'docs--{version}--'
    const prefix = `docs--${version}--`;
    const optionalPart = name.substring(prefix.length).replace(/--/g, '/');
    relPath = optionalPart; // e.g., "optional_features/linkfield"
  } else {
    // Main docs
    relPath = '';
  }
  
  const outputDir = path.join(rootDir, '.cache', 'content', `v${version}`, relPath);
  
  return {
    remote,
    branch,
    patterns,
    outputDir,
    version,
    name,
    context
  };
}

/**
 * Main clone function
 */
async function cloneDocs() {
  try {
    const context = process.env.DOCS_CONTEXT || 'docs';
    console.log(`\n🚀 Cloning ${context} documentation...\n`);
    
    // Load Gatsby sources using require (CommonJS)
    const sourcesFile = path.join(rootDir, 'src', 'config', `sources-${context}.cjs`);
    if (!fs.existsSync(sourcesFile)) {
      throw new Error(`Sources file not found: ${sourcesFile}`);
    }
    
    const sources = require(sourcesFile);
    
    // Group by version
    const versionMap = new Map();
    for (const source of sources) {
      const match = source.options.name.match(/^(docs|user)--(\d+)/);
      if (!match) continue;
      
      const [, , version] = match;
      if (!versionMap.has(version)) {
        versionMap.set(version, []);
      }
      versionMap.get(version).push(source);
    }
    
    // Clone each version
    for (const [version, versionSources] of versionMap) {
      console.log(`📦 Version ${version}:`);
      
      for (const source of versionSources) {
        const config = buildRepoConfig(source, version, context);
        try {
          await cloneRepository(config);
          console.log(`    ✓ ${source.options.name}`);
        } catch (error) {
          console.error(`    ✗ ${source.options.name}: ${error.message}`);
          // Continue with next repo
        }
      }
    }
    
    console.log('\n✅ Clone completed successfully\n');
  } catch (error) {
    console.error('❌ Clone failed:', error.message);
    process.exit(1);
  }
}

// Run the clone
cloneDocs();
