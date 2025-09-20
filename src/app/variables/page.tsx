'use client';

import dynamic from 'next/dynamic';

const VariablesClient = dynamic(() => import('./VariablesClient'), {
  ssr: false,
});

export default function VariablesPage() {
  return <VariablesClient />;
}
