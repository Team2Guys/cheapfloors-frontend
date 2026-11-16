// Run with: node --test src/lib/__tests__/cf-attribution.test.mts
// (Node 22.18+ / 24 runs TypeScript directly; nothing to install.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CF_ATTR_COOKIE,
  MAX_COOKIE_BYTES,
  buildTouch,
  classify,
  merge,
  nextCookieValue,
  orderSourceFields,
  parse,
  serialise
} from '../cf-attribution.ts';

const HOST = 'cheapfloors.ae';
const q = (query: string) => new URLSearchParams(query);
const at = (minutes: number) =>
  new Date(Date.UTC(2026, 10, 16, 10, 0, 0) + minutes * 60_000);

/** One page request through the same function proxy.ts calls. */
const visit = (
  raw: string | null,
  { query = '', referrer = '', path = '/', minute = 0 } = {}
) =>
  nextCookieValue({
    existingRaw: raw,
    params: q(query),
    referrer,
    pathname: path,
    ownHost: HOST,
    now: at(minute)
  }) ?? raw;

const GOOGLE_ADS =
  'gclid=test123&utm_source=google&utm_medium=cpc&utm_campaign=999&utm_content=888&utm_term=spc+flooring&utm_matchtype=e';

test('1. Google Ads landing gets the full detail line', () => {
  const attr = parse(visit(null, { query: GOOGLE_ADS, path: '/spc-flooring' }));
  assert.ok(attr);
  assert.equal(attr.lastTouch.channel, 'Google Ads');
  assert.equal(
    attr.lastTouch.detail,
    'Google Ads - Campaign 999 - Ad Group 888 - "spc flooring" [e]'
  );
  assert.equal(attr.lastTouch.clickIds.gclid, 'test123');
  assert.equal(attr.firstTouch.landingPage, '/spc-flooring');
});

test('2. a later direct visit (browser reopened) keeps the paid source', () => {
  let raw = visit(null, { query: GOOGLE_ADS });
  // Days later: typed the address, no params, no referrer.
  raw = visit(raw, { minute: 60 * 24 * 3 });
  const source = orderSourceFields(parse(raw));
  assert.equal(source.channel, 'Google Ads');
  assert.equal(source.gclid, 'test123');
});

test('3. coming back from CCAvenue or the backend is never a source', () => {
  let raw = visit(null, { query: GOOGLE_ADS });
  for (const referrer of [
    'https://secure.ccavenue.ae/',
    'https://secure.ccavenue.com/transaction/transaction.do',
    'https://cheapfloors-backend.vercel.app/',
    'https://checkout.tamara.co/',
    'https://secure.telr.com/'
  ]) {
    const next = visit(raw, { referrer, path: '/thank-you', minute: 10 });
    assert.equal(next, raw, `${referrer} must not change the cookie`);
    raw = next;
  }
  // First ever request straight from the gateway: Direct, referrer dropped.
  const fresh = parse(visit(null, { referrer: 'https://secure.ccavenue.ae/' }));
  assert.equal(fresh?.lastTouch.channel, 'Direct');
  assert.equal(fresh?.lastTouch.referrer, '');
});

test('4. Meta first, Google Ads last: both kept in the path', () => {
  let raw = visit(null, {
    query:
      'fbclid=abc&utm_source=meta&utm_medium=paid_social&utm_campaign=Nov+Flooring&utm_content=Dubai+25-45'
  });
  raw = visit(raw, { path: '/blogs', minute: 5 });
  raw = visit(raw, { query: GOOGLE_ADS, minute: 60 * 24 });
  const source = orderSourceFields(parse(raw));
  assert.equal(source.firstTouchChannel, 'Meta Ads');
  assert.equal(
    source.firstTouchDetail,
    'Meta Ads - Campaign "Nov Flooring" - Ad Set "Dubai 25-45"'
  );
  assert.equal(source.lastTouchChannel, 'Google Ads');
  const path = JSON.parse(source.touchPath ?? '[]');
  assert.deepEqual(
    path.map((touch: { channel: string }) => touch.channel),
    ['Meta Ads', 'Google Ads']
  );
  assert.ok(path.every((touch: { ts: string }) => touch.ts));
  assert.match(source.sourceTracked, /first touch: Meta Ads/);
});

test('5. fbclid alone is never Meta Ads', () => {
  assert.equal(
    classify(q('fbclid=abc'), 'https://l.instagram.com/').channel,
    'Instagram (organic)'
  );
  assert.equal(
    classify(q('fbclid=abc'), '').channel,
    'Facebook/Instagram (organic or untagged paid)'
  );
  // Paired signals.
  assert.equal(classify(q('fbclid=abc&utm_medium=cpc'), '').channel, 'Meta Ads');
  assert.equal(
    classify(q('fbclid=abc&utm_source=facebook'), '').channel,
    'Meta Ads'
  );
  assert.equal(
    classify(q('utm_source=instagram&utm_medium=paid'), '').channel,
    'Meta Ads'
  );
  // Source alone, no fbclid, no paid medium: not an ad.
  assert.equal(
    classify(q('utm_source=facebook&utm_medium=social'), '').channel,
    'Referral: facebook'
  );
});

test('6. no params and no referrer is Direct with no detail line', () => {
  const attr = parse(visit(null));
  assert.equal(attr?.lastTouch.channel, 'Direct');
  assert.equal(attr?.lastTouch.detail, 'Direct');
  assert.equal(orderSourceFields(attr).sourceTracked, 'Direct');
});

test('7. refreshing a paid landing page five times logs one touch', () => {
  let raw = visit(null, { query: GOOGLE_ADS });
  for (let minute = 1; minute <= 5; minute++) {
    raw = visit(raw, {
      query: GOOGLE_ADS,
      referrer: 'https://www.google.com/',
      minute
    });
  }
  assert.equal(parse(raw)?.touches.length, 1);
  // The same ad clicked again the next day is a new touch.
  raw = visit(raw, { query: GOOGLE_ADS, minute: 60 * 24 });
  assert.equal(parse(raw)?.touches.length, 2);
});

test('a bare direct visit never overwrites an earlier paid click', () => {
  let raw = visit(null, { query: GOOGLE_ADS });
  raw = visit(raw, { query: 'page=2', minute: 40 });
  assert.equal(parse(raw)?.lastTouch.channel, 'Google Ads');
});

test('organic, AI and referral sources', () => {
  assert.equal(classify(q(''), 'https://www.google.com/').channel, 'Google Organic');
  assert.equal(classify(q(''), 'https://www.bing.com/').channel, 'Bing Organic');
  assert.equal(classify(q(''), 'https://duckduckgo.com/').channel, 'Other Organic');
  assert.equal(classify(q(''), 'https://chatgpt.com/').channel, 'ChatGPT');
  assert.equal(classify(q(''), 'https://www.tiktok.com/').channel, 'TikTok (organic)');
  assert.equal(
    classify(q(''), 'https://www.houzz.com/ideas').channel,
    'Referral: houzz.com'
  );
});

test('the site itself is never a referrer, wherever it runs', () => {
  assert.equal(
    classify(q(''), 'http://localhost:3000/collections', 'localhost:3000').channel,
    'Direct'
  );
  const raw = visit(null, { query: GOOGLE_ADS });
  const next = nextCookieValue({
    existingRaw: raw,
    params: q(''),
    referrer: 'https://cheapfloors.ae/spc-flooring',
    pathname: '/checkout',
    ownHost: HOST,
    now: at(90)
  });
  assert.equal(next, null);
});

test('ten paid clicks still fit in one cookie, first and last kept', () => {
  let raw: string | null = null;
  const gclid = `Cj0KCQiA${'x'.repeat(120)}`;
  for (let day = 0; day < 10; day++) {
    raw = visit(raw, {
      query: `gclid=${gclid}${day}&utm_source=google&utm_medium=cpc&utm_campaign=23459862895&utm_content=198336102709&utm_term=spc+flooring+dubai+${day}&utm_matchtype=p`,
      referrer: 'https://www.google.com/',
      path: '/spc-flooring/herringbone',
      minute: day * 60 * 24
    });
  }
  assert.ok(raw);
  assert.ok(
    CF_ATTR_COOKIE.length + 1 + raw.length <= MAX_COOKIE_BYTES,
    `cookie is ${raw.length} bytes`
  );
  const attr = parse(raw);
  assert.ok(attr && attr.touches.length >= 3);
  assert.equal(attr.firstTouch.utm_term, 'spc flooring dubai 0');
  assert.equal(attr.lastTouch.utm_term, 'spc flooring dubai 9');
});

test('non-ASCII values survive the cookie', () => {
  const raw = visit(null, {
    query: 'utm_source=google&utm_medium=cpc&utm_term=%D8%A3%D8%B1%D8%B6%D9%8A%D8%A7%D8%AA'
  });
  assert.equal(parse(raw)?.lastTouch.utm_term, 'أرضيات');
});

test('a missing or tampered cookie reads as no source', () => {
  assert.equal(parse(undefined), null);
  assert.equal(parse('not-base64!!'), null);
  assert.equal(parse(serialise(merge(null, buildTouch(q(''), '', '/'))).slice(5)), null);
  const unknown = orderSourceFields(null);
  assert.equal(unknown.channel, 'Unknown');
  assert.equal(unknown.sourceTracked, 'Unknown');
  assert.equal(unknown.touchPath, null);
});

test('values are cleaned before they are stored', () => {
  const touch = buildTouch(
    q('utm_source=google&utm_medium=cpc&utm_term=<script>alert(1)</script>'),
    'https://www.google.com/search?q=private+stuff',
    '/'
  );
  assert.ok(!touch.detail.includes('<'));
  assert.equal(touch.referrer, 'https://www.google.com/search');
});
