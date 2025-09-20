'use client';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import styles from './404-page/404.module.css';

const Custom404: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('404.title')}</h1>
      <p className={styles.message}>{t('404.message')}</p>
      <Link className={styles.link} href="/">
        {t('404.homeLink')}
      </Link>
    </div>
  );
};

export default Custom404;
