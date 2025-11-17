/**
 * Configuration object extracted from [CHILDREN ...] syntax
 */
export interface ChildrenConfig {
  folderName?: string;
  exclude?: string[];
  only?: string[];
  asList?: boolean;
  includeFolders?: boolean;
  reverse?: boolean;
}

/**
 * Parse a [CHILDREN] marker from text
 * Supports:
 * - [CHILDREN] - basic, all children
 * - [CHILDREN asList] - list format
 * - [CHILDREN Folder="model"] - specific folder
 * - [CHILDREN Exclude="installation,composer"] - exclusions
 * - [CHILDREN Only="installation"] - inclusions only
 * - [CHILDREN reverse] - reverse order
 * - [CHILDREN includeFolders] - include index pages
 * - Combinations of above flags
 *
 * @param text Text potentially containing [CHILDREN] marker
 * @returns ChildrenConfig if marker found, null otherwise
 */
export function parseChildrenMarker(text: string): ChildrenConfig | null {
  const config: ChildrenConfig = {};

  // Try Folder parameter
  let match = text.match(/\[CHILDREN\s+Folder="([^"]+)"([^\]]*)\]/);
  if (match) {
    config.folderName = cleanString(match[1]);
    parseFlags(`[CHILDREN ${match[2]}]`, config);
    return config;
  }
  match = text.match(/\[CHILDREN\s+Folder=([^\s\]]+)([^\]]*)\]/);
  if (match) {
    config.folderName = cleanString(match[1]);
    parseFlags(`[CHILDREN ${match[2]}]`, config);
    return config;
  }

  // Try Exclude parameter
  match = text.match(/\[CHILDREN\s+Exclude="([^"]+)"([^\]]*)\]/);
  if (match) {
    const excludeStr = cleanString(match[1]);
    config.exclude = excludeStr
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    parseFlags(`[CHILDREN ${match[2]}]`, config);
    return config;
  }
  match = text.match(/\[CHILDREN\s+Exclude=([^\s\]]+)([^\]]*)\]/);
  if (match) {
    const excludeStr = cleanString(match[1]);
    config.exclude = excludeStr
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    parseFlags(`[CHILDREN ${match[2]}]`, config);
    return config;
  }

  // Try Only parameter
  match = text.match(/\[CHILDREN\s+Only="([^"]+)"([^\]]*)\]/);
  if (match) {
    const onlyStr = cleanString(match[1]);
    config.only = onlyStr
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    parseFlags(`[CHILDREN ${match[2]}]`, config);
    return config;
  }
  match = text.match(/\[CHILDREN\s+Only=([^\s\]]+)([^\]]*)\]/);
  if (match) {
    const onlyStr = cleanString(match[1]);
    config.only = onlyStr
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    parseFlags(`[CHILDREN ${match[2]}]`, config);
    return config;
  }

  // Basic [CHILDREN] with optional flags
  match = text.match(/\[CHILDREN(\s[^\]]*?)?\]/);
  if (match) {
    parseFlags(match[0], config);
    return config;
  }

  return null;
}

/**
 * Parse flags from marker string
 */
function parseFlags(markerText: string, config: ChildrenConfig): void {
  if (markerText.includes(' asList')) {
    config.asList = true;
  }
  if (markerText.includes(' includeFolders')) {
    config.includeFolders = true;
  }
  if (markerText.includes(' reverse')) {
    config.reverse = true;
  }
}

/**
 * Clean a string by removing <em> tags and trimming
 */
function cleanString(str: string): string {
  return str.replace(/<\/?em>/g, '').trim();
}

/**
 * Find all [CHILDREN] markers in text
 * @param text Text to search
 * @returns Array of marker objects with text and config
 */
export function findChildrenMarkers(
  text: string
): Array<{ marker: string; config: ChildrenConfig }> {
  const markers: Array<{ marker: string; config: ChildrenConfig }> = [];
  const markerRegex = /\[CHILDREN[^\]]*\]/g;

  let match;
  while ((match = markerRegex.exec(text)) !== null) {
    const config = parseChildrenMarker(match[0]);
    if (config) {
      markers.push({
        marker: match[0],
        config,
      });
    }
  }

  return markers;
}
