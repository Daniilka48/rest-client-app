'use client';

import { SessionProvider } from 'next-auth/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/Toast/Toast';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export default function ClientProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <ToastProvider>
          <div className="app-layout">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
          <ToastContainer />
        </ToastProvider>
      </I18nextProvider>
    </SessionProvider>
  );
}
