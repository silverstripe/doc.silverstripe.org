#!/usr/bin/env node

/**
 * Load source configurations from JSON files
 * Reads sources-docs.json and sources-user.json to extract SOURCES objects
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Load sources configuration for a given context from JSON file
 * @param {'docs' | 'user'} context - The documentation context
 * @returns {object} The SOURCES configuration object
 */
export function loadSources(context) {
  const fileName = context === 'user' ? 'sources-user.json' : 'sources-docs.json';
  const filePath = path.join(rootDir, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Sources file not found: ${filePath}`);
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Failed to parse SOURCES from ${filePath}: ${e.message}`);
  }
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
