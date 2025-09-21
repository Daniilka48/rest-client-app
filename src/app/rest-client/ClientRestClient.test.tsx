import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientRestClient from './ClientRestClient';
import { useSession } from 'next-auth/react';
import { useVariables } from '../../hooks/useVariables';
import { generateCodeSnippets } from '@/lib/codegen';

jest.mock('next-auth/react');
jest.mock('../../hooks/useVariables');
jest.mock('@/lib/codegen', () => ({
  generateCodeSnippets: jest.fn(),
}));

const replaceStateMock = jest.fn();
Object.defineProperty(window, 'history', {
  value: { replaceState: replaceStateMock },
});

global.fetch = jest.fn();

describe('ClientRestClient', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: '123' } },
    });
    (useVariables as jest.Mock).mockReturnValue({
      resolveVariables: (v: string) => v,
    });
    (generateCodeSnippets as jest.Mock).mockResolvedValue({
      'curl-bash': 'curl ...',
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      text: jest.fn().mockResolvedValue('OK'),
    });
    replaceStateMock.mockClear();
  });

  it('renders initial UI', () => {
    render(<ClientRestClient />);
    expect(screen.getByText('REST Client')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByText('+ Add Header')).toBeInTheDocument();
  });

  it('pre-fills state from initialData', () => {
    render(
      <ClientRestClient
        initialData={{
          method: 'POST',
          url: 'https://api.example.com',
          body: '{"a":1}',
          headers: [{ key: 'x-test', value: '123' }],
        }}
      />
    );
    expect(screen.getByDisplayValue('POST')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('https://api.example.com')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('{"a":1}')).toBeInTheDocument();
    expect(screen.getByDisplayValue('x-test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
  });

  it('adds and removes headers', () => {
    render(<ClientRestClient />);
    fireEvent.click(screen.getByText('+ Add Header'));
    expect(screen.getByPlaceholderText('Key')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Remove'));
    expect(screen.queryByPlaceholderText('Key')).not.toBeInTheDocument();
  });

  it('prettifies JSON body', () => {
    render(<ClientRestClient />);
    const textarea = screen.getByPlaceholderText(/Enter request body/);
    fireEvent.change(textarea, { target: { value: '{"a":1}' } });
    fireEvent.click(screen.getByText('Prettify JSON'));
    expect(textarea).toHaveValue('{\n  "a": 1\n}');
  });

  it('sends request and updates response', async () => {
    render(<ClientRestClient />);
    const urlInput = screen.getByPlaceholderText(/https:\/\/api.example.com/);
    fireEvent.change(urlInput, { target: { value: 'https://api.test' } });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/proxy',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-user-id': '123',
          }),
        })
      );
    });

    expect(await screen.findByText('Status: 200')).toBeInTheDocument();
    expect(await screen.findByText('OK')).toBeInTheDocument();
  });

  it('shows error if fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );
    render(<ClientRestClient />);
    fireEvent.click(screen.getByText('Send'));
    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });

  it('renders generated code snippets after request', async () => {
    render(<ClientRestClient />);
    fireEvent.change(screen.getByPlaceholderText(/https:\/\/api.example.com/), {
      target: { value: 'https://api.test' },
    });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(generateCodeSnippets).toHaveBeenCalled();
    });

    expect(await screen.findByText('curl-bash')).toBeInTheDocument();
    expect(await screen.findByText('curl ...')).toBeInTheDocument();
  });
});
