'use client';

import dynamic from 'next/dynamic';

const RestClientClient = dynamic(() => import('./ClientRestClient'), {
  ssr: false,
});

interface Props {
  routeParams?: string[];
}

export default function ClientWrapper({ routeParams }: Props) {
  return <RestClientClient routeParams={routeParams || []} />;
}
