import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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

    let statusCode = 0;
    let responseText = '';
    let errorMsg: string | null = null;

    try {
      const proxied = await fetch(url, fetchOpts);
      responseText = await proxied.text().catch(() => '');
      statusCode = proxied.status;
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      } else {
        errorMsg = 'Unknown error';
      }
      statusCode = 0;
    }

    const duration = Date.now() - start;
    const requestSize = body
      ? new TextEncoder().encode(
          typeof body === 'string' ? body : JSON.stringify(body)
        ).length
      : 0;
    const responseSize = responseText
      ? new TextEncoder().encode(responseText).length
      : 0;

    try {
      const userId = req.headers.get('x-user-id');
      console.log('userId from header:', userId);
      if (userId) {
        await supabase.from('request_history').insert([
          {
            user_id: userId,
            method,
            url,
            headers,
            body,
            request_size: requestSize,
            response_size: responseSize,
            status_code: statusCode,
            latency_ms: duration,
            error: errorMsg,
          },
        ]);
      }
    } catch (dbErr) {
      console.error('Failed to save request history', dbErr);
    }

    return new NextResponse(responseText, {
      status: statusCode,
      headers: {
        'x-proxy-duration-ms': String(duration),
        'x-proxy-request-size': String(requestSize),
        'x-proxy-response-size': String(responseSize),
      },
    });
  } catch (err: unknown) {
    let message = 'Proxy error';
    if (err instanceof Error) message = err.message;
    else if (typeof err === 'string') message = err;

    return new NextResponse(message, { status: 500 });
  }
}
