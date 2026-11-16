// Cheap Floors order source tracking. Self-contained: shares no code with the
// Cheap Blinds or Blinds & Curtains sites.
//
// How it fits together:
// - proxy.ts records where a visitor came from on every landing, into the
//   first-party cookie cf_src (90 days). Being a cookie set by the server, it
//   survives closing the browser.
// - Checkout reads the cookie in the browser and sends it with
//   createSalesProduct / freeSample. Those create the order row BEFORE the
//   customer is sent to CCAvenue, so the gateway round trip never touches it.
// - The cookie keeps the touch path (first touch plus the latest ones), not one
//   label, so a disputed order can be traced click by click.
//
// Pure functions only (no Next or DOM imports), so the same code runs in the
// proxy, in the browser and in the tests.

export const CF_ATTR_COOKIE = 'cf_src';
export const CF_ATTR_MAX_AGE = 60 * 60 * 24 * 90; // 90 days, in seconds
const MAX_TOUCHES = 10;
// Browsers silently refuse a cookie over 4096 bytes (name + value) and keep
// the old one, so the path would just stop growing. Stay well under it.
export const MAX_COOKIE_BYTES = 3800;
const DEDUPE_MS = 30 * 60 * 1000;

export type CfTouch = {
  channel: string; // "Google Ads", "Meta Ads", "Google Organic", "Direct", ...
  detail: string; // full label with campaign / ad group / keyword
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_matchtype?: string;
  clickIds: Record<string, string>;
  referrer: string;
  landingPage: string;
  ts: string;
};

export type CfAttr = {
  firstVisit: string;
  firstTouch: CfTouch;
  lastTouch: CfTouch;
  touches: CfTouch[]; // the path, oldest first; touches[0] is always the first touch
};

const CLICK_IDS = [
  'gclid',
  'fbclid',
  'msclkid',
  'ttclid',
  'li_fat_id',
  'twclid',
  'ScCid'
];

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_matchtype'
] as const;

const PAID_MEDIUMS = [
  'cpc',
  'ppc',
  'paid',
  'paidsocial',
  'paid_social',
  'paid-social',
  'cpm',
  'display',
  'banner',
  'retargeting'
];

const PAID_SOURCES: [RegExp, string][] = [
  [/^(google|googleads|google_ads|google-ads|adwords)$/, 'Google Ads'],
  [/^(facebook|fb|instagram|ig|meta)$/, 'Meta Ads'],
  [/^(bing|microsoft)$/, 'Microsoft Ads'],
  [/^tiktok$/, 'TikTok Ads'],
  [/^snapchat$/, 'Snapchat Ads'],
  [/^linkedin$/, 'LinkedIn Ads'],
  [/^pinterest$/, 'Pinterest Ads']
];

const AI_HOSTS: Record<string, string> = {
  'chatgpt.com': 'ChatGPT',
  'chat.openai.com': 'ChatGPT',
  'gemini.google.com': 'Google Gemini',
  'perplexity.ai': 'Perplexity',
  'copilot.microsoft.com': 'Microsoft Copilot',
  'claude.ai': 'Claude'
};

const SOCIAL_HOSTS: [string[], string][] = [
  [['instagram.com', 'l.instagram.com'], 'Instagram (organic)'],
  [['facebook.com', 'm.facebook.com', 'l.facebook.com'], 'Facebook (organic)'],
  [['tiktok.com', 'vm.tiktok.com'], 'TikTok (organic)'],
  [['pinterest.com', 'pin.it'], 'Pinterest (organic)'],
  [['linkedin.com', 'lnkd.in'], 'LinkedIn (organic)'],
  [['twitter.com', 'x.com', 't.co'], 'X/Twitter (organic)'],
  [['youtube.com', 'youtu.be'], 'YouTube (organic)'],
  [['wa.me', 'l.wl.co', 'api.whatsapp.com'], 'WhatsApp']
];

// Our own hosts and the payment gateway. A referrer from these is never a
// source. Checkout pays through CCAvenue, which posts back to the backend,
// which redirects to /thank-you, so either may be the referrer on return.
// Tamara and Telr are not used today; they stay listed in case they return.
const IGNORED_REFERRERS = [
  'cheapfloors.ae',
  'easyfloors.ae',
  'cheapfloors-backend.vercel.app',
  'ccavenue.com',
  'ccavenue.ae',
  'checkout.tamara.co',
  'tamara.co',
  'secure.telr.com',
  'telr.com',
  'sandbox.telr.com'
];

const META_SOURCES = ['meta', 'facebook', 'instagram'];

/** Strips control characters and angle brackets and caps the length. */
export const clip = (value: unknown, max = 150): string =>
  String(value ?? '')
    .replace(/[\u0000-\u001f\u007f<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function matchesDomain(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

/** ownHost covers the site's own address wherever it runs (localhost, previews). */
export function isIgnoredReferrer(host: string, ownHost = ''): boolean {
  if (!host) return false;
  const own = ownHost
    .toLowerCase()
    .replace(/^www\./, '')
    .split(':')[0];
  if (own && matchesDomain(host, own)) return true;
  return IGNORED_REFERRERS.some((domain) => matchesDomain(host, domain));
}

export function classify(
  p: URLSearchParams,
  referrer: string,
  ownHost = ''
): { channel: string; detail: string } {
  const src = (p.get('utm_source') || '').toLowerCase().trim();
  const med = (p.get('utm_medium') || '').toLowerCase().trim();
  const isPaid = PAID_MEDIUMS.includes(med);
  const ref = hostOf(referrer);

  let channel = 'Direct';

  if (p.get('gclid') || (src === 'google' && isPaid)) {
    channel = 'Google Ads';
  } else if (p.get('msclkid') || (src === 'bing' && isPaid)) {
    channel = 'Microsoft Ads';
  } else if (p.get('ttclid') || (src === 'tiktok' && isPaid)) {
    channel = 'TikTok Ads';
  } else if (
    // Meta only on a PAIRED signal. fbclid alone is not enough: organic
    // Instagram and Facebook links carry fbclid too.
    (p.get('fbclid') && (isPaid || META_SOURCES.includes(src))) ||
    (META_SOURCES.includes(src) && isPaid)
  ) {
    channel = 'Meta Ads';
  } else if (isPaid) {
    const hit = PAID_SOURCES.find(([re]) => re.test(src));
    channel = hit ? hit[1] : src ? `Paid: ${clip(src, 40)}` : 'Paid';
  } else if (p.get('fbclid')) {
    channel = ref.includes('instagram')
      ? 'Instagram (organic)'
      : 'Facebook/Instagram (organic or untagged paid)';
  } else if (src) {
    channel = `Referral: ${clip(src, 40)}`;
  } else if (ref && !isIgnoredReferrer(ref, ownHost)) {
    if (AI_HOSTS[ref]) channel = AI_HOSTS[ref];
    else if (/(^|\.)google\./.test(ref)) channel = 'Google Organic';
    else if (/(^|\.)bing\./.test(ref)) channel = 'Bing Organic';
    else if (/(^|\.)(duckduckgo|yahoo|yandex|ecosia)\./.test(ref))
      channel = 'Other Organic';
    else {
      const social = SOCIAL_HOSTS.find(([hosts]) => hosts.includes(ref));
      channel = social ? social[1] : `Referral: ${clip(ref, 60)}`;
    }
  }

  // A detail line for EVERY paid channel, not just Google Ads.
  let detail = channel;
  if (/Ads$|^Paid/.test(channel)) {
    const parts = [channel];
    const campaign = clip(p.get('utm_campaign'), 60);
    const content = clip(p.get('utm_content'), 60);
    const term = clip(p.get('utm_term'), 60);
    if (channel === 'Google Ads') {
      if (campaign) parts.push(`Campaign ${campaign}`);
      if (content) parts.push(`Ad Group ${content}`);
      // The match type sits with the keyword: "spc flooring dubai" [p]
      const matchType = clip(p.get('utm_matchtype'), 10);
      const tag = matchType ? `[${matchType}]` : '';
      if (term) parts.push(tag ? `"${term}" ${tag}` : `"${term}"`);
      else if (tag) parts.push(tag);
    } else {
      if (campaign) parts.push(`Campaign "${campaign}"`);
      if (content) parts.push(`Ad Set "${content}"`);
      if (term) parts.push(`Ad "${term}"`);
    }
    detail = parts.join(' - ');
  }

  return { channel, detail };
}

export function buildTouch(
  p: URLSearchParams,
  referrer: string,
  landingPage: string,
  ownHost = '',
  now: Date = new Date()
): CfTouch {
  const { channel, detail } = classify(p, referrer, ownHost);
  const clickIds: Record<string, string> = {};
  for (const key of CLICK_IDS) {
    const value = clip(p.get(key), 150);
    if (value) clickIds[key] = value;
  }
  const touch: CfTouch = {
    channel,
    detail,
    clickIds,
    // Cross-site requests normally carry the origin only; never keep a query.
    referrer: isIgnoredReferrer(hostOf(referrer), ownHost)
      ? ''
      : clip(referrer.split('?')[0], 120),
    landingPage: clip(landingPage, 120),
    ts: now.toISOString()
  };
  for (const key of UTM_KEYS) {
    const value = clip(p.get(key), 100);
    if (value) touch[key] = value;
  }
  return touch;
}

/** A touch only counts if it carries a real signal. A bare Direct page view
 *  must never overwrite an earlier paid click. */
function isMeaningful(touch: CfTouch): boolean {
  return touch.channel !== 'Direct' || Object.keys(touch.clickIds).length > 0;
}

export function merge(existing: CfAttr | null, touch: CfTouch): CfAttr {
  if (!existing) {
    return {
      firstVisit: touch.ts,
      firstTouch: touch,
      lastTouch: touch,
      touches: [touch]
    };
  }
  if (!isMeaningful(touch)) return existing;

  // Don't log the same source twice within 30 minutes (page refreshes).
  const previous = existing.touches[existing.touches.length - 1];
  if (previous && previous.detail === touch.detail) {
    const gap = Date.parse(touch.ts) - Date.parse(previous.ts);
    if (gap >= 0 && gap < DEDUPE_MS) return existing;
  }

  // Keep the first touch, then the most recent ones.
  const [first, ...rest] = existing.touches;
  const touches = [first, ...[...rest, touch].slice(-(MAX_TOUCHES - 1))];
  return {
    firstVisit: existing.firstVisit,
    firstTouch: first,
    lastTouch: touch,
    touches
  };
}

/* ---------------------------------------------------------------------------
   Cookie format: base64url of a compact JSON, short keys and empty fields left
   out, so a path of several paid clicks still fits in one cookie.
   --------------------------------------------------------------------------- */

type StoredTouch = {
  c: string;
  d?: string;
  k?: Record<string, string>;
  r?: string;
  l?: string;
  ts: string;
  us?: string;
  um?: string;
  uc?: string;
  ux?: string;
  ut?: string;
  mt?: string;
};

type Stored = { v: 1; fv: string; t: StoredTouch[] };

const UTM_SHORT: Record<(typeof UTM_KEYS)[number], keyof StoredTouch> = {
  utm_source: 'us',
  utm_medium: 'um',
  utm_campaign: 'uc',
  utm_content: 'ux',
  utm_term: 'ut',
  utm_matchtype: 'mt'
};

const pack = (touch: CfTouch): StoredTouch => {
  const out: StoredTouch = { c: touch.channel, ts: touch.ts };
  if (touch.detail !== touch.channel) out.d = touch.detail;
  if (Object.keys(touch.clickIds).length) out.k = touch.clickIds;
  if (touch.referrer) out.r = touch.referrer;
  if (touch.landingPage) out.l = touch.landingPage;
  for (const key of UTM_KEYS) {
    const value = touch[key];
    if (value) (out as Record<string, unknown>)[UTM_SHORT[key]] = value;
  }
  return out;
};

const isRecordOfStrings = (value: unknown): value is Record<string, string> =>
  !!value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.values(value).every((item) => typeof item === 'string');

const unpack = (stored: StoredTouch): CfTouch => {
  const touch: CfTouch = {
    channel: clip(stored.c, 80) || 'Direct',
    detail: clip(stored.d ?? stored.c, 200) || 'Direct',
    clickIds: {},
    referrer: clip(stored.r, 120),
    landingPage: clip(stored.l, 120),
    ts: clip(stored.ts, 40)
  };
  if (isRecordOfStrings(stored.k)) {
    for (const key of CLICK_IDS) {
      const value = clip(stored.k[key], 150);
      if (value) touch.clickIds[key] = value;
    }
  }
  for (const key of UTM_KEYS) {
    const value = clip(
      (stored as Record<string, unknown>)[UTM_SHORT[key]],
      100
    );
    if (value) touch[key] = value;
  }
  return touch;
};

const toBase64Url = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const fromBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return new TextDecoder().decode(
    Uint8Array.from(binary, (char) => char.charCodeAt(0))
  );
};

/** The cookie value, or null for a missing, old-format or tampered cookie. */
export function parse(raw?: string | null): CfAttr | null {
  if (!raw) return null;
  try {
    const stored = JSON.parse(fromBase64Url(raw)) as Stored;
    if (stored?.v !== 1 || !Array.isArray(stored.t) || stored.t.length === 0)
      return null;
    const touches = stored.t
      .filter((item) => item && typeof item.c === 'string')
      .slice(0, MAX_TOUCHES)
      .map(unpack);
    if (!touches.length) return null;
    return {
      firstVisit: clip(stored.fv, 40) || touches[0].ts,
      firstTouch: touches[0],
      lastTouch: touches[touches.length - 1],
      touches
    };
  } catch {
    return null;
  }
}

const encode = (attr: CfAttr, touches: CfTouch[]) =>
  toBase64Url(
    JSON.stringify({ v: 1, fv: attr.firstVisit, t: touches.map(pack) })
  );

/** The cookie value, trimmed until `cf_src=<value>` fits in MAX_COOKIE_BYTES. */
export function serialise(attr: CfAttr): string {
  const fits = (value: string) =>
    CF_ATTR_COOKIE.length + 1 + value.length <= MAX_COOKIE_BYTES;

  let touches = attr.touches.length ? [...attr.touches] : [attr.lastTouch];
  let value = encode(attr, touches);
  // Drop the oldest touches after the first one.
  while (!fits(value) && touches.length > 2) {
    touches = [touches[0], ...touches.slice(2)];
    value = encode(attr, touches);
  }
  // Pathological values (very long click ids): keep the latest touch only.
  if (!fits(value)) {
    touches = [touches[touches.length - 1]];
    value = encode(attr, touches);
  }
  return value;
}

/** Tracking parameters on a URL, as opposed to ordinary ones like ?page=2. */
export function hasTrackingParams(p: URLSearchParams): boolean {
  return (
    UTM_KEYS.some((key) => p.has(key)) || CLICK_IDS.some((key) => p.has(key))
  );
}

/**
 * What proxy.ts should store for one page request: the new cookie value, or
 * null when nothing changes (an ordinary internal page view).
 */
export function nextCookieValue({
  existingRaw,
  params,
  referrer,
  pathname,
  ownHost,
  now = new Date()
}: {
  existingRaw?: string | null;
  params: URLSearchParams;
  referrer: string;
  pathname: string;
  ownHost: string;
  now?: Date;
}): string | null {
  const existing = parse(existingRaw);
  const externalReferrer =
    !!referrer && !isIgnoredReferrer(hostOf(referrer), ownHost);

  if (existing && !hasTrackingParams(params) && !externalReferrer) return null;

  const touch = buildTouch(params, referrer, pathname, ownHost, now);
  const merged = merge(existing, touch);
  if (existing && merged === existing) return null;
  return serialise(merged);
}

/** One line for the order email and the admin list. */
export function summaryLine(attr: CfAttr | null): string {
  if (!attr) return 'Unknown';
  if (attr.firstTouch.detail === attr.lastTouch.detail)
    return attr.lastTouch.detail;
  return `${attr.lastTouch.detail} (first touch: ${attr.firstTouch.detail})`;
}

export type OrderSource = {
  channel: string;
  sourceTracked: string;
  firstTouchChannel: string | null;
  firstTouchDetail: string | null;
  lastTouchChannel: string | null;
  lastTouchDetail: string | null;
  firstVisit: string | null;
  landingPage: string | null;
  referrer: string | null;
  gclid: string | null;
  fbclid: string | null;
  touchPath: string | null; // JSON array of CfTouch, oldest first
};

/** The fields sent with createSalesProduct / freeSample. */
export function orderSourceFields(attr: CfAttr | null): OrderSource {
  return {
    channel: attr?.lastTouch.channel ?? 'Unknown',
    sourceTracked: summaryLine(attr),
    firstTouchChannel: attr?.firstTouch.channel ?? null,
    firstTouchDetail: attr?.firstTouch.detail ?? null,
    lastTouchChannel: attr?.lastTouch.channel ?? null,
    lastTouchDetail: attr?.lastTouch.detail ?? null,
    firstVisit: attr?.firstVisit ?? null,
    landingPage: attr?.firstTouch.landingPage || null,
    referrer: attr?.firstTouch.referrer || null,
    gclid:
      attr?.lastTouch.clickIds.gclid ?? attr?.firstTouch.clickIds.gclid ?? null,
    fbclid:
      attr?.lastTouch.clickIds.fbclid ??
      attr?.firstTouch.clickIds.fbclid ??
      null,
    touchPath: attr ? JSON.stringify(attr.touches) : null
  };
}

/** The cookie's raw value from a document.cookie string. */
export function cookieFrom(cookieHeader: string): string | null {
  const entry = cookieHeader
    .split(/;\s*/)
    .find((part) => part.startsWith(`${CF_ATTR_COOKIE}=`));
  return entry ? entry.slice(CF_ATTR_COOKIE.length + 1) : null;
}

/** Browser only: the attribution stored for this visitor, or null. */
export function readAttribution(): CfAttr | null {
  if (typeof document === 'undefined') return null;
  try {
    return parse(cookieFrom(document.cookie));
  } catch {
    return null;
  }
}

/** Browser only: the source fields to send with an order. Never throws. */
export function readOrderSource(): OrderSource {
  return orderSourceFields(readAttribution());
}
