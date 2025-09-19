import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect authenticated users away from auth pages
    if (token && (pathname.startsWith('/auth') || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to auth pages and signup for unauthenticated users
        if (pathname.startsWith('/auth') || pathname === '/signup') {
          return true;
        }

        // Require authentication for protected routes
        if (
          pathname.startsWith('/rest-client') ||
          pathname.startsWith('/history') ||
          pathname.startsWith('/variables')
        ) {
          return !!token;
        }

        // Allow access to other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/rest-client/:path*',
    '/history/:path*',
    '/variables/:path*',
    '/auth/:path*',
    '/signup',
  ],
};
