import ClientWrapper from '../ClientWrapper';

interface Props {
  params: string[];
}

export default function RestClientDynamicPage({ params }: Props) {
  return <ClientWrapper routeParams={params || []} />;
}
