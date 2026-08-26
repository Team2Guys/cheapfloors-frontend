import { fetchCategories, get_allAdmins } from 'config/fetch';
import { findOneRedirectUrl } from 'config/general';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Category } from './types/cat';
import { validStaticPaths } from './data/paths';

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

    const redirectUrls = await findOneRedirectUrl(
      pathname.replace(/^\/+|\/+$/g, '')
    );
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

    if (validToken && isAuthRoute) {
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
