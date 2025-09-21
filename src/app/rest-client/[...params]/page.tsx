import ClientWrapper from '../ClientWrapper';
import React from 'react';

interface PageProps {
  params: { params: string[] };
}

export default async function RestClientDynamicPage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const routeParams = params.params || [];
  return <ClientWrapper routeParams={routeParams} />;
}
