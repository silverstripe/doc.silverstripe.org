import Link from 'next/link';
import styles from './Header.module.css';

/**
 * Header component with navigation and branding
 */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoBrand}>SS</span>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>SilverStripe</span>
            <span className={styles.logoSubtitle}>Docs</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          <div className={styles.navItem}>
            <a href="https://www.silverstripe.org" className={styles.navLink}>
              Home
            </a>
          </div>
          <div className={styles.navItem}>
            <a href="https://github.com/silverstripe" className={styles.navLink}>
              <i className="fab fa-github"></i>
            </a>
          </div>
          <div className={styles.socialList}>
            <a href="https://twitter.com/silverstripe" className={styles.socialItem} title="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.facebook.com/silverstripe" className={styles.socialItem} title="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
