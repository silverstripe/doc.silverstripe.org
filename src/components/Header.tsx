'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { extractVersionAndFeatureFromSlug } from '@/lib/slug-utils';
import { getDocumentGithubInfo } from '@/lib/github-utils';
import { getDefaultVersion, getVersionHomepage } from '@/lib/versions/version-utils';
import { SearchBox } from './SearchBox';
import { VersionSwitcher } from './VersionSwitcher';
import { HamburgerButton } from './HamburgerButton';
import { DarkModeToggle } from './DarkModeToggle';
import styles from './Header.module.css';

interface HeaderProps {
  onMobileMenuToggle?: (isOpen: boolean) => void;
  docsContext: 'docs' | 'user';
}

/**
 * Header component with navigation and branding
 */
export function Header({ onMobileMenuToggle, docsContext }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState('https://github.com/silverstripe/developer-docs');
  const pathname = usePathname();

  // Extract version and optional feature from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  // Only use pathParts[1] as version if pathParts[0] is 'en'
  const version = (pathParts[0] === 'en' ? pathParts[1] : null) || getDefaultVersion();
  const slug = pathname;
  const { optionalFeature } = extractVersionAndFeatureFromSlug(slug);

  const logoSubtitle = docsContext === 'user' ? 'User Help' : 'Docs';

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    onMobileMenuToggle?.(false);
  }, [pathname, onMobileMenuToggle]);

  // Update GitHub URL based on optional feature
  useEffect(() => {
    const githubInfo = getDocumentGithubInfo(version, optionalFeature);
    if (githubInfo) {
      const newUrl = `https://github.com/${githubInfo.owner}/${githubInfo.repo}`;
      setGithubUrl(newUrl);
    } else {
      // Fallback to main developer-docs
      setGithubUrl('https://github.com/silverstripe/developer-docs');
    }
  }, [version, optionalFeature]);

  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);

    // Scroll to top when opening mobile menu
    if (newState && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href={getVersionHomepage(version)} className={styles.logo}>
          <img src="/logo.svg" alt="Silverstripe" className={styles.logoImage} />
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Silverstripe CMS</span>
            <span className={styles.logoSubtitle}>{logoSubtitle}</span>
          </div>
        </Link>

        <div className={styles.searchContainer}>
          <SearchBox />
        </div>

        <nav className={styles.nav}>
          <div className={styles.navItem}>
            <a href={githubUrl} className={styles.navLink} aria-label="GitHub repository">
              <i className={`fab fa-github ${styles.githubIcon}`} />
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
