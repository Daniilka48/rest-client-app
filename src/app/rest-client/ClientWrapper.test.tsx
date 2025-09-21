import { render, screen } from '@testing-library/react';
import ClientWrapper from './ClientWrapper';

jest.mock('next/dynamic', () => {
  return () => {
    const MockedRestClientClient = () => <div>Mocked RestClientClient</div>;
    MockedRestClientClient.displayName = 'MockedRestClientClient';
    return MockedRestClientClient;
  };
});

describe('ClientWrapper', () => {
  it('renders RestClientClient with routeParams', () => {
    render(<ClientWrapper routeParams={['GET', 'abc']} />);
    expect(screen.getByText('Mocked RestClientClient')).toBeInTheDocument();
  });

  it('passes empty array if no routeParams provided', () => {
    render(<ClientWrapper />);
    expect(screen.getByText('Mocked RestClientClient')).toBeInTheDocument();
  });
});
