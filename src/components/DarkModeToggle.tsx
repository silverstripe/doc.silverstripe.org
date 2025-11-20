'use client';

import { useState, useEffect } from 'react';
import styles from './DarkModeToggle.module.css';

/**
 * Dark mode toggle component with localStorage persistence
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme_preference');
    let isDarkMode = saved === 'dark';
    
    if (!saved && typeof window !== 'undefined' && window.matchMedia) {
      isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
