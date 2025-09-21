import ClientWrapper from '../ClientWrapper';

interface PageProps {
  params?: { params?: string[] };
}

export default async function RestClientDynamicPage({ params }: PageProps) {
  const routeParams = params?.params || [];
  return <ClientWrapper routeParams={routeParams} />;
}
