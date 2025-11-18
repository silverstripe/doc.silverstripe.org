'use client';

import Link from 'next/link';
import { SearchBox } from './SearchBox';
import { VersionSwitcher } from './VersionSwitcher';
import styles from './Header.module.css';
import { usePathname } from 'next/navigation';

/**
 * Header component with navigation and branding
 */
export function Header() {
  const pathname = usePathname();
  
  // Extract version and slug from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const version = pathParts[1] || '6';
  const slug = pathname;

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoBrand}>SS</span>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>SilverStripe</span>
            <span className={styles.logoSubtitle}>Docs</span>
          </div>
        </Link>

        <div className={styles.searchContainer}>
          <SearchBox />
        </div>

        <nav className={styles.nav}>
          <div className={styles.navItem}>
            <a href="https://www.silverstripe.org" className={styles.navLink}>
              Home
            </a>
          </div>
          <div className={styles.navItem}>
            <a href="https://github.com/silverstripe" className={styles.navLink}>
              <i className="fab fa-github"></i>
            </a>
          </div>
          <div className={styles.versionSwitcherWrapper}>
            <VersionSwitcher
              currentVersion={version}
              currentSlug={slug}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
