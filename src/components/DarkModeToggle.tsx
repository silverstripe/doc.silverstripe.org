'use client';

import { useState, useEffect } from 'react';
import styles from './DarkModeToggle.module.css';

/**
 * Dark mode toggle component with localStorage persistence and system preference detection.
 * Syncs with existing dark class that may have been set by inline script before hydration.
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // Initialize dark mode on first client render
  useEffect(() => {
    if (isDark !== null) return; // Already initialized

    // Check if dark class already exists (set by inline script before hydration)
    const hasClassAlready = document.documentElement.classList.contains('dark');

    // Determine initial dark mode state
    const saved = localStorage.getItem('theme_preference');
    let isDarkMode = saved === 'dark';

    if (!saved) {
      if (hasClassAlready) {
        // Trust the class if it was already set (e.g., by inline script or system preference)
        isDarkMode = true;
      } else if (window.matchMedia) {
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }

    setIsDark(isDarkMode);

    // Apply class immediately to avoid flashing
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Update DOM when dark mode state changes
  useEffect(() => {
    if (isDark === null) return;

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleToggle = () => {
    setIsDark((prev) => !prev);
  };
  if (isDark === null) {
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
