import ClientWrapper from '../ClientWrapper';

interface PageProps {
  params: string[];
}

export default async function RestClientDynamicPage({ params }: PageProps) {
  const routeParams = params || [];
  return <ClientWrapper routeParams={routeParams} />;
}
