'use client';
import Link from 'next/link';

const Error = () => {
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>An error occurred during authentication. Please try again.</p>
      <Link href="/login">
        <button>Go back to Login</button>
      </Link>
    </div>
  );
};

export default Error;
