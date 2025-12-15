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
 * Clean a string by removing <em> tags and trimming
 */
function cleanString(str: string): string {
  return str.replace(/<\/?em>/g, '').trim();
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
 * Determine if a position in HTML text is inside code tags
 * Handles both simple <code> tags and code tags with attributes like <code class="...">
 * @param html Full HTML text
 * @param position Position to check
 * @returns true if position is inside <code> tags
 */
function isInsideCodeTags(html: string, position: number): boolean {
  let openCodeCount = 0;
  let i = 0;
  while (i < position && i < html.length) {
    // Check for opening code tag (with or without attributes)
    if (html[i] === '<' && html.substr(i, 5) === '<code' && (html[i + 5] === '>' || !html[i + 5].match(/[a-z]/i))) {
      // Found opening <code> or <code ...>
      openCodeCount += 1;
      // Skip to the end of the tag
      const tagEndIdx = html.indexOf('>', i);
      if (tagEndIdx !== -1) {
        i = tagEndIdx + 1;
      } else {
        i += 5;
      }
    } else if (html.substr(i, 7) === '</code>') {
      openCodeCount -= 1;
      i += 7;
    } else {
      i += 1;
    }
  }
  return openCodeCount > 0;
}

/**
 * Determine if a position in text is inside backticks (inline code)
 * @param text Full text
 * @param position Position to check
 * @returns true if position is inside backticks
 */
function isInsideBackticks(text: string, position: number): boolean {
  let backtickCount = 0;
  for (let i = 0; i < position; i += 1) {
    if (text[i] === '`' && (i === 0 || text[i - 1] !== '\\')) {
      backtickCount += 1;
    }
  }
  // Odd number of backticks means we're inside backticks
  return backtickCount % 2 === 1;
}

/**
 * Find all [CHILDREN] markers in text
 * Skips markers that are inside backticks (inline code) or HTML code tags
 * @param text Text to search
 * @returns Array of marker objects with text and config
 */
export function findChildrenMarkers(
  text: string,
): Array<{ marker: string; config: ChildrenConfig }> {
  const markers: Array<{ marker: string; config: ChildrenConfig }> = [];
  const markerRegex = /\[CHILDREN[^\]]*\]/g;

  let match = markerRegex.exec(text);
  while (match !== null) {
    // Skip this marker if it's inside code tags or backticks
    if (!isInsideCodeTags(text, match.index) && !isInsideBackticks(text, match.index)) {
      const config = parseChildrenMarker(match[0]);
      if (config) {
        markers.push({
          marker: match[0],
          config,
        });
      }
    }
    match = markerRegex.exec(text);
  }

  return markers;
}
