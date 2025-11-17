import { DocumentNode } from '@/types';
import { getChildren, FilterOptions, getChildrenFiltered } from '@/lib/children';

interface ChildrenListProps {
  doc: DocumentNode;
  allDocs: DocumentNode[];
  options?: FilterOptions;
}

/**
 * Server component for rendering a list of child pages
 * Can be used directly in markdown content
 */
export async function ChildrenList({
  doc,
  allDocs,
  options = {},
}: ChildrenListProps) {
  // Set up document cache
  const { setAllDocuments } = await import('@/lib/children/get-children');
  setAllDocuments(allDocs);

  const children = getChildrenFiltered(doc, options);

  if (children.length === 0) {
    return (
      <div className="alert alert-info" role="status">
        No child pages found.
      </div>
    );
  }

  const { asList, ...filterOptions } = options;

  if (asList) {
    return (
      <div className="docs-list">
        <dl className="row">
          {children.map((child) => (
            <div key={child.slug} className="col-12">
              <dt>
                <a href={child.slug} className="stretched-link">
                  {child.title}
                </a>
              </dt>
              <dd className="text-muted">{child.summary || ''}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <div className="docs-overview py-5">
      <div className="row">
        {children.map((child) => {
          const icon = child.icon || 'file-alt';
          const iconClass = child.iconBrand
            ? `fab fa-${child.iconBrand}`
            : `fas fa-${icon}`;

          return (
            <div key={child.slug} className="col-12 col-lg-6 py-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <span className="theme-icon-holder card-icon-holder me-2">
                      <i className={iconClass}></i>
                    </span>
                    <span className="card-title-text">{child.title}</span>
                  </h5>
                  <div className="card-text text-muted">
                    {child.summary || ''}
                  </div>
                  <a
                    className="card-link-mask stretched-link"
                    href={child.slug}
                    aria-label={child.title}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
