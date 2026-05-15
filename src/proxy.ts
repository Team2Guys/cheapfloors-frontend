import { fetchCategories, get_allAdmins } from 'config/fetch';
import { findOneRedirectUrl } from 'config/general';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Category } from './types/cat';
import { validStaticPaths } from './data/paths';

export async function proxy(req: NextRequest) {
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

    // console.log(isProtectedRoute, 'isAuthRoute', isAuthRoute);

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
  matcher: ['/((?!api|_next|.*\\.).+)']
};
