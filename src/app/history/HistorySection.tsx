'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { encodeBase64Unicode } from '@/lib/base64';
import { useSession } from 'next-auth/react';
import './HistorySection.css';

interface HistoryItem {
  id: number;
  method: string;
  url: string;
  status_code: number;
  latency_ms: number;
  created_at: string;
  request_size: number | null;
  response_size: number | null;
  error: string | null;
}

export default function HistorySection() {
  const session = useSession();
  const userId = session?.data?.user.id;
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('rest')
        .select(
          'id, method, url, status_code, latency_ms, created_at, request_size, response_size, error'
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error) setHistory(data || []);
    }
    fetchHistory();
  }, [userId]);

  if (!history.length) {
    return (
      <div>
        <p>You havent executed any requests yet.</p>
        <p>Its empty here. Try:</p>
        <Link href="/rest-client">REST Client</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Request History</h2>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            <Link
              href={`/rest-client/${item.method}/${encodeBase64Unicode(item.url)}`}
            >
              <div>
                <strong>Endpoint:</strong> {item.url}
              </div>
              <div>
                <strong>Method:</strong> {item.method}
              </div>
              <div>
                <strong>Status Code:</strong> {item.status_code}
              </div>
              <div>
                <strong>Latency:</strong> {item.latency_ms} ms
              </div>
              <div>
                <strong>Timestamp:</strong>{' '}
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : '—'}
              </div>
              <div>
                <strong>Request Size:</strong> {item.request_size || 0} bytes
              </div>
              <div>
                <strong>Response Size:</strong> {item.response_size || 0} bytes
              </div>
              {item.error && (
                <div>
                  <strong>Error:</strong> {item.error}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
