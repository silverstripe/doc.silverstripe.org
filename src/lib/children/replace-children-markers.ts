import { DocumentNode } from '@/types';
import { escapeHtml } from '@/lib/utils/escape-html';
import {
  findChildrenMarkers,
  ChildrenConfig,
} from './parse-children-marker';
import {
  getChildrenFiltered,
  FilterOptions,
  setAllDocuments as setupDocumentCache,
  getChildren,
} from './get-children';

/**
 * Note that due to when the code in this file runs, these functions intentionally return
 * raw HTML rather than using JSX
 */

/**
 * Render children as a list with definitions
 */
function renderListHTML(children: DocumentNode[]): string {
  const items = children
    .map((child) => (
      `<dt>
        <a href="${child.slug}">${escapeHtml(child.title)}</a>
      </dt>
      <dd>${escapeHtml(child.summary || '')}</dd>`
    )).join('\n');

  return (
    `<div class="docs-list">
      <dl>
        ${items}
      </dl>
    </div>`
  );
}

/**
 * Render children as a card grid
 */
function renderCardGridHTML(children: DocumentNode[]): string {
  const cards = children
    .map((child) => {
      const icon = child.icon || 'file-alt';
      const iconClass = child.iconBrand
        ? `fab fa-${child.iconBrand}`
        : `fas fa-${icon}`;

      return (
        `<a href="${child.slug}" class="col-12 col-lg-6 py-3 card-link">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">
                <span class="theme-icon-holder card-icon-holder me-2">
                  <i class="${iconClass}"></i>
                </span>
                <span class="card-title-text">${escapeHtml(child.title)}</span>
              </h5>
              <div class="card-text">
                ${escapeHtml(child.summary || '')}
              </div>
            </div>
          </div>
        </a>`
      );
    })
    .join('\n');

  return (
    `<div class="docs-overview py-5">
      <div class="row">
        ${cards}
      </div>
    </div>`
  );
}

/**
 * Render children list as HTML
 * This generates simple HTML that can be styled
 */
function renderChildrenHTML(
  children: DocumentNode[],
  config: ChildrenConfig,
): string {
  if (children.length === 0) {
    return '';
  }

  if (config.asList) {
    return renderListHTML(children);
  }
  return renderCardGridHTML(children);
}

/**
 * Replace all [CHILDREN] markers in HTML with rendered children
 * @param html HTML content containing potential [CHILDREN] markers
 * @param doc Current document (parent)
 * @param allDocs All available documents
 * @returns HTML with [CHILDREN] markers replaced
 */
export function replaceChildrenMarkers(
  html: string,
  doc: DocumentNode,
  allDocs: DocumentNode[],
): string {
  setupDocumentCache(allDocs);

  const markers = findChildrenMarkers(html);

  let result = html;

  for (const { marker, config } of markers) {
    const options: FilterOptions = {
      folderName: config.folderName,
      exclude: config.exclude,
      only: config.only,
      includeFolders: config.includeFolders,
      reverse: config.reverse,
    };

    const children = getChildrenFiltered(doc, options);
    const replacement = renderChildrenHTML(children, config);

    // Replace only the first occurrence to avoid issues
    result = result.replace(marker, replacement);
  }

  return result;
}

/**
 * Get metadata about children for a document (for testing/inspection)
 */
export interface ChildMetadata {
  title: string;
  slug: string;
  summary?: string;
  icon?: string;
}

/**
 * Get children data for a given document (useful for testing)
 */
export function getChildrenData(doc: DocumentNode): ChildMetadata[] {
  const children = getChildren(doc, false);

  return children.map((child: DocumentNode) => ({
    title: child.title,
    slug: child.slug,
    summary: child.summary,
    icon: child.icon,
  }));
}
