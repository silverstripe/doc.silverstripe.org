'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SyntaxHighlighter() {
  const pathname = usePathname();

  useEffect(() => {
    const highlightCode = async () => {
      try {
        // Import Prism core
        const Prism = await import('prismjs');

        // Import language support (these extend Prism with language support)
        // Note: Order matters - load dependencies first
        // @ts-ignore - prismjs components don't have type definitions
        await import('prismjs/components/prism-markup'); // HTML/XML - required by markup-templating
        // @ts-ignore
        await import('prismjs/components/prism-markup-templating'); // Required by PHP
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

    highlightCode();
  }, [pathname]);

  return null;
}
