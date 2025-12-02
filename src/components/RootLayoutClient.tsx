'use client';

import { useState, useEffect, useMemo } from 'react';
import { MobileMenuContext } from '@/contexts/MobileMenuContext';
import { initializeCodeBlocks } from '@/lib/markdown/code-block-client';
import { Header } from './Header';
import { SyntaxHighlighter } from './SyntaxHighlighter';

interface RootLayoutClientProps {
  children: React.ReactNode;
  docsContext: 'docs' | 'user';
}

export function RootLayoutClient({ children, docsContext }: RootLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Scroll to heading when hash link is clicked or page loads with hash
  useEffect(() => {
    const scrollToHeading = () => {
      const { hash } = window.location;
      if (hash) {
        const id = hash.slice(1);
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            // Scroll with offset to account for header height
            const headerHeight = 80;
            const elementTop = element.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: elementTop, behavior: 'smooth' });
          }
        }, 0);
      }
    };

    // Scroll on mount
    scrollToHeading();

    // Listen for hash changes (when clicking anchor links)
    window.addEventListener('hashchange', scrollToHeading);
    return () => window.removeEventListener('hashchange', scrollToHeading);
  }, []);

  // Initialize code block features (copy button via event delegation)
  useEffect(() => {
    const cleanup = initializeCodeBlocks();
    return cleanup;
  }, []);

  const contextValue = useMemo(
    () => ({ isMobileMenuOpen, onClose: handleMobileMenuClose }),
    [isMobileMenuOpen],
  );

  return (
    <MobileMenuContext.Provider value={contextValue}>
      <SyntaxHighlighter />
      <Header onMobileMenuToggle={setIsMobileMenuOpen} docsContext={docsContext} />
      {children}
    </MobileMenuContext.Provider>
  );
}
