import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import SignUp from './page';
import { useToast, ToastContextType } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, ready: true }),
}));
jest.mock('@/contexts/ToastContext');

global.fetch = jest.fn();

describe('SignUp', () => {
  const pushMock = jest.fn();
  const showSuccessMock = jest.fn();
  const showErrorMock = jest.fn();

  const mockedUseToast = useToast as jest.MockedFunction<typeof useToast>;
  const mockedUseSession = useSession as jest.MockedFunction<typeof useSession>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    const toastContext: ToastContextType = {
      toasts: [],
      addToast: jest.fn(),
      removeToast: jest.fn(),
      showSuccess: showSuccessMock,
      showError: showErrorMock,
    };
    mockedUseToast.mockReturnValue(toastContext);

    mockedUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: async (): Promise<Session | null> => null,
    });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders loading initially', () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: async (): Promise<Session | null> => null,
    });
    render(<SignUp />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows validation errors if form is invalid', async () => {
    render(<SignUp />);
    fireEvent.change(screen.getByPlaceholderText('signup.namePlaceholder'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText('signup.emailPlaceholder'), {
      target: { value: 'invalid' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('signup.passwordPlaceholder'),
      { target: { value: '123' } }
    );

    fireEvent.click(screen.getByText('signup.submitButton'));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('signup.namePlaceholder')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('signup.emailPlaceholder')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('signup.passwordPlaceholder')
      ).toBeInTheDocument();
    });
  });

  it('submits the form successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Registered' }),
    });

    render(<SignUp />);
    fireEvent.change(screen.getByPlaceholderText('signup.namePlaceholder'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('signup.emailPlaceholder'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('signup.passwordPlaceholder'),
      { target: { value: 'Password123!' } }
    );

    await act(async () => {
      fireEvent.click(screen.getByText('signup.submitButton'));
    });

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(showSuccessMock).toHaveBeenCalledWith('signup.successMessage');
      expect(pushMock).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('shows error if fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed' }),
    });

    render(<SignUp />);
    fireEvent.change(screen.getByPlaceholderText('signup.namePlaceholder'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('signup.emailPlaceholder'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('signup.passwordPlaceholder'),
      { target: { value: 'Password123!' } }
    );

    await act(async () => {
      fireEvent.click(screen.getByText('signup.submitButton'));
    });

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith('Failed');
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
  });
});
