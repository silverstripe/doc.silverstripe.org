'use client';

import { useEffect } from 'react';

interface HashScrollManagerProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Manages hash-based anchor scrolling with proper offset for sticky header.
 * Listens to hashchange events and same-hash link clicks, ensuring headings
 * scroll to the correct position accounting for the sticky header height.
 */
export function HashScrollManager({ containerRef: _containerRef }: HashScrollManagerProps) {
  const getHeaderHeight = (): number => {
    if (typeof window === 'undefined') return 0;
    const headerElement = document.querySelector('header');
    if (!headerElement) return 0;
    const { height: heightStr } = window.getComputedStyle(headerElement);
    return parseInt(heightStr, 10) || 0;
  };

  const scrollToHash = (hash: string) => {
    if (!hash || hash === '#') return;

    const id = hash.replace(/^#/, '');
    const element = document.getElementById(id);

    if (!element) {
      console.warn(`HashScrollManager: target element not found for hash #${id}`);
      return;
    }

    const headerHeight = getHeaderHeight();

    // Use scrollIntoView with instant behavior
    element.scrollIntoView({ behavior: 'instant', block: 'start' });

    // Apply manual offset if header height is significant
    if (headerHeight > 0) {
      const elementRect = element.getBoundingClientRect();
      const targetOffset = window.scrollY + elementRect.top - headerHeight;
      window.scrollTo({ top: targetOffset, behavior: 'instant' });
    }
  };

  // Handle hashchange event
  useEffect(() => {
    const handleHashChange = () => {
      const { hash } = window.location;
      if (hash) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          scrollToHash(hash);
        });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Handle same-hash link clicks (e.g., clicking a TOC link to the same hash)
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href^="#"]');

      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      const currentHash = window.location.hash;
      const newHash = href;

      // If clicking a link to the same hash, prevent default and re-scroll
      if (currentHash === newHash && currentHash) {
        event.preventDefault();
        requestAnimationFrame(() => {
          scrollToHash(currentHash);
        });
      }
    };

    // Attach listener to document to capture all link clicks
    document.addEventListener('click', handleLinkClick, true);
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, []);

  // On mount, if there's a hash in the URL, scroll to it
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      requestAnimationFrame(() => {
        scrollToHash(window.location.hash);
      });
    }
  }, []);

  return null;
}
