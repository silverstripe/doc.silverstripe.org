#!/usr/bin/env node

/**
 * Load source configurations from TypeScript files
 * Parses sources-docs.ts and sources-user.ts to extract SOURCES objects
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Parse TypeScript source file to extract SOURCES object
 * Uses simple regex parsing since we control the file format
 * @param {string} filePath - Path to the TypeScript source file
 * @returns {object} Parsed SOURCES object
 */
function parseSourcesFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract the SOURCES object content between "const SOURCES: SourcesMap = {" and the matching closing "}"
  const sourcesMatch = content.match(/const SOURCES:\s*SourcesMap\s*=\s*(\{[\s\S]*?\n\});/);
  if (!sourcesMatch) {
    throw new Error(`Could not find SOURCES object in ${filePath}`);
  }

  const sourcesStr = sourcesMatch[1];

  // Clean up TypeScript syntax for JSON parsing
  let jsonStr = sourcesStr
    // Remove single-line comments
    .replace(/\/\/[^\n]*/g, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Convert single quotes to double quotes for JSON
    .replace(/'/g, '"')
    // Quote unquoted property keys (handles keys like: repo:, owner:, branch:, docsPath:, etc.)
    .replace(/(\s)([a-zA-Z_][a-zA-Z0-9_-]*)(\s*:)/g, '$1"$2"$3')
    // Remove trailing commas before } or ]
    .replace(/,(\s*[}\]])/g, '$1');

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Failed to parse SOURCES from ${filePath}: ${e.message}`);
  }
}

/**
 * Load sources configuration for a given context
 * @param {'docs' | 'user'} context - The documentation context
 * @returns {object} The SOURCES configuration object
 */
export function loadSources(context) {
  const fileName = context === 'user' ? 'sources-user.ts' : 'sources-docs.ts';
  const filePath = path.join(rootDir, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Sources file not found: ${filePath}`);
  }

  return parseSourcesFile(filePath);
}

/**
 * Get all versions available in the sources config
 * @param {'docs' | 'user'} context - The documentation context
 * @returns {string[]} Array of version strings (e.g., ['3', '4', '5', '6'])
 */
export function getVersions(context) {
  const sources = loadSources(context);
  return Object.keys(sources).sort((a, b) => Number(a) - Number(b));
}

/**
 * Get main config for a version
 * @param {'docs' | 'user'} context - The documentation context
 * @param {string} version - The version string
 * @returns {object|null} The main source config or null
 */
export function getMainConfig(context, version) {
  const sources = loadSources(context);
  return sources[version]?.main || null;
}

/**
 * Get optional features for a version
 * @param {'docs' | 'user'} context - The documentation context
 * @param {string} version - The version string
 * @returns {object} Object mapping feature names to configs
 */
export function getOptionalFeatures(context, version) {
  const sources = loadSources(context);
  return sources[version]?.optionalFeatures || {};
}
