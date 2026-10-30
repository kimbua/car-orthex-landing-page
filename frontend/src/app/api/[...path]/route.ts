import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Same-origin API proxy: the browser only ever calls /api/... on the FE origin,
 * this route forwards to the backend using the runtime-injected API_URL env.
 */
async function proxy(req: NextRequest, path: string[]) {
  const base = (process.env.API_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');
  const target = `${base}/api/${path.join('/')}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    'content-type': req.headers.get('content-type') || 'application/json',
  };

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  };

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    init.body = await req.text();
  }

  try {
    const res = await fetch(target, init);
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  } catch (err) {
    return NextResponse.json(
      { message: `Backend unreachable: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    );
  }
}

export function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path || []);
}

export function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path || []);
}
