'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');

    if (token && expiry) {
      const expiryTime = Number(expiry);
      const now = Date.now();

      if (now > expiryTime) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        router.push('/');
        return;
      }

      setIsLoggedIn(true);

      const timeout = setTimeout(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        router.push('/');
      }, expiryTime - now);

      return () => clearTimeout(timeout);
    }
  }, [router]);

  return { isLoggedIn };
}
