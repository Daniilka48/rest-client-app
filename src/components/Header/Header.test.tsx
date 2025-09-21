import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import Header from './Header';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../LanguageSwitcher/LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return <div data-testid="language-switcher">Language Switcher</div>;
  };
});

jest.mock('react-icons/ri', () => ({
  RiLogoutCircleRLine: () => <div data-testid="logout-icon">Logout Icon</div>,
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockUseTranslation = useTranslation as jest.MockedFunction<
  typeof useTranslation
>;

describe('Header', () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'navigation.mainPage': 'Main Page',
      'navigation.restClient': 'REST Client',
      'navigation.variables': 'Variables',
      'navigation.history': 'History',
      'navigation.logout': 'Logout',
      'navigation.signIn': 'Sign In',
      'navigation.signUp': 'Sign Up',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (mockUseTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      ready: true,
      i18n: {
        t: mockT,
        init: jest.fn(),
        loadResources: jest.fn(),
        use: jest.fn(),
        changeLanguage: jest.fn(),
        language: 'en',
        languages: ['en', 'ru'],
      },
    });

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });

    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  describe('Loading States', () => {
    it('should render loading state when session is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      });

      render(<Header />);

      expect(screen.getByText('REST Client')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    });

    it('should render loading state when translation is not ready', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });

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

      render(<Header />);

      expect(screen.getByText('REST Client')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated User', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });
    });

    it('should render sign in and sign up links for unauthenticated users', async () => {
      render(<Header />);

      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
      });

      expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
      expect(screen.queryByText('Main Page')).not.toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'REST Client' })
      ).toBeInTheDocument();
    });

    it('should have correct href attributes for auth links', async () => {
      render(<Header />);

      await waitFor(() => {
        const signInLink = screen.getByRole('link', { name: 'Sign In' });
        const signUpLink = screen.getByRole('link', { name: 'Sign Up' });

        expect(signInLink).toHaveAttribute('href', '/auth/login');
        expect(signUpLink).toHaveAttribute('href', '/signup');
      });
    });
  });

  describe('Authenticated User', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
          expires: '2024-01-01',
        },
        status: 'authenticated',
        update: jest.fn(),
      });
    });

    it('should render navigation links for authenticated users', async () => {
      render(<Header />);

      await waitFor(() => {
        expect(screen.getByText('Main Page')).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: 'Variables' })
        ).toBeInTheDocument();
        expect(screen.getByText('Variables')).toBeInTheDocument();
        expect(screen.getByText('History')).toBeInTheDocument();
      });

      expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    });

    it('should have correct href attributes for navigation links', async () => {
      render(<Header />);

      await waitFor(() => {
        const mainPageLink = screen.getByRole('link', { name: 'Main Page' });
        const variablesLink = screen.getByRole('link', { name: 'Variables' });
        const historyLink = screen.getByRole('link', { name: 'History' });

        const restClientLinks = screen
          .getAllByRole('link')
          .filter((link) => link.getAttribute('href') === '/rest-client');

        expect(mainPageLink).toHaveAttribute('href', '/');
        expect(restClientLinks[0]).toHaveAttribute('href', '/rest-client');
        expect(variablesLink).toHaveAttribute('href', '/variables');
        expect(historyLink).toHaveAttribute('href', '/history');
      });
    });

    it('should render logout button for authenticated users', async () => {
      render(<Header />);

      await waitFor(() => {
        const logoutButton = screen.getByRole('button');
        expect(logoutButton).toBeInTheDocument();
        expect(logoutButton).toHaveAttribute('title', 'Logout');
        expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
      });
    });

    it('should call signOut when logout button is clicked', async () => {
      render(<Header />);

      await waitFor(() => {
        const logoutButton = screen.getByRole('button');
        fireEvent.click(logoutButton);
      });

      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
  });

  describe('Logo', () => {
    it('should render logo with correct link', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });

      render(<Header />);

      await waitFor(() => {
        const logoLink = screen.getByRole('link', { name: 'REST Client' });
        expect(logoLink).toHaveAttribute('href', '/');
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
          'REST Client'
        );
      });
    });
  });

  describe('Scroll Behavior', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });
    });

    it('should set up scroll event listener on mount', () => {
      render(<Header />);

      expect(window.addEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });

    it('should clean up scroll event listener on unmount', () => {
      const { unmount } = render(<Header />);

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });
  });

  describe('Component Mounting', () => {
    it('should handle component mounting state correctly', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });

      render(<Header />);

      await waitFor(() => {
        expect(screen.getByText('REST Client')).toBeInTheDocument();
      });
    });
  });
});
