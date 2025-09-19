'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

const Header = () => {
  const { t } = useTranslation('common');
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
            <div>
              <Link href="/" className={styles.navLink}>
                {t('navigation.mainPage')}
              </Link>
              {' | '}
              <Link href="/rest-client" className={styles.navLink}>
                {t('navigation.restClient')}
              </Link>
              <div className={styles.navLinks}>
                <LanguageSwitcher />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className={styles.logout}
                >
                  {t('navigation.logout')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className={styles.navLink}>
                {t('navigation.signIn')}
              </Link>
              {' | '}
              <Link href="/signup" className={styles.navLink}>
                {t('navigation.signUp')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
