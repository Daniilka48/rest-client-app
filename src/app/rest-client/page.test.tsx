import { render, screen } from '@testing-library/react';
import RestClientPage from './page';

jest.mock('./ClientWrapper', () => {
  const Mocked = () => <div>Mocked ClientWrapper</div>;
  Mocked.displayName = 'MockedClientWrapper';
  return Mocked;
});

describe('RestClientPage', () => {
  it('renders ClientWrapper with empty routeParams', () => {
    render(<RestClientPage />);
    expect(screen.getByText('Mocked ClientWrapper')).toBeInTheDocument();
  });
});
