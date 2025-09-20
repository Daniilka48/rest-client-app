import { render, screen } from '@testing-library/react';
import MainPageMock from './page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

jest.mock('@/i18', () => ({
  t: (key: string) => key,
  i18n: { changeLanguage: jest.fn() },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    ready: true,
  }),
}));

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

describe('MainPageMock', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('redirects unauthenticated users', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<MainPageMock />);
    expect(pushMock).toHaveBeenCalledWith('/auth/login');
  });

  it('renders loading state', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<MainPageMock />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders content for authenticated users', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'John' } },
      status: 'authenticated',
    });

    render(<MainPageMock />);
    expect(screen.getByText('welcomeMessage')).toBeInTheDocument();
    expect(screen.getByText('greeting John!')).toBeInTheDocument();
  });
});
