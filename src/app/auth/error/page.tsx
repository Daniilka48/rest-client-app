'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const Error = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let message = 'An error occurred during authentication. Please try again.';
  let action = (
    <Link href="/login">
      <button>Go back to Login</button>
    </Link>
  );

  if (error === 'UserNotFound') {
    message = 'User not found. Please sign up to continue.';
    action = (
      <Link href="/signup">
        <button>Go to Sign Up</button>
      </Link>
    );
  }

  if (error === 'CredentialsSignin') {
    message = 'Invalid email or password. Please try again.';
  }

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{message}</p>
      {action}
    </div>
  );
};

export default Error;