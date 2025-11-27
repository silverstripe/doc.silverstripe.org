'use client';

import { useState, useEffect } from 'react';
import styles from './DarkModeToggle.module.css';

/**
 * Dark mode toggle component with localStorage persistence.
 * Works with inline script in layout.tsx that sets dark class before first paint.
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Read from localStorage on mount, also check if inline script already set dark class
  useEffect(() => {
    // Check if dark class was already set by inline script
    const hasClassAlready = document.documentElement.classList.contains('dark');
    const saved = localStorage.getItem('theme_preference');
    let isDarkMode = saved === 'dark';
    
    if (!saved && typeof window !== 'undefined' && window.matchMedia) {
      isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Use existing class state if no explicit preference saved
    if (!saved && hasClassAlready) {
      isDarkMode = true;
    }
    
    setIsDark(isDarkMode);
    setIsMounted(true);
  }, []);

  // Apply dark class to document.documentElement
  useEffect(() => {
    if (!isMounted) return;
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, isMounted]);

  // Save to localStorage on change
  useEffect(() => {
    if (!isMounted) return;
    
    localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
  }, [isDark, isMounted]);

  const handleToggle = () => {
    setIsDark(!isDark);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <button
      className={styles.toggle}
      onClick={handleToggle}
      aria-label="Toggle dark mode"
      title="Toggle light/dark mode"
      data-testid="dark-mode-toggle"
    >
      {isDark ? (
        <i className={`fas fa-moon ${styles.icon}`} aria-hidden="true" />
      ) : (
        <i className={`fas fa-sun ${styles.icon}`} aria-hidden="true" />
      )}
    </button>
  );
}
