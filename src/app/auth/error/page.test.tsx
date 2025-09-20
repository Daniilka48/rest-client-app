import { render, screen } from '@testing-library/react';
import Error from './page';

describe('Error page', () => {
  it('renders a link to login page', () => {
    render(<Error />);
    const button = screen.getByText('Go back to Login');
    expect(button.closest('a')).toHaveAttribute('href', '/login');
  });
});
