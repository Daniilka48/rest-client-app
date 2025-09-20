'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';
import { RiLogoutCircleRLine } from 'react-icons/ri';

const Header = () => {
  const { t, ready } = useTranslation('common');
  const [isSticky, setIsSticky] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMounted || status === 'loading' || !ready) {
    return (
      <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logoLink}>
            <h1 className={styles.logo}>REST Client</h1>
          </Link>
          <nav className={styles.navigation}>
            <div className={styles.authLinks}>
              <Link href="/auth/login" className={styles.authButton}>
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`${styles.authButton} ${styles.signUpButton}`}
              >
                Sign Up
              </Link>
            </div>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logoLink}>
          <h1 className={styles.logo}>REST Client</h1>
        </Link>
        <nav className={styles.navigation}>
          {isLoggedIn ? (
            <>
              <div className={styles.mainNavLinks}>
                <Link href="/" className={styles.navLink}>
                  {t('navigation.mainPage')}
                </Link>
                <Link href="/rest-client" className={styles.navLink}>
                  {t('navigation.restClient')}
                </Link>
                <Link href="/variables" className={styles.navLink}>
                  {t('navigation.variables')}
                </Link>
                <Link href="/history" className={styles.navLink}>
                  {t('navigation.history')}
                </Link>
              </div>
              <div className={styles.userActions}>
                <LanguageSwitcher />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className={styles.logoutButton}
                  title={t('navigation.logout')}
                >
                  <span className={styles.logoutIcon}>
                    <RiLogoutCircleRLine />
                  </span>
                  <span className={styles.logoutText}>
                    {t('navigation.logout')}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.authLinks}>
                <Link href="/auth/login" className={styles.authButton}>
                  {t('navigation.signIn')}
                </Link>
                <Link
                  href="/signup"
                  className={`${styles.authButton} ${styles.signUpButton}`}
                >
                  {t('navigation.signUp')}
                </Link>
              </div>
              <LanguageSwitcher />
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
