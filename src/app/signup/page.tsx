'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '@/utils/validation';
import { useToast } from '@/contexts/ToastContext';

const SignUp = () => {
  const { t, ready } = useTranslation('common');
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const { status } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    name?: string[];
    email?: string[];
    password?: string[];
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : 'Something went wrong.';
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (!isMounted || status === 'loading' || !ready) {
    return (
      <div className="signup-container form-wrapper">
        <p>Loading...</p>
      </div>
    );
  }

  const validateForm = () => {
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);

    const newErrors: {
      name?: string[];
      email?: string[];
      password?: string[];
    } = {};

    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors;
    }

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors;
    }

    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors;
    }

    setErrors(newErrors);
    return (
      nameValidation.isValid &&
      emailValidation.isValid &&
      passwordValidation.isValid
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t('signup.error.registrationFailed'));
      }

      showSuccess(t('signup.successMessage'));
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setErrors({ general: errorMessage });
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form className="signup-container form-wrapper" onSubmit={handleSubmit}>
      <h1>{t('signup.title')}</h1>

      <div className="input-group">
        <input
          className={`input-field ${errors.name ? 'error' : ''}`}
          type="text"
          placeholder={t('signup.namePlaceholder')}
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          disabled={isSubmitting}
        />
        {errors.name && (
          <div className="error-messages">
            {errors.name.map((error, index) => (
              <p key={index} className="error-message">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="input-group">
        <input
          className={`input-field ${errors.email ? 'error' : ''}`}
          type="email"
          placeholder={t('signup.emailPlaceholder')}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
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
          placeholder={t('signup.passwordPlaceholder')}
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
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
        {isSubmitting ? t('loading') : t('signup.submitButton')}
      </button>

      {errors.general && (
        <p className="error-message general-error">{errors.general}</p>
      )}

      <div className="signup-link">
        <p>
          {t('signup.hasAccount')}{' '}
          <Link href="/auth/login" className="signup-link-text">
            {t('navigation.signIn')}
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignUp;
