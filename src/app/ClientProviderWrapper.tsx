'use client';

import { SessionProvider } from 'next-auth/react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export default function ClientProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Header />
      {children}
      <Footer />
    </SessionProvider>
  );
}
