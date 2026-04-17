'use client';

import { useRouter } from 'next/navigation';
import cx from 'classnames';
import {
  getAllVersions,
  getVersionSwitcherLabel,
  getVersionStatus,
} from '@/lib/versions/version-utils';
import type { DocsContext } from '@/types/types';
import styles from './VersionSwitcher.module.css';

interface VersionSwitcherProps {
  currentVersion: string;
  currentSlug: string;
  docsContext?: DocsContext;
}

/**
 * Version switcher component for changing documentation versions
 */
export function VersionSwitcher(
  { currentVersion, currentSlug, docsContext }: VersionSwitcherProps,
) {
  const router = useRouter();

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetVersion = e.target.value;
    // Replace version in current slug: /en/6/path/ → /en/5/path/
    const newPath = currentSlug.replace(/^\/en\/[0-9]+\//, `/en/${targetVersion}/`);
    router.push(newPath);
  };

  const versions = getAllVersions(docsContext);
  const status = getVersionStatus(currentVersion);

  return (
    <div className={styles.versionSwitcher}>
      <select
        id="version-select"
        value={currentVersion}
        onChange={handleVersionChange}
        className={cx(styles.select, styles[`status-${status}`])}
        aria-label="Select documentation version"
      >
        {versions.map((version) => (
          <option key={version} value={version}>
            {getVersionSwitcherLabel(version)}
          </option>
        ))}
      </select>
    </div>
  );
}
