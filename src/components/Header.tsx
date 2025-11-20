'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchBox } from './SearchBox';
import { VersionSwitcher } from './VersionSwitcher';
import { HamburgerButton } from './HamburgerButton';
import { DarkModeToggle } from './DarkModeToggle';
import styles from './Header.module.css';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

/**
 * Header component with navigation and branding
 */
export function Header({ onMobileMenuToggle }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Extract version and slug from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const version = pathParts[1] || '6';
  const slug = pathname;

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    onMobileMenuToggle?.(false);
  }, [pathname, onMobileMenuToggle]);

  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.svg" alt="Silverstripe" className={styles.logoImage} />
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Silverstripe</span>
            <span className={styles.logoSubtitle}>Docs</span>
          </div>
        </Link>

        <div className={styles.searchContainer}>
          <SearchBox />
        </div>

        <nav className={styles.nav}>
          <div className={styles.navItem}>
            <a href="https://github.com/silverstripe/developer-docs" className={styles.navLink}>
              <i className={`fab fa-github ${styles.githubIcon}`}></i>
            </a>
          </div>
          <div className={styles.navItem}>
            <DarkModeToggle />
          </div>
          <div className={styles.versionSwitcherWrapper}>
            <VersionSwitcher
              currentVersion={version}
              currentSlug={slug}
            />
          </div>
          <div className={styles.hamburgerWrapper}>
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={handleMobileMenuToggle}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
