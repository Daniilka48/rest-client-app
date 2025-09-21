import React from 'react';
import { render, screen } from '@testing-library/react';
import VariablesPage from './page';

jest.mock('./VariablesClient', () => ({
  __esModule: true,
  default: () => <div data-testid="variables-client">VariablesClient</div>,
}));

describe('VariablesPage', () => {
  it('renders the dynamic VariablesClient component', async () => {
    render(<VariablesPage />);

    const clientComponent = await screen.findByTestId('variables-client');

    expect(clientComponent).toBeInTheDocument();
    expect(clientComponent).toHaveTextContent('VariablesClient');
  });
});
