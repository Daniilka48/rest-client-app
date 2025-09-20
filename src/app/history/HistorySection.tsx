'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import styles from './HistorySection.module.css';

interface HistoryItem {
  id: number;
  method: string;
  url: string;
  status_code: number;
  latency_ms: number;
  created_at: string;
  request_size: number | null;
  response_size: number | null;
  error: string | null;
}

function getStatusType(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return 'success';
  if (statusCode >= 300 && statusCode < 400) return 'redirect';
  if (statusCode >= 400 && statusCode < 500) return 'client-error';
  if (statusCode >= 500) return 'server-error';
  return 'unknown';
}

export default function HistorySection() {
  const { t } = useTranslation();
  const session = useSession();
  const userId = session?.data?.user.id;
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('rest')
        .select(
          'id, method, url, status_code, latency_ms, created_at, request_size, response_size, error'
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error) setHistory(data || []);
    }
    fetchHistory();
  }, [userId]);

  if (!history.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <h3 className={styles.emptyTitle}>{t('history.emptyState.title')}</h3>
        <p className={styles.emptyText}>{t('history.emptyState.message')}</p>
        <p className={styles.emptySubtext}>
          {t('history.emptyState.subtitle')}
        </p>
        <Link href="/rest-client" className={styles.emptyLink}>
          {t('history.emptyState.linkText')}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('history.title')}</h2>
        <span className={styles.count}>
          {t('history.requestsCount', { count: history.length })}
        </span>
      </div>
      <ul className={styles.historyList}>
        {history.map((item) => (
          <li key={item.id} className={styles.historyItem}>
            <Link
              href={`/rest-client/history/${item.id}`}
              className={styles.historyLink}
            >
              <div className={styles.itemHeader}>
                <div
                  className={styles.methodBadge}
                  data-method={item.method.toLowerCase()}
                >
                  {item.method}
                </div>
                <div
                  className={styles.statusCode}
                  data-status={getStatusType(item.status_code)}
                >
                  {item.status_code}
                </div>
              </div>
              <div className={styles.itemContent}>
                <div className={styles.endpoint}>
                  <strong>{t('history.labels.endpoint')}</strong> {item.url}
                </div>
                <div className={styles.metaInfo}>
                  <div className={styles.metaItem}>
                    <strong>{t('history.labels.latency')}</strong>{' '}
                    {item.latency_ms} ms
                  </div>
                  <div className={styles.metaItem}>
                    <strong>{t('history.labels.request')}</strong>{' '}
                    {item.request_size || 0} bytes
                  </div>
                  <div className={styles.metaItem}>
                    <strong>{t('history.labels.response')}</strong>{' '}
                    {item.response_size || 0} bytes
                  </div>
                </div>
                <div className={styles.timestamp}>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : '—'}
                </div>
                {item.error && (
                  <div className={styles.error}>
                    <strong>{t('history.labels.error')}</strong> {item.error}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
