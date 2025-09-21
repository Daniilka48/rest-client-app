import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import HistorySection from './HistorySection';
import { supabase } from '@/lib/supabaseClient';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseTranslation = useTranslation as jest.MockedFunction<
  typeof useTranslation
>;
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('HistorySection', () => {
  const mockT = jest.fn((key: string, options?: { count?: number }) => {
    const translations: Record<string, string> = {
      'history.emptyState.title': 'No requests yet',
      'history.emptyState.message': 'Your request history will appear here',
      'history.emptyState.subtitle':
        'Make your first API request to get started',
      'history.emptyState.linkText': 'Go to REST Client',
      'history.title': 'Request History',
      'history.requestsCount': `${options?.count || 0} requests`,
      'history.labels.endpoint': 'Endpoint:',
      'history.labels.latency': 'Latency:',
      'history.labels.request': 'Request:',
      'history.labels.response': 'Response:',
      'history.labels.error': 'Error:',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSession.mockReturnValue({
      data: { user: { id: 'user-123' }, expires: '2099-12-31T23:59:59.999Z' },
      status: 'authenticated',
      update: jest.fn(),
    });

    mockUseTranslation.mockReturnValue({
      t: mockT,
      i18n: {
        changeLanguage: jest.fn(),
        language: 'en',
      },
    } as never);
  });

  describe('Empty State', () => {
    beforeEach(() => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      } as never);
    });

    it('should render empty state when no history items', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        expect(screen.getByText('No requests yet')).toBeInTheDocument();
        expect(
          screen.getByText('Your request history will appear here')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Make your first API request to get started')
        ).toBeInTheDocument();
        expect(screen.getByText('Go to REST Client')).toBeInTheDocument();
      });
    });

    it('should have correct link to REST client', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Go to REST Client' });
        expect(link).toHaveAttribute('href', '/rest-client');
      });
    });

    it('should render empty icon', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        expect(screen.getByText('📝')).toBeInTheDocument();
      });
    });
  });

  describe('History List', () => {
    const mockHistoryData = [
      {
        id: 1,
        method: 'GET',
        url: 'https://api.example.com/users',
        status_code: 200,
        latency_ms: 250,
        created_at: '2023-01-01T12:00:00Z',
        request_size: 0,
        response_size: 1024,
        error: null,
      },
      {
        id: 2,
        method: 'POST',
        url: 'https://api.example.com/users',
        status_code: 404,
        latency_ms: 150,
        created_at: '2023-01-02T12:00:00Z',
        request_size: 512,
        response_size: 256,
        error: 'Not found',
      },
      {
        id: 3,
        method: 'PUT',
        url: 'https://api.example.com/users/123',
        status_code: 500,
        latency_ms: 2000,
        created_at: '2023-01-03T12:00:00Z',
        request_size: null,
        response_size: null,
        error: 'Internal server error',
      },
    ];

    beforeEach(() => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockHistoryData,
              error: null,
            }),
          }),
        }),
      } as never);
    });

    it('should render history title and count', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        expect(screen.getByText('Request History')).toBeInTheDocument();
        expect(screen.getByText('3 requests')).toBeInTheDocument();
      });
    });

    it('should render all history items', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        expect(screen.getByText('GET')).toBeInTheDocument();
        expect(screen.getByText('POST')).toBeInTheDocument();
        expect(screen.getByText('PUT')).toBeInTheDocument();
        expect(
          screen.getAllByText('https://api.example.com/users')
        ).toHaveLength(2);
        expect(
          screen.getByText('https://api.example.com/users/123')
        ).toBeInTheDocument();
      });
    });

    it('should render status codes with correct data attributes', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        const successStatus = screen.getByText('200');
        const clientErrorStatus = screen.getByText('404');
        const serverErrorStatus = screen.getByText('500');

        expect(successStatus).toHaveAttribute('data-status', 'success');
        expect(clientErrorStatus).toHaveAttribute(
          'data-status',
          'client-error'
        );
        expect(serverErrorStatus).toHaveAttribute(
          'data-status',
          'server-error'
        );
      });
    });

    it('should render method badges with correct data attributes', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        const getMethod = screen.getByText('GET');
        const postMethod = screen.getByText('POST');
        const putMethod = screen.getByText('PUT');

        expect(getMethod).toHaveAttribute('data-method', 'get');
        expect(postMethod).toHaveAttribute('data-method', 'post');
        expect(putMethod).toHaveAttribute('data-method', 'put');
      });
    });

    it('should render latency information', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        expect(screen.getByText('250 ms')).toBeInTheDocument();
        expect(screen.getByText('150 ms')).toBeInTheDocument();
        expect(screen.getByText('2000 ms')).toBeInTheDocument();
      });
    });

    it('should render request and response sizes', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        expect(screen.getAllByText('0 bytes')).toHaveLength(3);
        expect(screen.getByText('1024 bytes')).toBeInTheDocument();
        expect(screen.getByText('512 bytes')).toBeInTheDocument();
        expect(screen.getByText('256 bytes')).toBeInTheDocument();
      });
    });

    it('should handle null request and response sizes', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        const zeroBytes = screen.getAllByText('0 bytes');
        expect(zeroBytes.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should render error messages when present', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        expect(screen.getByText('Not found')).toBeInTheDocument();
        expect(screen.getByText('Internal server error')).toBeInTheDocument();
      });
    });

    it('should render timestamps', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        expect(screen.getAllByText(/2023/)).toHaveLength(3);
      });
    });

    it('should have correct links to history details', async () => {
      render(<HistorySection />);

      await waitFor(() => {
        const links = screen.getAllByRole('link');
        const historyLinks = links.filter((link) =>
          link.getAttribute('href')?.includes('/rest-client/history/')
        );

        expect(historyLinks).toHaveLength(3);
        expect(historyLinks[0]).toHaveAttribute(
          'href',
          '/rest-client/history/1'
        );
        expect(historyLinks[1]).toHaveAttribute(
          'href',
          '/rest-client/history/2'
        );
        expect(historyLinks[2]).toHaveAttribute(
          'href',
          '/rest-client/history/3'
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle supabase errors gracefully', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Database error'),
            }),
          }),
        }),
      } as never);

      render(<HistorySection />);

      await waitFor(() => {
        expect(screen.getByText('No requests yet')).toBeInTheDocument();
      });
    });
  });

  describe('Status Code Classification', () => {
    const statusTestCases = [
      { code: 200, expected: 'success' },
      { code: 201, expected: 'success' },
      { code: 299, expected: 'success' },
      { code: 300, expected: 'redirect' },
      { code: 301, expected: 'redirect' },
      { code: 399, expected: 'redirect' },
      { code: 400, expected: 'client-error' },
      { code: 404, expected: 'client-error' },
      { code: 499, expected: 'client-error' },
      { code: 500, expected: 'server-error' },
      { code: 503, expected: 'server-error' },
      { code: 999, expected: 'server-error' },
      { code: 100, expected: 'unknown' },
    ];

    statusTestCases.forEach(({ code, expected }) => {
      it(`should classify status code ${code} as ${expected}`, async () => {
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 1,
                    method: 'GET',
                    url: 'https://api.example.com/test',
                    status_code: code,
                    latency_ms: 100,
                    created_at: '2023-01-01T12:00:00Z',
                    request_size: 0,
                    response_size: 0,
                    error: null,
                  },
                ],
                error: null,
              }),
            }),
          }),
        } as never);

        render(<HistorySection />);

        await waitFor(() => {
          const statusElement = screen.getByText(code.toString());
          expect(statusElement).toHaveAttribute('data-status', expected);
        });
      });
    });
  });

  describe('User Session Handling', () => {
    it('should fetch history for authenticated user', async () => {
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as never);

      render(<HistorySection />);

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('rest');
        expect(mockSelect).toHaveBeenCalledWith(
          'id, method, url, status_code, latency_ms, created_at, request_size, response_size, error'
        );
      });
    });

    it('should handle missing user session', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });

      const mockEq = jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: mockEq,
        }),
      } as never);

      render(<HistorySection />);

      await waitFor(() => {
        expect(mockEq).toHaveBeenCalledWith('user_id', undefined);
      });
    });
  });
});
