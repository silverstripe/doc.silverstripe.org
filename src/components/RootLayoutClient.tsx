'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { SyntaxHighlighter } from './SyntaxHighlighter';
import { MobileMenuContext } from '@/contexts/MobileMenuContext';
import { initializeCodeBlocks } from '@/lib/markdown/code-block-client';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Scroll to heading when hash link is clicked or page loads with hash
  useEffect(() => {
    const scrollToHeading = () => {
      const hash = window.location.hash;
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

  // Initialize code block features (copy button, etc.)
  useEffect(() => {
    initializeCodeBlocks();
  }, []);

  return (
    <MobileMenuContext.Provider value={{ isMobileMenuOpen, onClose: handleMobileMenuClose }}>
      <SyntaxHighlighter />
      <Header onMobileMenuToggle={setIsMobileMenuOpen} />
      {children}
    </MobileMenuContext.Provider>
  );
}
