import { fetchCategories, fetchCurrentAdmin } from 'config/fetch';
import { findOneRedirectUrl } from 'config/general';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Category } from './types/cat';
import { validStaticPaths } from './data/paths';
import { canOpenDashboardPage } from './data/adminPermissions';

const LOGIN_PAGE = '/dashboard/Admin-login';

const isDashboardPage = (pathname: string) =>
  pathname.startsWith('/dashboard') &&
  pathname.replace(/\/+$/, '') !== LOGIN_PAGE;

// Old domain -> new domain, path-to-path. Exact host match only, so
// cheapfloors.ae (and previews) can never re-enter this branch — no loop.
const OLD_HOSTS = ['easyfloors.ae', 'www.easyfloors.ae'];
const NEW_ORIGIN = 'https://cheapfloors.ae';

export async function proxy(req: NextRequest) {
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

    // A failed lookup means "no redirect". Letting it throw landed in the outer
    // catch, which used to skip the dashboard checks below entirely.
    const redirectUrls = await findOneRedirectUrl(
      pathname.replace(/^\/+|\/+$/g, '')
    ).catch(() => null);
    if (redirectUrls && redirectUrls.status === 'PUBLISHED') {
      return NextResponse.redirect(
        new URL(`/${redirectUrls?.redirectedUrl}`, req.url),
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

    const isAuthRoute = pathname.replace(/\/+$/, '') === LOGIN_PAGE;
    const isProtectedRoute = isDashboardPage(pathname);


    // The backend resolves the admin from the verified token, so this both
    // proves the session and yields the real role and grants — the admin_data
    // cookie is written by the browser and can say anything. (This used to
    // fetch every admin, passwords included, on each dashboard request.)
    const admin = token ? await fetchCurrentAdmin(token) : null;
    const validToken = !!admin;

    if (validToken && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!validToken && isProtectedRoute) {
      return NextResponse.redirect(new URL(LOGIN_PAGE, req.url));
    }

    // Pages load their data on the server, so this has to be decided before
    // they render — the sidebar hiding a link does not stop a typed URL.
    if (isProtectedRoute && !canOpenDashboardPage(admin, pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Proxy error:', error);
    // Fail closed: an unexpected error must not wave a request into the
    // dashboard without its session and permission checks.
    if (isDashboardPage(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(LOGIN_PAGE, req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  // '/' added so the homepage of the old domain also 301s; the second
  // pattern (unchanged) excludes /api, /_next/* and any dotted path
  // (favicon.ico, robots.txt, sitemap.xml, images, etc.).
  matcher: ['/', '/((?!api|_next|.*\\.).+)']
};
