'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const HistorySection = dynamic(() => import('./HistorySection'), {
  ssr: false,
});

export default function HistorySectionWrapper() {
  return <HistorySection />;
}
