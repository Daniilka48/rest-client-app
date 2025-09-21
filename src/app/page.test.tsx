import React from 'react';
import { render, screen } from '@testing-library/react';
import MainPageMock from './page';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, ready: true }),
}));

jest.mock('../i18', () => ({}));

describe('MainPageMock', () => {
  it('renders loading state', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });
    render(<MainPageMock />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders unauthenticated view', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    render(<MainPageMock />);
    expect(screen.getByText('welcomeMessage')).toBeInTheDocument();
    expect(screen.getByText('navigation.signIn')).toBeInTheDocument();
    expect(screen.getByText('navigation.signUp')).toBeInTheDocument();
  });

  it('renders authenticated view', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'John Doe', email: 'john@example.com' } },
      status: 'authenticated',
    });
    render(<MainPageMock />);
    expect(screen.getByText('welcomeMessage, John Doe')).toBeInTheDocument();
    expect(screen.getByText('REST Client')).toBeInTheDocument();
    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });
});
