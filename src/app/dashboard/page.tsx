'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [router, status]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      className="signup-container form-wrapper"
    >
      <h1>Welcome to Your Dashboard</h1>
      <p>Hello, {session?.user?.name || 'User'}!</p>
    </div>
  );
};

export default Dashboard;
