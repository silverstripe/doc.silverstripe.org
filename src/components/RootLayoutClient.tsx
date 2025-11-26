'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
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

  // Initialize Prism highlighting and code block features
  useEffect(() => {
    const initHighlighting = async () => {
      try {
        // Import Prism core
        const Prism = await import('prismjs');

        // Import language support (these extend Prism with language support)
        // Note: Order matters - load dependencies first
        // @ts-ignore - prismjs components don't have type definitions
        await import('prismjs/components/prism-markup');  // HTML/XML - required by markup-templating
        // @ts-ignore
        await import('prismjs/components/prism-markup-templating');  // Required by PHP
        // @ts-ignore
        await import('prismjs/components/prism-php');
        // @ts-ignore
        await import('prismjs/components/prism-javascript');
        // @ts-ignore
        await import('prismjs/components/prism-typescript');
        // @ts-ignore
        await import('prismjs/components/prism-bash');
        // @ts-ignore
        await import('prismjs/components/prism-css');
        // @ts-ignore
        await import('prismjs/components/prism-sql');
        // @ts-ignore
        await import('prismjs/components/prism-json');
        // @ts-ignore
        await import('prismjs/components/prism-yaml');
        // @ts-ignore
        await import('prismjs/components/prism-scss');
        // @ts-ignore
        await import('prismjs/components/prism-markdown');

        // Highlight all code blocks
        Prism.highlightAllUnder(document.body);
      } catch (error) {
        console.warn('Failed to initialize Prism highlighting:', error);
      }
    };

    initHighlighting();

    // Initialize copy buttons
    initializeCodeBlocks();
  }, []);

  return (
    <MobileMenuContext.Provider value={{ isMobileMenuOpen, onClose: handleMobileMenuClose }}>
      <Header onMobileMenuToggle={setIsMobileMenuOpen} />
      {children}
    </MobileMenuContext.Provider>
  );
}
