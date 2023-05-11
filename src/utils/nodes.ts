import parse from 'html-react-parser';
import { ReactElement } from 'react';
import { SilverstripeDocument } from '../types';
import sortFiles from './sortFiles';

let __nodes: SilverstripeDocument[];
let __currentVersion: string | null = null;
let __path: string | null = null;

const homeMap = new Map();
const childrenMap = new Map();
const navChildrenMap = new Map();
const siblingMap = new Map();
const parentMap = new Map();
const nodeMap = new Map();

/**
 * Hydrate these functions with the list of all nodes
 * @param nodes 
 */
const initialise = (nodes: SilverstripeDocument[]) => __nodes = nodes;

/**
 * Get all documents in the source
 */
const getNodes = (): SilverstripeDocument[] => __nodes;

/**
 * Get the children of a given node
 *
 * @param node
 * @param includeFolders
 */
const getChildren = (
  node: SilverstripeDocument,
  includeFolders: boolean = true
): SilverstripeDocument[] => {
  const sku = `${node.slug}${includeFolders ? '1' : '0'}`;
  if (childrenMap.has(sku)) {
    return childrenMap.get(sku);
  }
  const nodes = getNodes();
  let children: SilverstripeDocument[] = [];
  if (node.isIndex) {
    children = nodes.filter(n => {
      return n.parentSlug === node.slug && (includeFolders || !n.isIndex);
    }).sort(sortFiles);
  }
  childrenMap.set(sku, children);

  return childrenMap.get(sku);
}

/**
 * Get children of a given node that should be shown in navigation
 *
 * @param node
 */
const getNavChildren = (node: SilverstripeDocument): SilverstripeDocument[] => {
  if (navChildrenMap.has(node.slug)) {
    return navChildrenMap.get(node.slug);
  }
  let children: SilverstripeDocument[] = [];
  if (!node.hideChildren) {
    children = getChildren(node, true).filter(n => !n.hideSelf);
  }

  getChildren(node, true).filter(n => n.unhideSelf).forEach(c => children.push(c));

  navChildrenMap.set(node.slug, children);

  return navChildrenMap.get(node.slug);
};

/**
 * Get the siblings of a given node
 *
 * @param node
 */
const getSiblings = (node: SilverstripeDocument): SilverstripeDocument[] => {
  if (siblingMap.has(node.slug)) {
    return siblingMap.get(node.slug);
  }
  const nodes = getNodes();
  const siblings = nodes.filter(n => n.parentSlug === node.parentSlug);

  siblingMap.set(node.slug, siblings);

  return siblingMap.get(node.slug);
};

/**
 * Get the parent of a given node
 * @param node
 */
const getParent = (node: SilverstripeDocument): SilverstripeDocument | null => {
  if (parentMap.has(node.slug)) {
    return parentMap.get(node.slug);
  }

  const nodes = getNodes();
  const parent = nodes.find(n => n.slug === node.parentSlug) || null;

  parentMap.set(node.slug, parent);

  return parentMap.get(node.slug);
};

/**
 * Get the current node. Must be set by setCurrentNode(string: slug)
 */
const getCurrentNode = (): SilverstripeDocument | null => {
  if (!__path) {
    return null;
  }
  if (nodeMap.has(__path)) {
    return nodeMap.get(__path) || null;
  }

  const node = getNodes().find(n => n.slug === __path) || null;

  nodeMap.set(__path, node);

  return nodeMap.get(__path);
}

/**
 * Get the home page
 */
const getHomePage = (): SilverstripeDocument | null => {
  const nodes = getNodes();
  const version = getCurrentVersion();
  let slug = `/en/${version}/`;
  if (homeMap.has(slug)) {
    return homeMap.get(slug) || null;
  }
  const homePage = nodes.find(n => n.slug === slug) || null;
  homeMap.set(slug, homePage);

  return homeMap.get(slug);
};

/**
 * Get the default version
 */
const getDefaultVersion = (): string => '5';

/**
 * Get the selected version
 */
const getCurrentVersion = (): string => __currentVersion || getDefaultVersion();

/**
 * Get a message to display for all pages on this version's docs
 */
const getVersionMessage = (): ReactElement | ReactElement[] | string | null => {
  const EOL = [
    '3',
  ];
  const PREVIOUS_RELEASE = [
    '4',
  ];
  const PRE_RELEASE = [
    '6',
  ];
  const version = getCurrentVersion();
  const stablePath = getVersionPath(getCurrentNode(), getDefaultVersion());

  // Output the appropriate message and styling
  function makeMessage(style: string, icon: string, stability: string, message: string|null): string {
    let template = `<div id="version-callout" class="callout-block callout-block--version callout-block-${style}">
      <div class="callout-version-title">Version ${version}<span class="callout-version-stability">
        <i class="far fa-${icon}"></i><span class="callout-version-stability-text">${stability}</span></span>
      </div>`;
    if (message) {
      template += `<div class="callout-version-content">
          This version of Silverstripe CMS ${message}.
          <a href="${stablePath}">Go to documentation for the most recent stable version.</a>
        </div>`;
    }
    template += '</div>';
    return template;
  }

  // Return the correct message for the current version
  if (EOL.includes(version)) {
    return parse(makeMessage('danger', 'times-circle', 'end of life', 'will not recieve any additional bug fixes or documentation updates'));
  }
  if (PRE_RELEASE.includes(version)) {
    return parse(makeMessage(
      'warning',
      'calendar',
      'pre-stable',
      'has not yet been given a stable release. See <a target="_blank" href="https://www.silverstripe.org/software/roadmap/">the release roadmap</a> for more information'
    ));
  }
  if (PREVIOUS_RELEASE.includes(version)) {
    return parse(makeMessage('info', 'check-circle', 'supported', 'is still supported though will not receive any additional features'));
  }
  // CURRENT_RELEASE
  return parse(makeMessage('success', 'check-circle', 'supported', null));
};


/**
 * Gets the path in another version
 * @param currentNode 
 * @param version 
 */
const getVersionPath = (currentNode: SilverstripeDocument|null, version: number|string): string => {
  const basePath = `/en/${version}`;
  if (!currentNode) {
    return basePath;
  }
  const newPath = currentNode.slug.replace(/^\/en\/[0-9]+\//, `${basePath}/`);
  const otherNode = getNodes().find(n => n.slug === newPath);

  return otherNode ? otherNode.slug : basePath;
};

/**
 * Set the current path, with some side effects for version
 * @param slug 
 */
const setCurrentPath = (path: string) => {
  __path = path || `/`;
  const [_, lang, version] = __path.split('/');
  __currentVersion = version;
};

export {
  initialise,
  getNodes,
  getChildren,
  getSiblings,
  getParent,
  getCurrentNode,
  getHomePage,
  getNavChildren,
  getCurrentVersion,
  getVersionPath,
  setCurrentPath,
  getDefaultVersion,
  getVersionMessage,
};