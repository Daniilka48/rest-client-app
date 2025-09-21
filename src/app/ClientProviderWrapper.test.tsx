import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import ClientProviderWrapper from './ClientProviderWrapper';

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('react-i18next', () => ({
  I18nextProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
jest.mock('@/i18', () => ({}));

jest.mock('@/contexts/ToastContext', () => ({
  ToastProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/Header/Header', () => {
  const Header = () => <div data-testid="header">Header</div>;
  return { __esModule: true, default: Header };
});
jest.mock('@/components/Footer/Footer', () => {
  const Footer = () => <div data-testid="footer">Footer</div>;
  return { __esModule: true, default: Footer };
});

jest.mock('@/components/Toast/Toast', () => ({
  ToastContainer: () => <div data-testid="toast-container">ToastContainer</div>,
}));

describe('ClientProviderWrapper', () => {
  it('renders children and providers correctly', () => {
    render(
      <ClientProviderWrapper>
        <div data-testid="child">Hello</div>
      </ClientProviderWrapper>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });
});
