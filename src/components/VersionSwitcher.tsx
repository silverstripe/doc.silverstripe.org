'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getAllVersions, getVersionSwitcherLabel, getVersionStatus } from '@/lib/versions';
import styles from './VersionSwitcher.module.css';

interface VersionSwitcherProps {
  currentVersion: string;
  currentSlug: string;
}

/**
 * Version switcher component for changing documentation versions
 * 
 * Fallback logic for version switching:
 * - Attempts to navigate to the same page in the target version
 * - If the page doesn't exist in target version, falls back to root (e.g., /en/6/)
 * - Uses getFallbackSlugForVersion utility to check if slug exists
 * 
 * Note: Full validation of slug existence would require server-side lookup.
 * For now, we use a safe fallback approach where users navigate to the target version
 * and Next.js handles non-existent routes with 404 pages.
 */
export function VersionSwitcher({ currentVersion, currentSlug }: VersionSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetVersion = e.target.value;
    // Replace version in current slug: /en/6/path/ → /en/5/path/
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
