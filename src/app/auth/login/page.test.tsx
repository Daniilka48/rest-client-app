import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Login from './page';
import { useToast } from '@/contexts/ToastContext';
import { validateEmail, validatePassword } from '@/utils/validation';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/utils/validation', () => ({
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
}));

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseTranslation = useTranslation as jest.MockedFunction<
  typeof useTranslation
>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockValidateEmail = validateEmail as jest.MockedFunction<
  typeof validateEmail
>;
const mockValidatePassword = validatePassword as jest.MockedFunction<
  typeof validatePassword
>;

describe('Login Page', () => {
  const mockPush = jest.fn();
  const mockShowSuccess = jest.fn();
  const mockShowError = jest.fn();

  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'login.title': 'Sign In',
      'login.emailPlaceholder': 'Email',
      'login.passwordPlaceholder': 'Password',
      'login.submitButton': 'Sign In',
      'login.noAccount': "Don't have an account?",
      'navigation.signUp': 'Sign Up',
      'login.successMessage': 'Successfully signed in!',
      'login.redirectMessage': 'User not found. Redirecting to signup...',
      'login.error.default': 'An error occurred. Please try again.',
      loading: 'Loading...',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    (mockUseTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      ready: true,
      i18n: {
        t: jest.fn(),
        init: jest.fn(),
        loadResources: jest.fn(),
        use: jest.fn(),
        changeLanguage: jest.fn(),
        language: 'en',
        languages: ['en', 'ru'],
      },
    });

    mockUseToast.mockReturnValue({
      toasts: [],
      addToast: jest.fn(),
      removeToast: jest.fn(),
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    mockValidateEmail.mockReturnValue({ isValid: true, errors: [] });
    mockValidatePassword.mockReturnValue({ isValid: true, errors: [] });
  });

  describe('Loading States', () => {
    it('should show loading when session is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      });

      render(<Login />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show loading when translation is not ready', () => {
      (mockUseTranslation as jest.Mock).mockReturnValue({
        t: mockT,
        ready: false,
        i18n: {
          t: jest.fn(),
          init: jest.fn(),
          loadResources: jest.fn(),
          use: jest.fn(),
          changeLanguage: jest.fn(),
          language: 'en',
          languages: ['en', 'ru'],
        },
      });

      render(<Login />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Authenticated User Redirect', () => {
    it('should redirect authenticated users to home page', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: '1', email: 'test@example.com' },
          expires: '2024-01-01',
        },
        status: 'authenticated',
        update: jest.fn(),
      });

      render(<Login />);

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Form Rendering', () => {
    it('should render login form with all elements', async () => {
      render(<Login />);

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Sign In' })
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Sign In' })
        ).toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: 'Sign Up' })
        ).toBeInTheDocument();
      });
    });

    it('should have correct link to signup page', async () => {
      render(<Login />);

      await waitFor(() => {
        const signupLink = screen.getByRole('link', { name: 'Sign Up' });
        expect(signupLink).toHaveAttribute('href', '/signup');
      });
    });
  });

  describe('Form Validation', () => {
    it('should call validation functions on form submission', async () => {
      render(<Login />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockValidateEmail).toHaveBeenCalledWith('test@example.com');
        expect(mockValidatePassword).toHaveBeenCalledWith('password123');
      });
    });

    it('should not call signIn when validation fails', async () => {
      mockValidateEmail.mockReturnValue({
        isValid: false,
        errors: ['Please enter a valid email address'],
      });

      render(<Login />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, {
        target: { value: 'validPassword123!' },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).not.toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call signIn with correct credentials on valid form submission', async () => {
      mockSignIn.mockResolvedValue({ ok: true, error: null } as never);

      render(<Login />);

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.click(submitButton);
      });

      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'Password123!',
      });
    });

    it('should handle successful login', async () => {
      mockSignIn.mockResolvedValue({ ok: true, error: null } as never);

      render(<Login />);

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockShowSuccess).toHaveBeenCalledWith('Successfully signed in!');
      });

      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith('/');
        },
        { timeout: 2000 }
      );
    });

    it('should handle user not found error with redirect to signup', async () => {
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'User not found.Please sign up.',
      } as never);

      render(<Login />);

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          'User not found.Please sign up.'
        );
        expect(mockShowSuccess).toHaveBeenCalledWith(
          'User not found. Redirecting to signup...'
        );
      });

      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith('/signup');
        },
        { timeout: 3000 }
      );
    });

    it('should handle invalid credentials error', async () => {
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'Invalid password',
      } as never);

      render(<Login />);

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Invalid password');
        expect(screen.getByText('Invalid password')).toBeInTheDocument();
      });
    });

    it('should disable form during submission', async () => {
      let resolveSignIn: (value: unknown) => void;
      const signInPromise = new Promise((resolve) => {
        resolveSignIn = resolve;
      });
      mockSignIn.mockReturnValue(signInPromise as never);

      render(<Login />);

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.click(submitButton);
      });

      expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled();
      expect(screen.getByPlaceholderText('Email')).toBeDisabled();
      expect(screen.getByPlaceholderText('Password')).toBeDisabled();

      resolveSignIn!({ ok: true, error: null });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Sign In' })
        ).not.toBeDisabled();
      });
    });
  });
});
