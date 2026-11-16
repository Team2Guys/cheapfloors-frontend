import { NextResponse } from 'next/server';

// WhatsApp click log (lib/cf-whatsapp.ts sends a beacon here on every
// WhatsApp button click). Only the ref is passed on, e.g.
// "GADS-spc-flooring-dubai|spc-flooring/herringbone": no personal data.
// The backend checks the format again.
const REF = /^[A-Za-z0-9-]{1,48}\|[A-Za-z0-9/-]{1,48}$/;

const LOG_CLICK = `mutation LogWhatsAppClick($ref: String!) {
  logWhatsAppClick(ref: $ref)
}`;

export async function POST(request: Request) {
  let ref = '';
  try {
    const body = await request.json();
    ref = typeof body?.ref === 'string' ? body.ref : '';
  } catch {
    // Not JSON: rejected below.
  }
  if (!REF.test(ref)) return new NextResponse(null, { status: 400 });

  try {
    await fetch(process.env.NEXT_PUBLIC_BASE_URL as string, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: LOG_CLICK, variables: { ref } }),
      cache: 'no-store'
    });
  } catch (error) {
    console.error('WhatsApp click log failed:', error);
  }
  return new NextResponse(null, { status: 204 });
}
