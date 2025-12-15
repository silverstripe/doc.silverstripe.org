'use client';

import { useState, useEffect } from 'react';
import styles from './DarkModeToggle.module.css';

/**
 * Dark mode toggle component with slider interface showing both light and dark icons.
 * The slider continuously displays sun and moon icons while allowing theme switching.
 * Syncs with existing dark class that may have been set by inline script before hydration.
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // Initialize dark mode on first client render
  useEffect(() => {
    if (isDark !== null) {
      // Already initialized
      return;
    }

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
      className={styles.sliderContainer}
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
      data-testid="dark-mode-toggle"
    >
      <div className={styles.sliderTrack}>
        <i className={`fas fa-sun ${styles.iconSun}`} aria-hidden="true" />
        <div className={`${styles.sliderThumb} ${isDark ? styles.sliderThumbDark : ''}`} />
        <i className={`fas fa-moon ${styles.iconMoon}`} aria-hidden="true" />
      </div>
    </button>
  );
}
