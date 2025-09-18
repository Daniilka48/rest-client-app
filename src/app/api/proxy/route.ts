import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { method, url, headers = {}, body } = payload;

    if (!url || typeof url !== 'string') {
      return new NextResponse('Invalid url', { status: 400 });
    }
    if (!/^https?:\/\//i.test(url)) {
      return new NextResponse('Only http(s) URLs are allowed', { status: 400 });
    }

    const start = Date.now();

    const fetchOpts: RequestInit = {
      method: method ?? 'GET',
      headers,
      body:
        body === undefined
          ? undefined
          : typeof body === 'string'
            ? body
            : JSON.stringify(body),
    };

    const proxied = await fetch(url, fetchOpts);
    const text = await proxied.text().catch(() => '');

    const duration = Date.now() - start;
    const requestSize = body
      ? new TextEncoder().encode(
          typeof body === 'string' ? body : JSON.stringify(body)
        ).length
      : 0;
    const responseSize = text ? new TextEncoder().encode(text).length : 0;

    const res = new NextResponse(text, {
      status: proxied.status,
      headers: {
        'x-proxy-duration-ms': String(duration),
        'x-proxy-request-size': String(requestSize),
        'x-proxy-response-size': String(responseSize),
      },
    });

    return res;
  } catch (err: unknown) {
    let message = 'Proxy error';

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === 'string') {
      message = err;
    }

    return new NextResponse(message, { status: 500 });
  }
}
