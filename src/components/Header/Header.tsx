'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import styles from './Header.module.css';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session;

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
            <>
              <Link href="/dashboard" className={styles.navLink}>
                Main Page
              </Link>
              {' | '}

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={styles.navLink}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={styles.navLink}>
                Sign In
              </Link>
              {' | '}
              <Link href="/signup" className={styles.navLink}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
