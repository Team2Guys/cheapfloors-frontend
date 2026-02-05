import { get_allAdmins } from 'config/fetch';
import { findOneRedirectUrl } from 'config/general';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  try {
    const token =
      req.cookies.get('admin_access_token')?.value ||
      req.cookies.get('super_admin_access_token')?.value;
    const pathname = req.nextUrl.pathname;

    const redirectUrls = await findOneRedirectUrl(
      pathname.replace(/^\/+|\/+$/g, '')
    );
    if (redirectUrls && redirectUrls.status === 'PUBLISHED') {
      return NextResponse.redirect(
        new URL(`/${redirectUrls?.redirectedUrl}`, req.url),
        301
      );
    }

    const isAuthRoute = pathname === '/dashboard/Admin-login';
    const isProtectedRoute = pathname.startsWith('/dashboard') && !isAuthRoute;

    console.log(isProtectedRoute, 'isAuthRoute', isAuthRoute);

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
