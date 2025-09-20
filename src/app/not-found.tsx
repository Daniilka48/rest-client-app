'use client';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import styles from './404-page/404.module.css';

const Custom404: FC = () => {
  const { t, ready } = useTranslation('common');

  if (!ready) return <p>Loading translations...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('notfound.title')}</h1>
      <p className={styles.message}>{t('notfound.message')}</p>
      <Link className={styles.link} href="/">
        {t('notfound.homeLink')}
      </Link>
    </div>
  );
};

export default Custom404;
