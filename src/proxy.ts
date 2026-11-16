import { fetchCategories, get_allAdmins } from 'config/fetch';
import { findOneRedirectUrl } from 'config/general';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Category } from './types/cat';
import { validStaticPaths } from './data/paths';
import {
  CF_ATTR_COOKIE,
  CF_ATTR_MAX_AGE,
  nextCookieValue
} from './lib/cf-attribution';

// Old domain -> new domain, path-to-path. Exact host match only, so
// cheapfloors.ae (and previews) can never re-enter this branch — no loop.
const OLD_HOSTS = ['easyfloors.ae', 'www.easyfloors.ae'];
const NEW_ORIGIN = 'https://cheapfloors.ae';

export async function proxy(req: NextRequest) {
  const response = await route(req);
  recordSource(req, response);
  return response;
}

/**
 * Order source tracking (lib/cf-attribution.ts): remember where the visitor
 * came from in the cf_src cookie. Runs on every landing, including the
 * homepage and the CMS 301 / 410 responses, since the ad click parameters are
 * only in the address bar on that first request. Must never break a page.
 */
function recordSource(req: NextRequest, response: NextResponse) {
  try {
    const host = (req.headers.get('host') ?? '').toLowerCase();
    const { pathname, searchParams, protocol } = req.nextUrl;
    // Client-side navigations reach the proxy too (Next strips their RSC
    // headers first), but they come from the site itself, so their referrer
    // is ignored and nothing changes. Browser prefetches are kept on purpose:
    // Chrome only keeps a cookie set during a cross-site prefetch if the
    // visitor then opens the page, which is exactly a landing.
    if (
      req.method !== 'GET' ||
      OLD_HOSTS.includes(host.split(':')[0]) ||
      pathname.startsWith('/dashboard')
    ) {
      return;
    }

    const value = nextCookieValue({
      existingRaw: req.cookies.get(CF_ATTR_COOKIE)?.value,
      params: searchParams,
      referrer: req.headers.get('referer') ?? '',
      pathname,
      ownHost: host
    });
    if (!value) return;

    response.cookies.set(CF_ATTR_COOKIE, value, {
      maxAge: CF_ATTR_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      secure: protocol === 'https:',
      // Checkout and the WhatsApp links read it in the browser.
      httpOnly: false
    });
  } catch (error) {
    console.error('Order source tracking error:', error);
  }
}

async function route(req: NextRequest): Promise<NextResponse> {
  const host = (req.headers.get('host') ?? '').split(':')[0].toLowerCase();
  if (OLD_HOSTS.includes(host)) {
    const { pathname, search } = req.nextUrl;
    // Must stay 301 (SEO: permanent, link equity transfer) — not 307/308.
    return NextResponse.redirect(new URL(pathname + search, NEW_ORIGIN), 301);
  }

  // '/' is in the matcher only for the old-domain redirect above; the
  // CMS-redirect/410/auth logic below stays off the homepage, as before.
  if (req.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  try {
    const token =
      req.cookies.get('admin_access_token')?.value ||
      req.cookies.get('super_admin_access_token')?.value;
    const pathname = req.nextUrl.pathname;
    const cleanPath = pathname.replace(/^\/+|\/+$/g, '');

    const redirectUrls = await findOneRedirectUrl(
      pathname.replace(/^\/+|\/+$/g, '')
    );
    // Strip leading slashes: '/about-us' would otherwise become '//about-us',
    // which the URL parser treats as a host (https://about-us/).
    const redirectTarget = (redirectUrls?.redirectedUrl ?? '')
      .trim()
      .replace(/^\/+|\/+$/g, '');
    if (
      redirectUrls &&
      redirectUrls.status === 'PUBLISHED' &&
      redirectTarget !== cleanPath
    ) {
      return NextResponse.redirect(
        new URL(`/${redirectTarget}`, req.url),
        301
      );
    }

    const segments = cleanPath.split('/').filter(Boolean);
    // ✅ Only apply 410
    if (segments.length === 1) {
      const slug = segments[0];
      if (!validStaticPaths.includes(`/${segments[0]}`)) {
        const categories = await fetchCategories();
        const findCategory = categories.find(
          (cat: Category) =>
            (cat.custom_url?.trim() ?? '') === slug &&
            cat.status === 'PUBLISHED'
        );

        if (!findCategory) {
          return new NextResponse(null, { status: 410 });
        }
      }
    }

    const isAuthRoute = pathname === '/dashboard/Admin-login';
    const isProtectedRoute = pathname.startsWith('/dashboard') && !isAuthRoute;


    let validToken = false;
    if (token) {
      try {
        const adminList = await get_allAdmins(token);
        if (adminList && adminList.length > 0) {
          validToken = true;
        }
      } catch {
        validToken = false;
      }
    }

    // admin_data is the dashboard's record of who is logged in. Without it the
    // dashboard renders with no user (and no menu), so show the login page
    // instead of bouncing back - this also lets logout work on localhost,
    // where the backend's httpOnly token cookie can't be removed from JS.
    if (validToken && isAuthRoute && req.cookies.has('admin_data')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!validToken && isProtectedRoute) {
      return NextResponse.redirect(new URL('/dashboard/Admin-login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.next();
  }
}

export const config = {
  // '/' added so the homepage of the old domain also 301s; the second
  // pattern (unchanged) excludes /api, /_next/* and any dotted path
  // (favicon.ico, robots.txt, sitemap.xml, images, etc.).
  matcher: ['/', '/((?!api|_next|.*\\.).+)']
};
