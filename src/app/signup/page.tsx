'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to register.');
      }

      router.push('/auth/login');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form className="signup-container form-wrapper" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <input
        className="input-field"
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button className="submit-button" type="submit">
        Sign Up
      </button>
      {error && (
        <p className="error-message" style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </form>
  );
};

export default SignUp;
