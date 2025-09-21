import React from 'react';
import { render, screen } from '@testing-library/react';
import RestClientDynamicPage from './page';

jest.mock('../ClientWrapper', () => {
  const Mock = ({ routeParams }: { routeParams: string[] }) => (
    <div>ClientWrapper Mock: {routeParams.join(',')}</div>
  );
  Mock.displayName = 'ClientWrapper';
  return Mock;
});

describe('RestClientDynamicPage', () => {
  it('renders ClientWrapper with empty array if no params provided', () => {
    render(<RestClientDynamicPage params={{}} />);
    expect(screen.getByText('ClientWrapper Mock:')).toBeInTheDocument();
  });

  it('renders ClientWrapper with provided params', () => {
    const paramsArray = ['GET', 'aHR0cHM6Ly9leGFtcGxlLmNvbS9wb3N0czEv'];
    render(<RestClientDynamicPage params={{ params: paramsArray }} />);
    expect(
      screen.getByText(
        'ClientWrapper Mock: GET,aHR0cHM6Ly9leGFtcGxlLmNvbS9wb3N0czEv'
      )
    ).toBeInTheDocument();
  });
});
