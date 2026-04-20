'use client';

import { usePathname } from 'next/navigation';
import type { DocsContext } from '@/types/types';
import { extractVersionAndFeatureFromSlug } from '@/lib/utils/slug-utils';
import { getDocumentGithubInfo } from '@/lib/utils/github-utils';
import { getDefaultVersion } from '@/lib/versions/version-utils';
import styles from './Github.module.css';

const FALLBACK_URL = 'https://github.com/silverstripe/developer-docs';

interface GithubProps {
  docsContext: DocsContext;
}

/**
 * GitHub repository link displayed in the header.
 * Derives the correct repo URL from the current path and docs context.
 */
export function Github({ docsContext }: GithubProps) {
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter(Boolean);
  const version = (pathParts[0] === 'en' ? pathParts[1] : null) || getDefaultVersion(docsContext);
  const { optionalFeature } = extractVersionAndFeatureFromSlug(pathname);

  const githubInfo = getDocumentGithubInfo(version, optionalFeature, docsContext);
  const url = githubInfo
    ? `https://github.com/${githubInfo.owner}/${githubInfo.repo}`
    : FALLBACK_URL;

  return (
    <a
      href={url}
      className={styles.github}
      aria-label="GitHub repository"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-github" aria-hidden="true" />
    </a>
  );
}
