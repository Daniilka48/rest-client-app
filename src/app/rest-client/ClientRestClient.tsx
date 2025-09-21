'use client';
import React, { useEffect, useState } from 'react';
import { decodeBase64Unicode, encodeBase64Unicode } from '@/lib/base64';
import { generateCodeSnippets } from '@/lib/codegen';
import { useSession } from 'next-auth/react';
import { useVariables } from '../../hooks/useVariables';
import styles from './RestClient.module.css';

type HeaderItem = { key: string; value: string };

export interface Props {
  routeParams?: string[];
  initialData?: {
    method: string;
    url: string;
    body: string;
    headers: HeaderItem[];
  };
}

export default function ClientRestClient({ routeParams, initialData }: Props) {
  const { data: session } = useSession();

  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<HeaderItem[]>([]);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [snippets, setSnippets] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>('curl-bash');

  const { resolveVariables } = useVariables();

  useEffect(() => {
    if (initialData) {
      setMethod(initialData.method);
      setUrl(initialData.url);
      setBody(initialData.body);
      setHeaders(initialData.headers);
      return;
    }

    if (!routeParams?.length) return;
    const [m, urlB64, bodyB64] = routeParams;
    if (m) setMethod(m.toUpperCase());
    if (urlB64) setUrl(decodeBase64Unicode(urlB64));
    if (bodyB64) setBody(decodeBase64Unicode(bodyB64));
  }, [routeParams, initialData]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hdrs: HeaderItem[] = [];
    for (const [k, v] of searchParams.entries()) {
      hdrs.push({ key: k, value: decodeURIComponent(v) });
    }
    if (hdrs.length) setHeaders(hdrs);
  }, []);

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

    try {
      const resolvedUrl = resolveVariables(url);
      const resolvedBody = resolveVariables(body);

      const headersObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key) {
          const resolvedKey = resolveVariables(h.key);
          const resolvedValue = resolveVariables(h.value);
          headersObj[resolvedKey] = resolvedValue;
        }
      });

      const payload = {
        method,
        url: resolvedUrl,
        headers: headersObj,
        body: resolvedBody || undefined,
      };

      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.user?.id && { 'x-user-id': session.user.id }),
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text().catch(() => '');
      setResponseStatus(res.status);
      setResponseText(text);

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

      window.history.replaceState(null, '', routeWithQuery);

      const resolvedHeadersForCode = headers.map((h) => ({
        key: resolveVariables(h.key),
        value: resolveVariables(h.value),
      }));

      const codeResults = await generateCodeSnippets(
        resolvedUrl,
        method,
        resolvedHeadersForCode,
        resolvedBody
      );
      setSnippets(codeResults);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>REST Client</h1>

      <div className={styles.requestSection}>
        <div className={styles.requestRow}>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={styles.methodSelect}
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
            className={styles.urlInput}
          />
          <button
            onClick={sendRequest}
            disabled={loading}
            className={styles.sendButton}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Headers</div>
        <div className={styles.headersContainer}>
          {headers.map((h, i) => (
            <div key={i} className={styles.headerRow}>
              <input
                placeholder="Key"
                value={h.key}
                onChange={(e) => updateHeader(i, e.target.value, h.value)}
                className={`${styles.headerInput} ${styles.headerKeyInput}`}
              />
              <input
                placeholder="Value"
                value={h.value}
                onChange={(e) => updateHeader(i, h.key, e.target.value)}
                className={`${styles.headerInput} ${styles.headerValueInput}`}
              />
              <button
                onClick={() => removeHeader(i)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button onClick={addHeader} className={styles.addButton}>
            + Add Header
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Body</div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className={styles.bodyTextarea}
          placeholder="Enter request body (JSON, XML, plain text, etc.)"
        />
        <button onClick={prettifyBody} className={styles.prettifyButton}>
          Prettify JSON
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Response</div>
        <div className={styles.responseContainer}>
          {error && <div className={styles.errorText}>{error}</div>}
          {responseStatus !== null && (
            <div
              className={`${styles.statusText} ${
                responseStatus >= 200 && responseStatus < 300
                  ? styles.statusSuccess
                  : responseStatus >= 400
                    ? styles.statusError
                    : styles.statusOther
              }`}
            >
              Status: {responseStatus}
            </div>
          )}
          <div className={styles.responseText}>
            {responseText ?? 'No response yet'}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Generated Code</div>
        {!url ? (
          <div className={styles.noCodeMessage}>
            Enter a URL to generate code snippets
          </div>
        ) : (
          <>
            <div className={styles.tabContainer}>
              {Object.keys(snippets).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className={styles.codeBlock}>
              {snippets[activeTab] || 'Generating...'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
