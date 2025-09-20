import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VariablesPage from './VariablesClient';
import { useVariables } from '../../hooks/useVariables';

jest.mock('../../hooks/useVariables');

const mockUseVariables = useVariables as jest.MockedFunction<
  typeof useVariables
>;

describe('VariablesPage', () => {
  beforeEach(() => {
    mockUseVariables.mockReturnValue({
      globalVariables: [],
      environments: [],
      activeEnvironmentId: null,
      isLoaded: true,
      addGlobalVariable: jest.fn(),
      updateGlobalVariable: jest.fn(),
      removeGlobalVariable: jest.fn(),
      createEnvironment: jest.fn(),
      updateEnvironment: jest.fn(),
      deleteEnvironment: jest.fn(),
      setActiveEnvironment: jest.fn(),
      addEnvironmentVariable: jest.fn(),
      updateEnvironmentVariable: jest.fn(),
      removeEnvironmentVariable: jest.fn(),
      getCurrentEnvironmentVariables: jest.fn(),
      resolveVariables: jest.fn(),
    });
  });

  it('renders loading state', () => {
    mockUseVariables.mockReturnValueOnce({
      ...mockUseVariables(),
      isLoaded: false,
    });

    render(<VariablesPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders global variables section', () => {
    render(<VariablesPage />);
    const sectionTitle = screen.getByText('Global Variables', {
      selector: 'div',
    });
    expect(sectionTitle).toBeInTheDocument();

    expect(screen.getByText(/no global variables/i)).toBeInTheDocument();
  });

  it('calls addGlobalVariable on button click', () => {
    const addGlobalVariable = jest.fn();
    mockUseVariables.mockReturnValueOnce({
      ...mockUseVariables(),
      addGlobalVariable,
    });

    render(<VariablesPage />);
    fireEvent.click(screen.getByText('+ Add Variable'));
    expect(addGlobalVariable).toHaveBeenCalled();
  });

  it('creates a new environment on button click', () => {
    const createEnvironment = jest.fn();
    mockUseVariables.mockReturnValue({
      ...mockUseVariables(),
      createEnvironment,
    });

    render(<VariablesPage />);

    const input = screen.getByPlaceholderText('Environment name:Testing');
    fireEvent.change(input, { target: { value: 'TestEnv' } });

    const button = screen.getByText(/Create Environment/i);
    expect(button).not.toBeDisabled(); // кнопка активна

    fireEvent.click(button);

    expect(createEnvironment).toHaveBeenCalledTimes(1);
    expect(createEnvironment).toHaveBeenCalledWith('TestEnv');
  });
});
