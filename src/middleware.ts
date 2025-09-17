import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
});

export const config = {
  matcher: ['/'],
};
