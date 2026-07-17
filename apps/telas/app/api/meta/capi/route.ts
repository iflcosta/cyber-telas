import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// Meta Conversions API (server-side).
// Recebe eventos do cliente e reenvia à Meta com o mesmo event_id
// do Pixel, para deduplicação. Inerte (no-op) até configurar:
//   META_PIXEL_ID (ou NEXT_PUBLIC_META_PIXEL_ID) + META_CAPI_ACCESS_TOKEN
// ============================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const API_VERSION = 'v21.0';

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > -1) {
      out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return out;
}

export async function POST(req: NextRequest) {
  // Sem credenciais → no-op silencioso (não quebra o fluxo do usuário).
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, reason: 'not_configured' });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_json' }, { status: 400 });
  }

  const eventName = typeof body.eventName === 'string' ? body.eventName : 'Lead';
  const eventId = typeof body.eventId === 'string' ? body.eventId : undefined;
  const eventSourceUrl =
    typeof body.eventSourceUrl === 'string' ? body.eventSourceUrl : undefined;

  const cookies = parseCookies(req.headers.get('cookie'));
  const ua = req.headers.get('user-agent') || undefined;
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || undefined;

  const userData: Record<string, unknown> = {};
  if (cookies['_fbp']) userData.fbp = cookies['_fbp'];
  if (cookies['_fbc']) userData.fbc = cookies['_fbc'];
  if (ip) userData.client_ip_address = ip;
  if (ua) userData.client_user_agent = ua;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        ...(eventId ? { event_id: eventId } : {}),
        ...(eventSourceUrl ? { event_source_url: eventSourceUrl } : {}),
        user_data: userData,
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
        ACCESS_TOKEN,
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { ok: false, status: res.status, error: text.slice(0, 500) },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: 'fetch_failed' }, { status: 502 });
  }
}
