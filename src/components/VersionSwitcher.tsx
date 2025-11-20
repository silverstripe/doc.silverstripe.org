'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getAllVersions, getVersionSwitcherLabel, getVersionStatus } from '@/lib/versions';
import styles from './VersionSwitcher.module.css';

interface VersionSwitcherProps {
  currentVersion: string;
  currentSlug: string;
}

export function VersionSwitcher({ currentVersion, currentSlug }: VersionSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetVersion = e.target.value;
    const newPath = currentSlug.replace(/^\/en\/[0-9]+\//, `/en/${targetVersion}/`);
    router.push(newPath);
  };

  const versions = getAllVersions();
  const status = getVersionStatus(currentVersion);

  return (
    <div className={styles.versionSwitcher}>
      <label htmlFor="version-select" className={styles.label}>
        Version:
      </label>
      <select
        id="version-select"
        value={currentVersion}
        onChange={handleVersionChange}
        className={`${styles.select} ${styles[`status-${status}`]}`}
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
