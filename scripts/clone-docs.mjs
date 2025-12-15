#!/usr/bin/env node

/**
 * Clone documentation content from git repositories to .cache/content/
 * Reads git clone sources from root-level sources-{context}.ts files
 * Handles multiple versions (v3-v6) and optional features
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { loadSources } from './sources-loader.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

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
 * For 'docs/en/userguide/**': copy from docs/en/userguide/ directly to destDir (skip docs/en/userguide prefix)
 * Also copies image files (.png, .jpg, .jpeg, .gif, .webp, .svg)
 * @param {string} sourceDir - Source directory
 * @param {string} destDir - Destination directory
 * @param {string} sourcePath - Source path pattern
 * @param {string} docsPath - The docsPath from config (e.g., 'en', 'docs/en', 'docs/en/userguide')
 * @param {string} excludePath - Optional path to exclude (e.g., 'docs/en/userguide')
 */
function copyFiles(sourceDir, destDir, sourcePath, docsPath = 'en', excludePath = null) {
  const fullSourcePath = path.join(sourceDir, sourcePath);
  
  if (!fs.existsSync(fullSourcePath)) {
    return;
  }
  
  // Image file extensions to copy
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'];
  
  // Extract the base path to strip from copied files
  // e.g., 'en' -> '', 'docs/en' -> '', 'docs/en/userguide' -> ''
  const basePathParts = docsPath.split('/').filter(p => p);
  const basePath = basePathParts.join(path.sep);
  
  // Convert excludePath to be relative to docsPath
  // e.g., excludePath='docs/en/userguide' and docsPath='docs/en' -> 'userguide'
  let excludePathRelative = null;
  if (excludePath && docsPath) {
    // Normalize both paths to use platform separator
    const excludeNormalized = excludePath.split('/').join(path.sep);
    const docsPathNormalized = docsPath.split('/').join(path.sep);
    
    // If excludePath starts with docsPath, strip it
    if (excludeNormalized.startsWith(docsPathNormalized + path.sep)) {
      excludePathRelative = excludeNormalized.substring(docsPathNormalized.length + path.sep.length);
    } else if (excludeNormalized.startsWith(docsPathNormalized)) {
      excludePathRelative = excludeNormalized.substring(docsPathNormalized.length);
    }
  }

  function walk(dir, rel = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(rel, entry.name);
      
      // Check if this path should be excluded
      if (excludePathRelative) {
        // Check if current path is within excluded directory
        const isExcluded = relPath === excludePathRelative || relPath.startsWith(excludePathRelative + path.sep);
        if (isExcluded) {
          continue; // Skip this file/directory
        }
      }
      
      if (entry.isDirectory()) {
        walk(fullPath, relPath);
      } else {
        // Check if it's a markdown file or image
        const isMarkdown = entry.name.endsWith('.md');
        const isImage = imageExtensions.includes(path.extname(entry.name).toLowerCase());
        
        if (isMarkdown || isImage) {
          // Strip the base path from the relative path
          let finalPath = relPath;
          if (basePath && finalPath.startsWith(basePath)) {
            finalPath = finalPath.substring(basePath.length);
            if (finalPath.startsWith(path.sep)) {
              finalPath = finalPath.substring(1);
            }
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
  const { remote, branch, patterns, outputDir, version, name, docsPath, excludePath } = config;
  
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
    
    // Copy files from docsPath (e.g., 'en', 'docs/en', 'docs/en/userguide')
    // docsPath already contains the full path we want to copy from
    if (docsPath) {
      copyFiles(tempDir, outputDir, docsPath, docsPath, excludePath);
    }
    
  } catch (error) {
    throw error;
  }
}

/**
 * Build repository config from source configuration
 */
function buildRepoConfig(sourceConfig, version) {
  const { remote, branch, patterns, name, docsPath, excludePath } = sourceConfig.options;
  
  // Extract context from name (e.g., "docs--6" or "user--6" -> "docs" or "user")
  const contextMatch = name.match(/^(docs|user)--/);
  const context = contextMatch ? contextMatch[1] : 'docs';
  
  // Determine output directory based on name
  // name format: "docs--6" or "docs--6--optional_features/linkfield"
  // Parts are separated by -- and / (forward slash is used in optional feature names)
  let relPath;
  
  if (name.includes('optional_features')) {
    // Extract the optional feature path after '{context}--{version}--'
    const prefix = `${context}--${version}--`;
    const optionalPart = name.substring(prefix.length).replace(/--/g, '/');
    relPath = optionalPart; // e.g., "optional_features/linkfield"
  } else {
    // Main docs
    relPath = '';
  }
  
  const outputDir = path.join(rootDir, '.cache', context, `v${version}`, relPath);
  
  return {
    remote,
    branch,
    patterns,
    outputDir,
    version,
    name,
    docsPath,
    excludePath
  };
}

/**
 * Build source config list from TypeScript source files
 * Converts the structured TS config into Gatsby-like source array
 */
function buildSourcesList(context) {
  const sourceConfig = loadSources(context);
  const contextPrefix = context === 'user' ? 'user' : 'docs';

  const sources = [];

  for (const [version, versionConfig] of Object.entries(sourceConfig)) {
    const mainDocsPath = versionConfig.main.docsPath || 'en';
    const docsPattern = `${mainDocsPath}/**`;

    // Main docs
    sources.push({
      resolve: 'gatsby-source-git',
      options: {
        name: `${contextPrefix}--${version}`,
        remote: `https://github.com/${versionConfig.main.owner}/${versionConfig.main.repo}.git`,
        branch: versionConfig.main.branch,
        patterns: docsPattern,
        docsPath: mainDocsPath
      }
    });

    // Optional features
    if (versionConfig.optionalFeatures) {
      for (const [featureName, config] of Object.entries(versionConfig.optionalFeatures)) {
        const featureDocsPath = config.docsPath || 'docs/en';
        const featurePattern = `${featureDocsPath}/**`;

        sources.push({
          resolve: 'gatsby-source-git',
          options: {
            name: `${contextPrefix}--${version}--optional_features/${featureName}`,
            remote: `https://github.com/${config.owner}/${config.repo}.git`,
            branch: config.branch,
            patterns: featurePattern,
            docsPath: featureDocsPath,
            excludePath: config.excludePath || null
          }
        });
      }
    }
  }

  return sources;
}

/**
 * Main clone function
 */
async function cloneDocs() {
  try {
    const context = process.env.DOCS_CONTEXT || 'docs';
    console.log(`\n🚀 Cloning ${context} documentation...\n`);
    
    // Build sources from embedded configuration
    const sources = buildSourcesList(context);
    
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
        const config = buildRepoConfig(source, version);
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
