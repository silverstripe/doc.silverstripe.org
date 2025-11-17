/**
 * Core document node interface representing a parsed markdown file
 */
export interface DocumentNode {
  slug: string;
  version: string;
  filePath: string;
  fileTitle: string;
  fileAbsolutePath: string;
  isIndex: boolean;
  parentSlug: string;
  title: string;
  content: string;
  category: 'docs' | 'user';
  summary?: string;
  icon?: string;
  iconBrand?: string;
  hideChildren?: boolean;
  hideSelf?: boolean;
  unhideSelf?: boolean;
  introduction?: string;
  order?: number;
}

/**
 * Frontmatter metadata extracted from markdown files
 */
export interface DocumentMeta {
  title?: string;
  summary?: string;
  introduction?: string;
  icon?: string;
  iconBrand?: string;
  hideChildren?: boolean;
  hideSelf?: boolean;
  unhideSelf?: boolean;
  [key: string]: any;
}

/**
 * Hierarchical representation of content structure
 */
export interface ContentTree {
  node: DocumentNode;
  children: ContentTree[];
}

/**
 * Props for ChildrenOf component
 */
export interface ChildrenOfProps {
  folderName?: string;
  exclude?: string;
  only?: string;
  currentNode: DocumentNode | null;
  asList?: boolean;
  includeFolders?: boolean;
  reverse?: boolean;
}
