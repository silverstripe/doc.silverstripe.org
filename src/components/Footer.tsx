import type { ReactNode } from 'react';
import styles from './Footer.module.css';

interface FooterProps {
  children: ReactNode;
}

export const Footer = ({ children }: FooterProps) => (
  <footer className={styles.footer}>
    {children}
  </footer>
);
