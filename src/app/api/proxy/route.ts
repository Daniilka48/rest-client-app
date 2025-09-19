import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://brjjybqngljiagmfukfa.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyamp5YnFuZ2xqaWFnbWZ1a2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTAyNjcsImV4cCI6MjA3Mzg4NjI2N30.vDkS5TUOO9V_y9pjMySKx74orts5WPt6w5ecOxQjnBU';

export const supabase = createClient(supabaseUrl, supabaseKey);
// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');

    console.log('User ID:', userId);
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
      // const userId = payload.user_id;
      if (userId) {
        console.log(payload, userId);
        const { data, error } = await supabase.from('rest').insert([
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
        if (error) console.log('Error', error);
        console.log(data);
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
