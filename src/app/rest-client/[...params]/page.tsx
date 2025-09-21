import ClientWrapper from '../ClientWrapper';

interface PageProps {
  params: Promise<{ params: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const dynamicParams = resolvedParams.params;

  return <ClientWrapper routeParams={dynamicParams || []} />;
}
