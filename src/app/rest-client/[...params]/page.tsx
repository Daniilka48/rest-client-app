import ClientWrapper from '../ClientWrapper';

interface Props {
  params: { params: string[] };
}

export default function RestClientDynamicPage({ params }: Props) {
  return <ClientWrapper routeParams={params.params} />;
}
