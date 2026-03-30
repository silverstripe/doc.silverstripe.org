'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { DocsContext } from '@/types/types';
import { extractVersionAndFeatureFromSlug } from '@/lib/utils/slug-utils';
import { getDocumentGithubInfo } from '@/lib/utils/github-utils';
import { getDefaultVersion, getVersionHomepage } from '@/lib/versions/version-utils';
import { isSearchConfigured } from '@/lib/config/config';
import { SearchBox } from './SearchBox';
import { VersionSwitcher } from './VersionSwitcher';
import { HamburgerButton } from './HamburgerButton';
import { DarkModeToggle } from './DarkModeToggle';
import CmsDevLogo from './logos/CmsDevLogo';
import CmsUserLogo from './logos/CmsUserLogo';
import SearchUserLogo from './logos/SearchUserLogo';
import styles from './Header.module.css';

interface HeaderProps {
  onMobileMenuToggle?: (isOpen: boolean) => void;
  docsContext: DocsContext;
}

/**
 * Header component with navigation and branding
 */
export function Header({ onMobileMenuToggle, docsContext }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [githubUrl, setGithubUrl] = useState('https://github.com/silverstripe/developer-docs');
  const pathname = usePathname();

  // Extract version and optional feature from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  // Only use pathParts[1] as version if pathParts[0] is 'en'
  const version = (pathParts[0] === 'en' ? pathParts[1] : null) || getDefaultVersion();
  const slug = pathname;
  const { optionalFeature } = extractVersionAndFeatureFromSlug(slug);

  // Detect if we're on a 404 page
  // - Static 404.html uses pathname containing '_not-found'
  // - Also check for invalid /en/* patterns that would indicate 404
  const isNotFoundPath = pathname.includes('_not-found');
  const isInvalidEnPath = pathParts[0] === 'en' && (!pathParts[1] || !/^[0-9]$/.test(pathParts[1]));
  const isNotFound = isNotFoundPath || !pathParts[0] || isInvalidEnPath;

  const hasSearch = isSearchConfigured();

  const logoTitle = {
    docs: 'Silverstripe CMS Docs',
    user: 'Silverstripe CMS User guides',
    search: 'Silverstripe Search User guides',
  }[docsContext];

  const LogoComponent = {
    docs: CmsDevLogo,
    user: CmsUserLogo,
    search: SearchUserLogo,
  }[docsContext];

  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);

    // Scroll to top when opening mobile menu
    if (newState && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    onMobileMenuToggle?.(false);
  }, [pathname, onMobileMenuToggle]);

  // Update GitHub URL based on optional feature
  useEffect(() => {
    const githubInfo = getDocumentGithubInfo(version, optionalFeature, docsContext);
    if (githubInfo) {
      const newUrl = `https://github.com/${githubInfo.owner}/${githubInfo.repo}`;
      setGithubUrl(newUrl);
    } else {
      // Fallback to main developer-docs
      setGithubUrl('https://github.com/silverstripe/developer-docs');
    }
  }, [version, optionalFeature, docsContext]);

  // Track window width for mobile/desktop layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {/* Logo */}
        <Link href={getVersionHomepage(version)} className={styles.logo} aria-label={logoTitle}>
          <LogoComponent />
        </Link>

        {/* Version select dropdown */}
        {!isNotFound && (
          <VersionSwitcher
            currentVersion={version}
            currentSlug={slug}
          />
        )}

        {/* Mobile menu toggle */}
        {isMobile && (
          <HamburgerButton
            isOpen={isMobileMenuOpen}
            onClick={handleMobileMenuToggle}
          />
        )}
      </div>

      {/* Algolia search input */}
      {hasSearch && (
        <div className={styles.headerCenter}>
          <SearchBox />
        </div>
      )}

      <div className={styles.headerRight}>
        {/* Github link */}
        <a href={githubUrl} className={styles.github} aria-label="GitHub repository" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github" aria-hidden="true" />
        </a>

        {/* Light and dark mode toggle */}
        <DarkModeToggle />

        {/* Menu toggle */}
        {!isMobile && (
          <HamburgerButton
            isOpen={isMobileMenuOpen}
            onClick={handleMobileMenuToggle}
          />
        )}
      </div>
    </header>
  );
}
