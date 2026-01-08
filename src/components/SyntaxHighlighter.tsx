'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function SyntaxHighlighter() {
  const pathname = usePathname();
  const prismRef = useRef<typeof import('prismjs') | null>(null);
  const isInitializedRef = useRef(false);

  const highlightCode = useCallback(async () => {
    try {
      // Load Prism and languages only once
      if (!prismRef.current) {
        // Dynamic imports are used here for performance optimization (code splitting):
        // - Prism language definitions are large (each ~10-30KB), and importing all
        //   statically would bloat the initial bundle size significantly.
        // - Dynamic imports enable code splitting: languages are bundled separately
        //   and loaded lazily only when syntax highlighting is actually needed.
        // - After the first load, Prism and its language definitions are cached in
        //   prismRef.current, so subsequent calls don't re-import (fast, efficient).
        // - This reduces initial page load time and improves performance for users.
        prismRef.current = await import('prismjs');
        // Import language support (order matters - load dependencies first)
        // @ts-ignore - prismjs components don't have type definitions
        await import('prismjs/components/prism-markup');
        // @ts-ignore
        await import('prismjs/components/prism-markup-templating');
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
        // @ts-ignore
        await import('prismjs/components/prism-diff');
      }

      prismRef.current.highlightAllUnder(document.body);
    } catch (error) {
      console.warn('Failed to initialize Prism highlighting:', error);
    }
  }, []);

  // Initial highlighting and on pathname change
  useEffect(() => {
    highlightCode();
  }, [pathname, highlightCode]);

  // MutationObserver to detect DOM changes (handles same-page navigation)
  useEffect(() => {
    if (isInitializedRef.current) {
      return undefined;
    }
    isInitializedRef.current = true;

    const observer = new MutationObserver((mutations) => {
      // Check if any mutation added code blocks
      const hasCodeBlocks = mutations.some((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          return Array.from(mutation.addedNodes).some((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              return element.querySelector('pre code') || element.matches('pre code');
            }
            return false;
          });
        }
        return false;
      });

      if (hasCodeBlocks) {
        highlightCode();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [highlightCode]);

  return null;
}
