'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { validateEmail, validatePassword } from '@/utils/validation';
import { useToast } from '@/contexts/ToastContext';

const Login = () => {
  const { t, ready } = useTranslation('common');
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Show loading while checking session or translations not ready
  if (!isMounted || status === 'loading' || !ready) {
    return (
      <div className="signup-container form-wrapper">
        <p>Loading...</p>
      </div>
    );
  }

  const validateForm = () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    const newErrors: { email?: string[]; password?: string[] } = {};

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors;
    }

    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors;
    }

    setErrors(newErrors);
    return emailValidation.isValid && passwordValidation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (
          result.error?.includes('User not found') ||
          result.error?.includes('Invalid credentials')
        ) {
          setErrors({ general: result.error });
          showError(result.error);
          showSuccess(t('login.redirectMessage'));
          setTimeout(() => {
            router.push('/signup');
          }, 2000);
        } else {
          setErrors({ general: result.error });
          showError(result.error);
        }
      } else {
        showSuccess(t('login.successMessage'));
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch {
      setErrors({ general: t('login.error.default') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="signup-container form-wrapper" onSubmit={handleSubmit}>
      <h1>{t('login.title')}</h1>

      <div className="input-group">
        <input
          className={`input-field ${errors.email ? 'error' : ''}`}
          type="email"
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors({ ...errors, email: undefined });
            }
          }}
          required
          disabled={isSubmitting}
        />
        {errors.email && (
          <div className="error-messages">
            {errors.email.map((error, index) => (
              <p key={index} className="error-message">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="input-group">
        <input
          className={`input-field ${errors.password ? 'error' : ''}`}
          type="password"
          placeholder={t('login.passwordPlaceholder')}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors({ ...errors, password: undefined });
            }
          }}
          required
          disabled={isSubmitting}
        />
        {errors.password && (
          <div className="error-messages">
            {errors.password.map((error, index) => (
              <p key={index} className="error-message">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <button className="submit-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('loading') : t('login.submitButton')}
      </button>

      {errors.general && (
        <p className="error-message general-error">{errors.general}</p>
      )}

      <div className="signup-link">
        <p>
          {t('login.noAccount')}{' '}
          <Link href="/signup" className="signup-link-text">
            {t('navigation.signUp')}
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
