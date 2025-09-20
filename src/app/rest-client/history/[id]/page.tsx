'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ClientRestClient from '../../ClientRestClient';

interface Props {
  params: Promise<{ id: string }>;
}

interface HistoryRequest {
  id: number;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  status_code: number;
  latency_ms: number;
  created_at: string;
  request_size: number | null;
  response_size: number | null;
  error: string | null;
}

export default function HistoryRestorePage({ params }: Props) {
  const resolvedParams = React.use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [requestData, setRequestData] = useState<HistoryRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/auth/login');
      return;
    }

    const fetchRequestData = async () => {
      try {
        const response = await fetch(`/api/history/${resolvedParams.id}`, {
          headers: {
            'x-user-id': session.user.id,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch request data');
        }

        const data = await response.json();
        setRequestData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [resolvedParams.id, session, router]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading request data...</p>
      </div>
    );
  }

  if (error || !requestData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Error: {error || 'Request not found'}</p>
        <button onClick={() => router.push('/history')}>Back to History</button>
      </div>
    );
  }

  const headersArray = Object.entries(requestData.headers || {}).map(
    ([key, value]) => ({ key, value })
  );

  return (
    <ClientRestClient
      initialData={{
        method: requestData.method,
        url: requestData.url,
        body: requestData.body || '',
        headers: headersArray,
      }}
    />
  );
}
