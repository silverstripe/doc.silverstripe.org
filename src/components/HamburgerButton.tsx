'use client';

import styles from './HamburgerButton.module.css';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Hamburger menu button for mobile navigation
 */
export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
      onClick={onClick}
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
      data-testid="hamburger-button"
    >
      <span className={styles.line} />
      <span className={styles.line} />
      <span className={styles.line} />
    </button>
  );
}
