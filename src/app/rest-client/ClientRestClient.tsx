'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { decodeBase64Unicode, encodeBase64Unicode } from '@/lib/base64';

type HeaderItem = { key: string; value: string };

export default function ClientRestClient() {
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [headers, setHeaders] = useState<HeaderItem[]>([]);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'rest-client') {
      const m = parts[1];
      setMethod(m.toUpperCase());
      if (parts[2]) {
        const decodedUrl = decodeBase64Unicode(parts[2]);
        setUrl(decodedUrl);
      }
      if (parts[3]) {
        const decodedBody = decodeBase64Unicode(parts[3]);
        setBody(decodedBody);
      }
    }

    if (searchParams) {
      const hdrs: HeaderItem[] = [];
      for (const [k, v] of Array.from(searchParams.entries())) {
        hdrs.push({ key: k, value: decodeURIComponent(v) });
      }
      if (hdrs.length) setHeaders(hdrs);
    }
  }, [pathname, searchParams]);

  const addHeader = () => setHeaders((s) => [...s, { key: '', value: '' }]);
  const updateHeader = (idx: number, key: string, value: string) =>
    setHeaders((s) => s.map((h, i) => (i === idx ? { key, value } : h)));
  const removeHeader = (idx: number) =>
    setHeaders((s) => s.filter((_, i) => i !== idx));

  const prettifyBody = () => {
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
    } catch {}
  };

  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponseText(null);
    setResponseStatus(null);

    try {
      const headersObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key) headersObj[h.key] = h.value;
      });

      const payload = {
        method,
        url,
        headers: headersObj,
        body: body || undefined,
      };

      const urlB64 = encodeBase64Unicode(url);
      const bodyB64 = body ? encodeBase64Unicode(body) : undefined;
      let newRoute = `/rest-client/${method}/${urlB64}`;
      if (bodyB64) newRoute += `/${bodyB64}`;

      const qs = new URLSearchParams();
      headers.forEach((h) => {
        if (h.key) qs.append(h.key, encodeURIComponent(h.value));
      });
      const routeWithQuery = qs.toString()
        ? `${newRoute}?${qs.toString()}`
        : newRoute;
      router.replace(routeWithQuery);

      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text().catch(() => '');
      setResponseStatus(res.status);
      setResponseText(text);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{ minWidth: 100 }}
        >
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          placeholder="https://api.example.com/resource"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />

        <button
          onClick={sendRequest}
          disabled={loading}
          style={{ padding: '8px 12px' }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Headers</strong>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginTop: 8,
          }}
        >
          {headers.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="Key"
                value={h.key}
                onChange={(e) => updateHeader(i, e.target.value, h.value)}
                style={{ width: 160, padding: 6 }}
              />
              <input
                placeholder="Value"
                value={h.value}
                onChange={(e) => updateHeader(i, h.key, e.target.value)}
                style={{ flex: 1, padding: 6 }}
              />
              <button onClick={() => removeHeader(i)}>Remove</button>
            </div>
          ))}

          <button onClick={addHeader} style={{ marginTop: 8 }}>
            + Add Header
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Body</strong>
        <div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            style={{ width: '100%', padding: 8 }}
          />
          <div style={{ marginTop: 8 }}>
            <button onClick={prettifyBody}>Prettify</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <strong>Response</strong>
        <div
          style={{
            marginTop: 8,
            border: '1px solid #ddd',
            borderRadius: 6,
            padding: 12,
          }}
        >
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {responseStatus !== null && <div>Status: {responseStatus}</div>}
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
            {responseText ?? 'No response yet'}
          </pre>
        </div>
      </div>
    </div>
  );
}
