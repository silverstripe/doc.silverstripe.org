'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { matchRedirectPattern } from '@/lib/utils/redirect-patterns';
import { DEFAULT_VERSION } from '../../global-config';
import styles from './not-found.module.css';

/**
 * This may do a client-side redirect if navigating to a url that lacks the `/en/[version]`
 * prefix in its url. It's doing this client side so that this redirect solution works in
 * both `npm run dev` and the statically exported `npm run build` contexts
 */
export default function NotFound() {
  const [tested, setTested] = useState(false);
  const [redirectLocation, setRedirectLocation] = useState('');

  useEffect(() => {
    if (tested) {
      return;
    }
    setTested(true);
    const { pathname } = window.location;
    const redirectTo = matchRedirectPattern(pathname, DEFAULT_VERSION);
    if (redirectTo) {
      setRedirectLocation(redirectTo);
    }
  }, [tested]);

  if (!tested) {
    return null;
  }
  if (tested && redirectLocation !== '') {
    window.location.href = redirectLocation;
    return null;
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.message}>The page you are looking for does not exist.</p>
      <div className={styles.linkContainer}>
        <Link
          href={`/en/${DEFAULT_VERSION}/`}
          className={styles.link}
        >
          Go to Latest Documentation
        </Link>
      </div>
    </main>
  );
}
