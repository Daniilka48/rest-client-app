'use client';

import DeveloperCard from 'components/DeveloperCards/DeveloperCard';
import styles from './MainPage.module.css';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import '../i18';

export default function MainPageMock() {
  const { t, ready } = useTranslation('common');
  const { data: session, status } = useSession();

  if (status === 'loading' || !ready) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <main className={styles.main}>
          <h2 className={styles.title}>{t('welcomeMessage')}</h2>
          <p className={styles.info}>
            {t('projectName')} 🔴{t('courseInfo')}
          </p>

          <div className={styles.authActions}>
            <Link href="/auth/login" className={styles.primaryButton}>
              {t('navigation.signIn')}
            </Link>
            <Link href="/signup" className={styles.secondaryButton}>
              {t('navigation.signUp')}
            </Link>
          </div>

          <h2 className={styles.subtitle}>{t('developersTitle')}</h2>
          <section className={styles.developers}>
            <DeveloperCard
              photo="/2.jpg"
              name={t('developers.daniilTerekhin.name')}
              role={t('developers.daniilTerekhin.role')}
              bio={t('developers.daniilTerekhin.bio')}
              github="https://github.com/daniilka48"
              priority
            />
            <DeveloperCard
              photo="/1.jpeg"
              name={t('developers.guliaIsaeva.name')}
              role={t('developers.guliaIsaeva.role')}
              bio={t('developers.guliaIsaeva.bio')}
              github="https://github.com/guliaisaeva"
            />
          </section>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main className={styles.main}>
        <h2 className={styles.title}>
          {t('welcomeMessage')}, {session?.user?.name || 'User'}
        </h2>
        <p className={styles.info}>
          {t('projectName')} 🔴{t('courseInfo')}
        </p>

        <div className={styles.navigationLinks}>
          <Link href="/rest-client" className={styles.navCard}>
            <h3>REST Client</h3>
            <p>Create and send HTTP requests</p>
          </Link>
          <Link href="/variables" className={styles.navCard}>
            <h3>Variables</h3>
            <p>Manage environment and global variables</p>
          </Link>
          <Link href="/history" className={styles.navCard}>
            <h3>History</h3>
            <p>View request history</p>
          </Link>
        </div>

        <h2 className={styles.subtitle}>{t('developersTitle')}</h2>
        <section className={styles.developers}>
          <DeveloperCard
            photo="/2.jpg"
            name={t('developers.daniilTerekhin.name')}
            role={t('developers.daniilTerekhin.role')}
            bio={t('developers.daniilTerekhin.bio')}
            github="https://github.com/daniilka48"
            priority
          />
          <DeveloperCard
            photo="/1.jpeg"
            name={t('developers.guliaIsaeva.name')}
            role={t('developers.guliaIsaeva.role')}
            bio={t('developers.guliaIsaeva.bio')}
            github="https://github.com/guliaisaeva"
          />
        </section>
      </main>
    </div>
  );
}
