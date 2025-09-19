'use client';

import React from 'react';
import { useToast, Toast as ToastType } from '@/contexts/ToastContext';
import styles from './Toast.module.css';

const ToastItem: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToast();

  const handleClose = () => {
    removeToast(toast.id);
  };

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]} ${styles.slideIn}`}
      onClick={handleClose}
    >
      <div className={styles.toastContent}>
        <div className={styles.toastIcon}>
          {toast.type === 'success' && '✅'}
          {toast.type === 'error' && '❌'}
          {toast.type === 'warning' && '⚠️'}
          {toast.type === 'info' && 'ℹ️'}
        </div>
        <div className={styles.toastMessage}>{toast.message}</div>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
