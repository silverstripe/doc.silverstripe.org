'use client';

import React, { useState, useRef } from 'react';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  children: string;
  className?: string;
  'data-language'?: string;
}

export function CodeBlock({ children, className = '', 'data-language': language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={styles.codeBlockWrapper} ref={codeRef}>
      <div className={styles.codeBlockHeader}>
        {language && <span className={styles.language}>{language}</span>}
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
          aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
          data-testid="copy-button"
        >
          <span className={styles.copyText}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </span>
        </button>
      </div>
      <pre>
        <code className={className} data-testid="code-content">
          {children}
        </code>
      </pre>
    </div>
  );
}
