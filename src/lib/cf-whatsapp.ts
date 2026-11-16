// Cheap Floors WhatsApp links with the visitor's source attached.
//
// Every WhatsApp button goes through components/common/WhatsAppLink.tsx, which
// renders waHref() (a plain link, fine without JavaScript) and, on click, swaps
// in waLink(): the prefilled message plus a ref line such as
//   [ref: GADS-spc-flooring-dubai|spc-flooring/herringbone]
// so sales sees the channel, keyword or ad, and page in the first message.
// The click is also logged (POST /api/wa-click), so chats that go nowhere
// still count by channel.

import type { MouseEvent } from 'react';
import { CfAttr, readAttribution } from './cf-attribution';

const WA_NUMBER = (
  process.env.NEXT_PUBLIC_PHONE_NUMBER || '+971 50 597 4385'
).replace(/\D/g, '');

const DEFAULT_MESSAGE = 'Hi, I have a question about flooring';

/** The plain link, as rendered on the server: no ref, no default text. */
export const waHref = (message?: string): string =>
  `https://wa.me/${WA_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

const slug = (value?: string) =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32);

/** Compact code the sales team sees in the first message.
 *  GADS-spc-flooring-dubai / META-NovFlooring / ORG-google / DIRECT */
export function sourceCode(attr: CfAttr | null): string {
  if (!attr) return 'UNKNOWN';
  const touch = attr.lastTouch;
  switch (touch.channel) {
    case 'Google Ads':
      return `GADS-${slug(touch.utm_term) || slug(touch.utm_campaign) || 'nokw'}`;
    case 'Meta Ads':
      return `META-${slug(touch.utm_content) || slug(touch.utm_campaign) || 'noad'}`;
    case 'Microsoft Ads':
      return `BADS-${slug(touch.utm_term) || 'nokw'}`;
    case 'Google Organic':
      return 'ORG-google';
    case 'Bing Organic':
      return 'ORG-bing';
    case 'Direct':
      return 'DIRECT';
    default:
      return slug(touch.channel).toUpperCase().slice(0, 24) || 'OTHER';
  }
}

/** Short page hint so sales knows what they were looking at. */
export function pageCode(pathname: string): string {
  return (
    pathname
      .replace(/^\/|\/$/g, '')
      .replace(/[^a-zA-Z0-9/-]/g, '')
      .slice(0, 40) || 'home'
  );
}

/** Browser only: "<source code>|<page code>". */
export const currentRef = (): string =>
  `${sourceCode(readAttribution())}|${pageCode(window.location.pathname)}`;

/** The link with the ref line appended to the prefilled message. */
export function waLink(message?: string, ref = currentRef()): string {
  const text = `${message || DEFAULT_MESSAGE}\n\n[ref: ${ref}]`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Logs the click without holding up the link. Never throws. */
export function trackWaClick(ref: string): void {
  try {
    const body = JSON.stringify({ ref });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/wa-click',
        new Blob([body], { type: 'application/json' })
      );
    } else {
      void fetch('/api/wa-click', {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'content-type': 'application/json' }
      }).catch(() => undefined);
    }
  } catch {
    // Logging is best effort.
  }
}

/** onClick for a WhatsApp link: the browser follows the updated href. */
export function withWaRef(message?: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      const ref = currentRef();
      event.currentTarget.href = waLink(message, ref);
      trackWaClick(ref);
    } catch {
      // Fall back to the plain link already in href.
    }
  };
}
