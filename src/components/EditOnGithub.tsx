import { buildGithubEditUrl } from '@/lib/sources-config';
import styles from './EditOnGithub.module.css';

/**
 * Props for the EditOnGithub component
 */
interface EditOnGithubProps {
  /** Documentation version (e.g., '3', '4', '5', '6') */
  version: string;
  /** Relative file path from the repository root (e.g., '02_Developer_Guides/index.md') */
  filePath: string;
  /** Documentation category: 'docs' for developer docs or 'user' for user help */
  category: 'docs' | 'user';
  /** Optional feature name if document is from an optional feature (e.g., 'linkfield', 'staticpublishqueue') */
  optionalFeature?: string;
}

/**
 * EditOnGithub component - renders a link to edit the document on GitHub
 *
 * Generates correct GitHub URLs based on:
 * - Version number (uses source config to determine correct branch)
 * - Optional feature (if provided, uses feature-specific repository)
 * - Category (docs vs user help use different repositories)
 *
 * For user docs, always points to userhelp-docs/master
 * For developer docs, uses src/lib/sources-config.ts to get correct repo, owner, and branch
 *
 * @example
 * // Main docs v6
 * <EditOnGithub version="6" filePath="02_Developer_Guides/index.md" category="docs" />
 * // → https://github.com/silverstripe/developer-docs/blob/6.1/en/02_Developer_Guides/index.md
 *
 * @example
 * // Optional feature v6
 * <EditOnGithub version="6" filePath="index.md" category="docs" optionalFeature="linkfield" />
 * // → https://github.com/silverstripe/silverstripe-linkfield/blob/5.1/docs/en/index.md
 */
export default function EditOnGithub({
  version,
  filePath,
  category,
  optionalFeature,
}: EditOnGithubProps) {
  // For user docs, use userhelp-docs repo (legacy support)
  if (category === 'user') {
    const githubUrl = `https://github.com/silverstripe/userhelp-docs/edit/master/${filePath}`;
    return (
      <div className={styles.editContainer}>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.editLink}>
          Edit on GitHub
        </a>
      </div>
    );
  }

  // For docs, use source config
  const githubUrl = buildGithubEditUrl(version, filePath, optionalFeature);

  return (
    <div className={styles.editContainer}>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.editLink}>
        Edit on GitHub
      </a>
    </div>
  );
}
