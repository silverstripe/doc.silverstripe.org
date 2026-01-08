'use client';

import React, { useRef } from 'react';
import styles from './MarkdownContent.module.css';
import { HashScrollManager } from './HashScrollManager';

interface MarkdownContentProps {
  html: string;
}

/**
 * Renders markdown content with proper styling and accessibility.
 * Wraps tables in a horizontal scrolling container to handle wide tables.
 * Manages hash-based anchor scrolling with sticky header offset.
 */
export function MarkdownContent({ html }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={containerRef}
        className={styles.markdownContent}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <HashScrollManager containerRef={containerRef} />
    </>
  );
}
