import { Blog } from 'types/blog';
import { PageSchema } from 'data/page-schema';

/**
 * Auto-generated JSON-LD for blog detail pages (same approach as
 * blindsandcurtains.ae / shutters.ae): BlogPosting + BreadcrumbList on every
 * post, plus a FAQPage block when the post has a Q&A section. Everything is
 * built from the post record on each request, so dashboard edits flow through
 * with no manual step.
 */

export const SITE_URL = 'https://cheapfloors.ae';

/** Same identity the home page's Organization schema declares. */
const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Cheap Floors',
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/assets/images/logo.png`
  }
};

/** Meta descriptions are capped around this length; excerpts match it. */
const EXCERPT_LENGTH = 160;

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  rarr: '→',
  larr: '←',
  bull: '•',
  middot: '·',
  deg: '°',
  times: '×',
  sup2: '²',
  sup3: '³',
  frac12: '½',
  pound: '£',
  euro: '€',
  copy: '©',
  reg: '®',
  trade: '™'
};

// Accented letters the editor emits as entities (&eacute; -> é): base letter
// + combining mark, composed with NFC.
const ACCENT_MARKS: Record<string, string> = {
  acute: '́',
  grave: '̀',
  circ: '̂',
  uml: '̈',
  tilde: '̃',
  cedil: '̧',
  ring: '̊'
};

const decodeNamedEntity = (match: string, name: string): string => {
  const accent = /^([a-z])(acute|grave|circ|uml|tilde|cedil|ring)$/i.exec(name);
  if (accent) {
    return `${accent[1]}${ACCENT_MARKS[accent[2].toLowerCase()]}`.normalize('NFC');
  }
  return NAMED_ENTITIES[name.toLowerCase()] ?? match;
};

const decodeEntities = (input: string): string =>
  input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+\d*);/gi, decodeNamedEntity);

/** Tags out, entities decoded, whitespace collapsed. */
export const htmlToText = (html: string): string =>
  decodeEntities(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

/** Opening text of the body, trimmed to EXCERPT_LENGTH on a word boundary. */
const toExcerpt = (html: string): string | undefined => {
  const text = htmlToText(html);
  if (!text) return undefined;
  if (text.length <= EXCERPT_LENGTH) return text;
  const cut = text.slice(0, EXCERPT_LENGTH);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 80))}…`;
};

const toIso = (value: unknown): string | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value as string);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

/** The page's canonical URL, matching generateMetadata in app/blogs/[slug]. */
export const getBlogCanonicalUrl = (blog: Blog): string =>
  blog.Canonical_Tag?.trim() || `${SITE_URL}/blogs/${blog.custom_url}`;

export interface BlogFaq {
  question: string;
  answer: string;
}

// Headings that open a Q&A section: "Frequently Asked Questions", "FAQs",
// "Common Questions About …", "Questions & Answers", "Q&A".
const FAQ_HEADING =
  /\b(faqs?|frequently asked questions|common questions|questions\s*(and|&)\s*answers|q\s*&\s*a)\b/i;

/**
 * Pull question/answer pairs out of the post HTML.
 *
 * Two conventions are recognised:
 *  1. A FAQ section: a heading such as "Frequently Asked Questions" or
 *     "Common Questions About …", followed by questions ending in "?" — as
 *     sub-headings (`<h2>FAQs</h2><h3>Question?</h3><p>Answer</p>`) or as
 *     short plain paragraphs. Only headings deeper than the FAQ heading are
 *     questions, and the next heading at the FAQ heading's level or above ends
 *     the section — so a closing CTA such as `<h2>Ready to order?</h2>` or
 *     "Conclusion" is not an FAQ.
 *  2. Bold paragraphs ending in "?" (`<p><strong>Question?</strong></p>`)
 *     anywhere in the post.
 *
 * Ordinary body headings that happen to end in "?" are article sections, not
 * FAQs, and are never used; neither is anything inside a <table> (comparison
 * tables have header cells like "Suitable?"). An answer is the first
 * paragraph after the question plus any list items under it, so a closing
 * paragraph after the last FAQ isn't folded into its answer. Returns [] when
 * there is nothing to extract.
 */
export const extractFaqs = (content: string): BlogFaq[] => {
  const html = content.replace(/<table\b[\s\S]*?<\/table>/gi, ' ');
  const blockRe = /<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  const faqs: BlogFaq[] = [];
  let question: string | null = null;
  let answerParts: string[] = [];
  // Set once the answer's paragraph is taken; later paragraphs are not part of it.
  let answerClosed = false;
  // Level of the open FAQ section's heading (2 for an <h2>), null when outside one.
  let faqLevel: number | null = null;

  const flush = () => {
    if (question) {
      const answer = answerParts.join(' ').trim();
      if (answer) faqs.push({ question, answer });
    }
    question = null;
    answerParts = [];
    answerClosed = false;
  };

  let match: RegExpExecArray | null;
  while ((match = blockRe.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2];
    const text = htmlToText(inner);
    if (!text) continue; // spacer blocks (&nbsp;)

    const asksQuestion = text.endsWith('?');

    if (tag.startsWith('h')) {
      const level = Number(tag[1]);
      if (faqLevel !== null && level > faqLevel && asksQuestion) {
        // A question inside the FAQ section.
        flush();
        question = text;
        continue;
      }
      // Any other heading closes the open answer, and a heading at or above
      // the FAQ heading's level closes the section itself.
      flush();
      if (faqLevel !== null && level <= faqLevel) faqLevel = null;
      if (!asksQuestion && FAQ_HEADING.test(text)) faqLevel = level;
      continue;
    }

    const isBoldQuestion =
      tag === 'p' &&
      asksQuestion &&
      /^\s*<(strong|b)\b[^>]*>[\s\S]*<\/(strong|b)>\s*$/i.test(inner);
    // Inside a FAQ section, a short plain paragraph ending in "?" is a question.
    const isPlainFaqQuestion =
      faqLevel !== null && tag === 'p' && asksQuestion && text.length <= 160;

    if (isBoldQuestion || isPlainFaqQuestion) {
      flush();
      question = text;
    } else if (question && !answerClosed) {
      if (tag === 'p' && answerParts.length) {
        // A second paragraph: the answer is complete.
        answerClosed = true;
      } else {
        answerParts.push(text);
      }
    }
  }
  flush();
  return faqs;
};

/**
 * JSON-LD blocks for one post: BlogPosting, BreadcrumbList and (when the post
 * has Q&A) FAQPage. `undefined` fields are dropped by JSON.stringify, so
 * missing optional data simply leaves the property out.
 */
export const buildBlogSchemas = (blog: Blog): PageSchema[] => {
  const canonicalUrl = getBlogCanonicalUrl(blog);
  const datePublished = toIso(blog.createdAt);
  const dateModified = toIso(blog.updatedAt) || datePublished;
  const image = blog.posterImageUrl?.imageUrl;
  const content = blog.content ?? '';

  const blogPosting: PageSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    url: canonicalUrl,
    headline: blog.title,
    name: blog.title,
    description: blog.Meta_Description?.trim() || toExcerpt(content),
    image: image ? [image] : undefined,
    datePublished,
    dateModified,
    author: { '@type': 'Organization', name: ORGANIZATION.name, url: ORGANIZATION.url },
    publisher: ORGANIZATION,
    articleSection: blog.category?.trim() || undefined,
    inLanguage: 'en'
  };

  // Mirrors the breadcrumb shown on the page: Home / Blogs / post.
  const breadcrumb: PageSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${SITE_URL}/blogs` },
      { '@type': 'ListItem', position: 3, name: blog.title, item: canonicalUrl }
    ]
  };

  const faqs = extractFaqs(content);
  const faqPage: PageSchema | null = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      }
    : null;

  return [blogPosting, breadcrumb, faqPage].filter(
    (schema): schema is PageSchema => schema !== null
  );
};
