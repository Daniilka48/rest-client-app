'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  isLoggedIn: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>REST Client</h1>

        <nav>
          {isLoggedIn ? (
            <Link href="/rest-client" className={styles.navLink}>
              Main Page
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className={styles.navLink}>
                Sign In
              </Link>
              {' | '}
              <Link href="/sign-up" className={styles.navLink}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
