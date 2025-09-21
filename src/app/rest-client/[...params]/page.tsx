import ClientWrapper from '../ClientWrapper';

interface PageProps {
  params: { params: string[] };
}

export default function RestClientDynamicPage({ params }: PageProps) {
  const routeParams = params.params || [];
  return <ClientWrapper routeParams={routeParams} />;
}
