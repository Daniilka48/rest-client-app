import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (token && (pathname.startsWith('/auth') || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (
      !token &&
      (pathname.startsWith('/rest-client') ||
        pathname.startsWith('/history') ||
        pathname.startsWith('/variables'))
    ) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    },
  }
);

export const config = {
  matcher: [
    '/rest-client/:path*',
    '/history/:path*',
    '/variables/:path*',
    // '/auth/:path*',
    // '/signup',
  ],
};
