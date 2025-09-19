'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { encodeBase64Unicode } from '@/lib/base64';
import { useSession } from 'next-auth/react';

interface HistoryItem {
  id: number;
  method: string;
  url: string;
  status_code: number;
  latency_ms: number;
  created_at: string;
}

export default function HistorySection() {
  const session = useSession();
  const userId = session?.data?.user.id;
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('rest')
        .select('id, method, url, status_code, latency_ms, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error) setHistory(data || []);
      console.log(data, error, 'E', userId);
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
              [{item.method} {item.url}] Status: {item.status_code},{' '}
              {item.latency_ms}ms
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
