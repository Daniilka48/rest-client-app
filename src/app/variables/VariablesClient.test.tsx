import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VariablesPage from './VariablesClient';
import { useVariables } from '../../hooks/useVariables';

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

jest.mock('../../hooks/useVariables');

const mockUseVariables = useVariables as jest.MockedFunction<
  typeof useVariables
>;

describe('VariablesPage', () => {
  const defaultMockReturn = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseVariables.mockReturnValue(defaultMockReturn);
    global.confirm = jest.fn(() => true);
  });

  describe('Loading State', () => {
    it('renders loading state when not loaded', () => {
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        isLoaded: false,
      });

      render(<VariablesPage />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Environment Management', () => {
    it('renders environment selector with global option', () => {
      render(<VariablesPage />);

      expect(screen.getByText('Environment:')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Global Variables Only')
      ).toBeInTheDocument();
    });

    it('renders environment options in selector', () => {
      const environments = [
        { id: 'env1', name: 'Development', variables: [] },
        { id: 'env2', name: 'Production', variables: [] },
      ];

      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments,
      });

      render(<VariablesPage />);

      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('Production')).toBeInTheDocument();
    });

    it('calls setActiveEnvironment when selecting environment', () => {
      const setActiveEnvironment = jest.fn();
      const environments = [{ id: 'env1', name: 'Development', variables: [] }];

      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments,
        setActiveEnvironment,
      });

      render(<VariablesPage />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'env1' } });

      expect(setActiveEnvironment).toHaveBeenCalledWith('env1');
    });

    it('creates environment on button click with valid name', () => {
      const createEnvironment = jest.fn();
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        createEnvironment,
      });

      render(<VariablesPage />);

      const input = screen.getByPlaceholderText('Environment name:Testing');
      fireEvent.change(input, { target: { value: 'TestEnv' } });

      const button = screen.getByText('Create Environment');
      fireEvent.click(button);

      expect(createEnvironment).toHaveBeenCalledWith('TestEnv');
    });

    it('creates environment on Enter key press', () => {
      const createEnvironment = jest.fn();
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        createEnvironment,
      });

      render(<VariablesPage />);

      const input = screen.getByPlaceholderText('Environment name:Testing');
      fireEvent.change(input, { target: { value: 'TestEnv' } });
      fireEvent.keyPress(input, {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });

      expect(createEnvironment).toHaveBeenCalledWith('TestEnv');
    });

    it('trims environment name before creating', () => {
      const createEnvironment = jest.fn();
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        createEnvironment,
      });

      render(<VariablesPage />);

      const input = screen.getByPlaceholderText('Environment name:Testing');
      fireEvent.change(input, { target: { value: '  TestEnv  ' } });

      const button = screen.getByText('Create Environment');
      fireEvent.click(button);

      expect(createEnvironment).toHaveBeenCalledWith('TestEnv');
    });

    it('disables create button when name is empty', () => {
      render(<VariablesPage />);

      const button = screen.getByText('Create Environment');
      expect(button).toBeDisabled();
    });

    it('clears input after creating environment', async () => {
      const createEnvironment = jest.fn();
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        createEnvironment,
      });

      render(<VariablesPage />);

      const input = screen.getByPlaceholderText(
        'Environment name:Testing'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'TestEnv' } });

      const button = screen.getByText('Create Environment');
      fireEvent.click(button);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('Global Variables', () => {
    it('renders empty state for global variables', () => {
      render(<VariablesPage />);

      expect(screen.getByText(/No global variables/)).toBeInTheDocument();
    });

    it('renders global variables when they exist', () => {
      const globalVariables = [
        { key: 'BASE_URL', value: 'https://api.example.com', enabled: true },
        { key: 'API_KEY', value: 'secret123', enabled: false },
      ];

      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        globalVariables,
      });

      render(<VariablesPage />);

      expect(screen.getByDisplayValue('BASE_URL')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('https://api.example.com')
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('API_KEY')).toBeInTheDocument();
      expect(screen.getByDisplayValue('secret123')).toBeInTheDocument();
    });

    it('calls addGlobalVariable when clicking add button', () => {
      const addGlobalVariable = jest.fn();
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        addGlobalVariable,
      });

      render(<VariablesPage />);

      const addButtons = screen.getAllByText('+ Add Variable');
      fireEvent.click(addButtons[0]);

      expect(addGlobalVariable).toHaveBeenCalled();
    });

    it('updates global variable key', () => {
      const updateGlobalVariable = jest.fn();
      const globalVariables = [
        { key: 'BASE_URL', value: 'https://api.example.com', enabled: true },
      ];

      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        globalVariables,
        updateGlobalVariable,
      });

      render(<VariablesPage />);

      const keyInput = screen.getByDisplayValue('BASE_URL');
      fireEvent.change(keyInput, { target: { value: 'NEW_URL' } });

      expect(updateGlobalVariable).toHaveBeenCalledWith(0, 'key', 'NEW_URL');
    });

    it('updates global variable value', () => {
      const updateGlobalVariable = jest.fn();
      const globalVariables = [
        { key: 'BASE_URL', value: 'https://api.example.com', enabled: true },
      ];

      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        globalVariables,
        updateGlobalVariable,
      });

      render(<VariablesPage />);

      const valueInput = screen.getByDisplayValue('https://api.example.com');
      fireEvent.change(valueInput, {
        target: { value: 'https://new-api.com' },
      });

      expect(updateGlobalVariable).toHaveBeenCalledWith(
        0,
        'value',
        'https://new-api.com'
      );
    });

    it('toggles global variable enabled state', () => {
      const updateGlobalVariable = jest.fn();
      const globalVariables = [
        { key: 'BASE_URL', value: 'https://api.example.com', enabled: true },
      ];

      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        globalVariables,
        updateGlobalVariable,
      });

      render(<VariablesPage />);

      const checkboxes = screen.getAllByRole('checkbox');
      const checkbox = checkboxes[0]; // First checkbox (for first global variable)
      fireEvent.click(checkbox);

      expect(updateGlobalVariable).toHaveBeenCalledWith(0, 'enabled', false);
    });

    it('removes global variable when clicking delete', () => {
      const removeGlobalVariable = jest.fn();
      const globalVariables = [
        { key: 'BASE_URL', value: 'https://api.example.com', enabled: true },
      ];

      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        globalVariables,
        removeGlobalVariable,
      });

      render(<VariablesPage />);

      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      expect(removeGlobalVariable).toHaveBeenCalledWith(0);
    });
  });

  describe('Environment Variables', () => {
    const activeEnvironment = {
      id: 'env1',
      name: 'Development',
      variables: [{ key: 'USER_ID', value: '123', enabled: true }],
    };

    it('renders environment variables section when active environment exists', () => {
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments: [activeEnvironment],
        activeEnvironmentId: 'env1',
      });

      render(<VariablesPage />);

      expect(screen.getByText('Development Variables')).toBeInTheDocument();
      expect(screen.getByDisplayValue('USER_ID')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    });

    it('renders empty state for environment variables', () => {
      const emptyEnvironment = {
        id: 'env1',
        name: 'Development',
        variables: [],
      };

      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments: [emptyEnvironment],
        activeEnvironmentId: 'env1',
      });

      render(<VariablesPage />);

      expect(screen.getByText(/No environment variables/)).toBeInTheDocument();
    });

    it('enters edit mode when clicking edit name button', () => {
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments: [activeEnvironment],
        activeEnvironmentId: 'env1',
      });

      render(<VariablesPage />);

      const editButton = screen.getByText('Edit Name');
      fireEvent.click(editButton);

      expect(screen.getAllByDisplayValue('Development')).toHaveLength(2);
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('saves environment name on Enter key press in edit mode', () => {
      const updateEnvironment = jest.fn();
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments: [activeEnvironment],
        activeEnvironmentId: 'env1',
        updateEnvironment,
      });

      render(<VariablesPage />);

      const editButton = screen.getByText('Edit Name');
      fireEvent.click(editButton);

      const nameInputs = screen.getAllByDisplayValue('Development');
      const editInput = nameInputs.find(
        (input) =>
          input.tagName === 'INPUT' && input.className.includes('envNameInput')
      );
      fireEvent.change(editInput!, { target: { value: 'New Name' } });
      fireEvent.keyPress(editInput!, {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });

      expect(updateEnvironment).toHaveBeenCalledWith(
        'env1',
        'New Name',
        activeEnvironment.variables
      );
    });

    it('cancels edit mode when clicking cancel', () => {
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments: [activeEnvironment],
        activeEnvironmentId: 'env1',
      });

      render(<VariablesPage />);

      const editButton = screen.getByText('Edit Name');
      fireEvent.click(editButton);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.getByText('Development Variables')).toBeInTheDocument();
    });

    it('deletes environment when clicking delete and confirming', () => {
      const deleteEnvironment = jest.fn();
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments: [activeEnvironment],
        activeEnvironmentId: 'env1',
        deleteEnvironment,
      });

      render(<VariablesPage />);

      const deleteButton = screen.getByText('Delete Env');
      fireEvent.click(deleteButton);

      expect(deleteEnvironment).toHaveBeenCalledWith('env1');
    });

    it('does not delete environment when canceling confirmation', () => {
      global.confirm = jest.fn(() => false);
      const deleteEnvironment = jest.fn();

      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments: [activeEnvironment],
        activeEnvironmentId: 'env1',
        deleteEnvironment,
      });

      render(<VariablesPage />);

      const deleteButton = screen.getByText('Delete Env');
      fireEvent.click(deleteButton);

      expect(deleteEnvironment).not.toHaveBeenCalled();
    });

    it('updates environment variable properties', () => {
      const updateEnvironmentVariable = jest.fn();
      mockUseVariables.mockReturnValue({
        ...defaultMockReturn,
        environments: [activeEnvironment],
        activeEnvironmentId: 'env1',
        updateEnvironmentVariable,
      });

      render(<VariablesPage />);

      const keyInput = screen.getByDisplayValue('USER_ID');
      fireEvent.change(keyInput, { target: { value: 'NEW_USER_ID' } });

      expect(updateEnvironmentVariable).toHaveBeenCalledWith(
        'env1',
        0,
        'key',
        'NEW_USER_ID'
      );
    });
  });

  describe('Navigation and Usage Guide', () => {
    it('renders link to REST client', () => {
      render(<VariablesPage />);

      const link = screen.getByRole('link', { name: 'Go to REST client page' });
      expect(link).toHaveAttribute('href', '/rest-client');
    });

    it('renders usage guide with examples', () => {
      render(<VariablesPage />);

      expect(screen.getByText('How to use variables:')).toBeInTheDocument();
      expect(
        screen.getByText(/Step 1: Set up your variables/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Step 2: Go to REST Client/)).toBeInTheDocument();
      expect(
        screen.getByText(/Step 3: Use variables in your requests/)
      ).toBeInTheDocument();

      expect(
        screen.getAllByText('{{BASE_URL}}/posts/{{POST_ID}}')
      ).toHaveLength(2);
      expect(
        screen.getByText('Authorization: Bearer {{TOKEN}}')
      ).toBeInTheDocument();
    });

    it('renders quick test example', () => {
      render(<VariablesPage />);

      expect(screen.getByText('Quick Test Example:')).toBeInTheDocument();
      expect(
        screen.getByText(/BASE_URL = https:\/\/jsonplaceholder.typicode.com/)
      ).toBeInTheDocument();
    });
  });
});
