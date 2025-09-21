interface PageProps {
  params: Promise<{ params: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const dynamicParams = resolvedParams.params;

  return (
    <div>
      <h1>Dynamic Route Content</h1>
      <p>Params: {dynamicParams.join('/')}</p>
    </div>
  );
}
