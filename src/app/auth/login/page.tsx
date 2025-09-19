'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong.';
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        alert('You have successfully logged in!');
        router.push('/');
      }
    } catch (err) {
      setError(getErrorMessage(err));
              router.push('/signup');

    }
  };

  return (
    <form className="signup-container form-wrapper" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="submit-button" type="submit">
        Login
      </button>
      {error && (
        <p className="error-message" style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </form>
  );
};

export default Login;
