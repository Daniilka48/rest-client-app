'use client';

import DeveloperCard from 'components/DeveloperCards/DeveloperCard';
import styles from './MainPage.module.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18';

export default function MainPageMock() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation('common');
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [router, status]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <main className={styles.main}>
        {/* <h2 className={styles.title}>Welcome to the REST Client App</h2> */}
        <h2 className={styles.title}>{t('welcomeMessage')}</h2>
        <p className={styles.info}>{t('projectName')}</p>
        <p className={styles.info}>{t('courseInfo')}</p>
        <p className={styles.welcome}>
          Welcome Back, {session?.user?.name || 'User'}!
        </p>

        <h2 className={styles.subtitle}>Developers</h2>
        <section className={styles.developers}>
          <DeveloperCard
            photo="/2.jpg"
            name="Daniil Terekhin"
            role="Frontend Developer"
            bio="Graduate of Lipetsk State Technical University, majoring in Economics and Management at Enterprises."
            github="https://github.com/daniilka48"
          />
          <DeveloperCard
            photo="/1.jpeg"
            name="Second Developer"
            role="Frontend Developer"
            bio="Graduate of Lipetsk State Technical University, majoring in Economics and Management at Enterprises."
            github="https://github.com/guliaisaeva"
          />
        </section>
      </main>
    </div>
  );
}
