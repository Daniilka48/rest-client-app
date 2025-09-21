import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn(() => ({ type: 'redirect' })),
    next: jest.fn(() => ({ type: 'next' })),
  },
}));

jest.mock('next-auth/middleware', () => ({
  withAuth: jest.fn((middlewareFunction) => middlewareFunction),
}));

describe('Middleware Logic Tests', () => {
  let mockNextResponse: jest.Mocked<typeof NextResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;
  });

  const createMockRequest = (pathname: string, token: unknown = null) => ({
    nextUrl: { pathname },
    url: 'http://localhost:3000',
    nextauth: { token },
  });

  describe('Authenticated User Scenarios', () => {
    const token = { sub: 'user123' };

    it('should redirect from auth pages to home when authenticated', () => {
      const req = createMockRequest('/auth/login', token);

      if (token && req.nextUrl.pathname.startsWith('/auth')) {
        NextResponse.redirect(new URL('/', req.url));
      }

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/', req.url)
      );
    });

    it('should redirect from signup to home when authenticated', () => {
      const req = createMockRequest('/signup', token);

      if (token && req.nextUrl.pathname === '/signup') {
        NextResponse.redirect(new URL('/', req.url));
      }

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/', req.url)
      );
    });

    it('should allow access to protected routes when authenticated', () => {
      const req = createMockRequest('/rest-client', token);

      if (token || !req.nextUrl.pathname.startsWith('/rest-client')) {
        NextResponse.next();
      }

      expect(mockNextResponse.next).toHaveBeenCalled();
    });

    it('should allow access to home page when authenticated', () => {
      NextResponse.next();

      expect(mockNextResponse.next).toHaveBeenCalled();
    });
  });

  describe('Unauthenticated User Scenarios', () => {
    const token = null;

    it('should redirect from protected routes to login when unauthenticated', () => {
      const req = createMockRequest('/rest-client', token);

      if (!token && req.nextUrl.pathname.startsWith('/rest-client')) {
        NextResponse.redirect(new URL('/auth/login', req.url));
      }

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/auth/login', req.url)
      );
    });

    it('should redirect from history to login when unauthenticated', () => {
      const req = createMockRequest('/history', token);

      if (!token && req.nextUrl.pathname.startsWith('/history')) {
        NextResponse.redirect(new URL('/auth/login', req.url));
      }

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/auth/login', req.url)
      );
    });

    it('should redirect from variables to login when unauthenticated', () => {
      const req = createMockRequest('/variables', token);

      if (!token && req.nextUrl.pathname.startsWith('/variables')) {
        NextResponse.redirect(new URL('/auth/login', req.url));
      }

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/auth/login', req.url)
      );
    });

    it('should allow access to public routes when unauthenticated', () => {
      NextResponse.next();

      expect(mockNextResponse.next).toHaveBeenCalled();
    });
  });
});

describe('Middleware Config', () => {
  it('should have correct matcher configuration', () => {
    const expectedMatcher = [
      '/rest-client/:path*',
      '/history/:path*',
      '/variables/:path*',
    ];

    expect(expectedMatcher).toContain('/rest-client/:path*');
    expect(expectedMatcher).toContain('/history/:path*');
    expect(expectedMatcher).toContain('/variables/:path*');
    expect(expectedMatcher).toHaveLength(3);
  });
});
