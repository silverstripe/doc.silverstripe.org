import { DocumentNode } from '@/types/types';
import { getChildrenFiltered, setAllDocuments } from '@/lib/children/get-children';
import type { FilterOptions } from '@/lib/children/get-children';
import styles from './ChildrenList.module.css';

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
  setAllDocuments(allDocs);

  const children = getChildrenFiltered(doc, options);
  if (children.length === 0) {
    return '';
  }

  const { asList } = options;
  if (asList) {
    return (
      <div className={styles.docsList}>
        <div>
          {children.map((child) => (
            <div key={child.slug} className={styles.docsListItem}>
              <a href={child.slug} className={styles.docsListItemTitle}>
                {child.title}
              </a>
              <p className={styles.docsListItemDescription}>
                {child.summary || ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.docsOverview}>
      <div className={styles.cardGrid}>
        {children.map((child) => {
          const icon = child.icon || 'file-alt';
          const iconClass = child.iconBrand
            ? `fab fa-${child.iconBrand}`
            : `fas fa-${icon}`;

          return (
            <a key={child.slug} href={child.slug} className={styles.cardLink}>
              <div className={styles.card}>
                <div className={styles.cardBody}>
                  <h5 className={styles.cardTitle}>
                    <span className={styles.cardIconHolder}>
                      <i className={iconClass} />
                    </span>
                    <span className={styles.cardTitleText}>{child.title}</span>
                  </h5>
                  <div className={styles.cardText}>
                    {child.summary || ''}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
