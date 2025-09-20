'use client';

import DeveloperCard from 'components/DeveloperCards/DeveloperCard';
import styles from './MainPage.module.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import '../i18';
export default function MainPageMock() {
  const { t, ready } = useTranslation('common');

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [router, status]);

  if (status === 'loading' || !ready) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <main className={styles.main}>
        <h2 className={styles.title}>
          {t('welcomeMessage')},{' '}
          <span style={{ color: 'red' }}>
            {session?.user?.name || 'User'}!{' '}
          </span>
        </h2>
        <p className={styles.info}>
          <span>{t('projectName')}</span>
          <span>{t('courseInfo')}</span>
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
        </div>

        <h2 className={styles.subtitle}>{t('developersTitle')}</h2>
        <section className={styles.developers}>
          <DeveloperCard
            photo="/2.jpg"
            name={t('developers.daniilTerekhin.name')}
            role={t('developers.daniilTerekhin.role')}
            bio={t('developers.daniilTerekhin.bio')}
            github="https://github.com/daniilka48"
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
