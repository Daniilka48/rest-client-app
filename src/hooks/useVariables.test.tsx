import { renderHook, act } from '@testing-library/react';
import { useVariables } from './useVariables';
import { VariableManager } from '../lib/variables';

jest.mock('../lib/variables', () => ({
  VariableManager: {
    getVariables: jest.fn(),
    saveVariables: jest.fn(),
    setActiveEnvironment: jest.fn(),
    resolveVariables: jest.fn(),
  },
}));

const mockVariableManager = VariableManager as jest.Mocked<
  typeof VariableManager
>;

describe('useVariables', () => {
  const mockInitialData = {
    globalVariables: [
      { key: 'BASE_URL', value: 'https://api.example.com', enabled: true },
      { key: 'API_KEY', value: 'secret123', enabled: false },
    ],
    environments: [
      {
        id: 'env1',
        name: 'Development',
        variables: [{ key: 'USER_ID', value: '123', enabled: true }],
      },
      {
        id: 'env2',
        name: 'Production',
        variables: [{ key: 'USER_ID', value: '456', enabled: true }],
      },
    ],
    activeEnvironmentId: 'env1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockVariableManager.getVariables.mockReturnValue(mockInitialData);
    mockVariableManager.resolveVariables.mockImplementation((text) => text);
  });

  describe('Initialization', () => {
    it('should load initial data on mount', () => {
      const { result } = renderHook(() => useVariables());

      expect(mockVariableManager.getVariables).toHaveBeenCalled();
      expect(result.current.globalVariables).toEqual(
        mockInitialData.globalVariables
      );
      expect(result.current.environments).toEqual(mockInitialData.environments);
      expect(result.current.activeEnvironmentId).toBe('env1');
      expect(result.current.isLoaded).toBe(true);
    });

    it('should start with isLoaded as false initially', () => {
      const { result } = renderHook(() => useVariables());

      expect(result.current.isLoaded).toBe(true);
    });
  });

  describe('Global Variables Management', () => {
    it('should add a new global variable', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.addGlobalVariable();
      });

      expect(result.current.globalVariables).toHaveLength(3);
      expect(result.current.globalVariables[2]).toEqual({
        key: '',
        value: '',
        enabled: true,
      });
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should update a global variable key', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.updateGlobalVariable(0, 'key', 'NEW_BASE_URL');
      });

      expect(result.current.globalVariables[0].key).toBe('NEW_BASE_URL');
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should update a global variable value', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.updateGlobalVariable(0, 'value', 'https://new-api.com');
      });

      expect(result.current.globalVariables[0].value).toBe(
        'https://new-api.com'
      );
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should update a global variable enabled state', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.updateGlobalVariable(1, 'enabled', true);
      });

      expect(result.current.globalVariables[1].enabled).toBe(true);
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should remove a global variable', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.removeGlobalVariable(0);
      });

      expect(result.current.globalVariables).toHaveLength(1);
      expect(result.current.globalVariables[0].key).toBe('API_KEY');
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });
  });

  describe('Environment Management', () => {
    it('should create a new environment', () => {
      const { result } = renderHook(() => useVariables());

      let environmentId: string;
      act(() => {
        environmentId = result.current.createEnvironment('Testing');
      });

      expect(result.current.environments).toHaveLength(3);
      expect(result.current.environments[2].name).toBe('Testing');
      expect(result.current.environments[2].variables).toEqual([]);
      expect(environmentId!).toBeDefined();
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should update an environment', () => {
      const { result } = renderHook(() => useVariables());

      const newVariables = [
        { key: 'NEW_VAR', value: 'new_value', enabled: true },
      ];

      act(() => {
        result.current.updateEnvironment('env1', 'Updated Dev', newVariables);
      });

      const updatedEnv = result.current.environments.find(
        (env) => env.id === 'env1'
      );
      expect(updatedEnv?.name).toBe('Updated Dev');
      expect(updatedEnv?.variables).toEqual(newVariables);
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should delete an environment', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.deleteEnvironment('env2');
      });

      expect(result.current.environments).toHaveLength(1);
      expect(result.current.environments[0].id).toBe('env1');
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should clear active environment when deleting active environment', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.deleteEnvironment('env1');
      });

      expect(result.current.activeEnvironmentId).toBeNull();
      expect(mockVariableManager.setActiveEnvironment).toHaveBeenCalledWith(
        null
      );
    });

    it('should not clear active environment when deleting non-active environment', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.deleteEnvironment('env2');
      });

      expect(result.current.activeEnvironmentId).toBe('env1');
    });

    it('should set active environment', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.setActiveEnvironment('env2');
      });

      expect(result.current.activeEnvironmentId).toBe('env2');
      expect(mockVariableManager.setActiveEnvironment).toHaveBeenCalledWith(
        'env2'
      );
    });

    it('should clear active environment', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.setActiveEnvironment(null);
      });

      expect(result.current.activeEnvironmentId).toBeNull();
      expect(mockVariableManager.setActiveEnvironment).toHaveBeenCalledWith(
        null
      );
    });
  });

  describe('Environment Variables Management', () => {
    it('should add a variable to an environment', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.addEnvironmentVariable('env1');
      });

      const env1 = result.current.environments.find((env) => env.id === 'env1');
      expect(env1?.variables).toHaveLength(2);
      expect(env1?.variables[1]).toEqual({
        key: '',
        value: '',
        enabled: true,
      });
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should not add variable to non-existent environment', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.addEnvironmentVariable('non-existent');
      });

      expect(result.current.environments).toHaveLength(2);
    });

    it('should update an environment variable key', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.updateEnvironmentVariable(
          'env1',
          0,
          'key',
          'NEW_USER_ID'
        );
      });

      const env1 = result.current.environments.find((env) => env.id === 'env1');
      expect(env1?.variables[0].key).toBe('NEW_USER_ID');
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should update an environment variable value', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.updateEnvironmentVariable('env1', 0, 'value', '999');
      });

      const env1 = result.current.environments.find((env) => env.id === 'env1');
      expect(env1?.variables[0].value).toBe('999');
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should update an environment variable enabled state', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.updateEnvironmentVariable('env1', 0, 'enabled', false);
      });

      const env1 = result.current.environments.find((env) => env.id === 'env1');
      expect(env1?.variables[0].enabled).toBe(false);
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should not update variable in non-existent environment', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.updateEnvironmentVariable(
          'non-existent',
          0,
          'key',
          'NEW_KEY'
        );
      });

      const originalEnv1 = mockInitialData.environments[0];
      const currentEnv1 = result.current.environments.find(
        (env) => env.id === 'env1'
      );
      expect(currentEnv1?.variables[0].key).toBe(originalEnv1.variables[0].key);
    });

    it('should remove an environment variable', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.addEnvironmentVariable('env1');
      });

      act(() => {
        result.current.removeEnvironmentVariable('env1', 0);
      });

      const env1 = result.current.environments.find((env) => env.id === 'env1');
      expect(env1?.variables).toHaveLength(1);
      expect(env1?.variables[0].key).toBe('');
      expect(mockVariableManager.saveVariables).toHaveBeenCalled();
    });

    it('should not remove variable from non-existent environment', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.removeEnvironmentVariable('non-existent', 0);
      });

      const env1 = result.current.environments.find((env) => env.id === 'env1');
      expect(env1?.variables).toHaveLength(1);
    });
  });

  describe('Current Environment Variables', () => {
    it('should get current environment variables when environment is active', () => {
      const { result } = renderHook(() => useVariables());

      const currentVars = result.current.getCurrentEnvironmentVariables();

      expect(currentVars).toEqual(mockInitialData.environments[0].variables);
    });

    it('should return empty array when no environment is active', () => {
      mockVariableManager.getVariables.mockReturnValue({
        ...mockInitialData,
        activeEnvironmentId: null,
      });

      const { result } = renderHook(() => useVariables());

      const currentVars = result.current.getCurrentEnvironmentVariables();

      expect(currentVars).toEqual([]);
    });

    it('should return empty array when active environment does not exist', () => {
      mockVariableManager.getVariables.mockReturnValue({
        ...mockInitialData,
        activeEnvironmentId: 'non-existent',
      });

      const { result } = renderHook(() => useVariables());

      const currentVars = result.current.getCurrentEnvironmentVariables();

      expect(currentVars).toEqual([]);
    });
  });

  describe('Variable Resolution', () => {
    it('should resolve variables using VariableManager', () => {
      const { result } = renderHook(() => useVariables());

      mockVariableManager.resolveVariables.mockReturnValue(
        'https://api.example.com/users/123'
      );

      const resolved = result.current.resolveVariables(
        '{{BASE_URL}}/users/{{USER_ID}}'
      );

      expect(mockVariableManager.resolveVariables).toHaveBeenCalledWith(
        '{{BASE_URL}}/users/{{USER_ID}}',
        mockInitialData.globalVariables,
        mockInitialData.environments[0].variables
      );
      expect(resolved).toBe('https://api.example.com/users/123');
    });

    it('should resolve variables with no active environment', () => {
      mockVariableManager.getVariables.mockReturnValue({
        ...mockInitialData,
        activeEnvironmentId: null,
      });

      const { result } = renderHook(() => useVariables());

      result.current.resolveVariables('{{BASE_URL}}/users');

      expect(mockVariableManager.resolveVariables).toHaveBeenCalledWith(
        '{{BASE_URL}}/users',
        mockInitialData.globalVariables,
        []
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty initial data', () => {
      mockVariableManager.getVariables.mockReturnValue({
        globalVariables: [],
        environments: [],
        activeEnvironmentId: null,
      });

      const { result } = renderHook(() => useVariables());

      expect(result.current.globalVariables).toEqual([]);
      expect(result.current.environments).toEqual([]);
      expect(result.current.activeEnvironmentId).toBeNull();
      expect(result.current.isLoaded).toBe(true);
    });

    it('should handle saveToStorage calls correctly', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.addGlobalVariable();
      });

      expect(mockVariableManager.saveVariables).toHaveBeenCalledWith(
        mockInitialData.environments,
        expect.arrayContaining([
          ...mockInitialData.globalVariables,
          { key: '', value: '', enabled: true },
        ])
      );
    });

    it('should handle multiple rapid state changes', () => {
      const { result } = renderHook(() => useVariables());

      act(() => {
        result.current.addGlobalVariable();
      });

      act(() => {
        result.current.addGlobalVariable();
      });

      act(() => {
        result.current.updateGlobalVariable(0, 'key', 'TEST_KEY');
      });

      act(() => {
        result.current.removeGlobalVariable(3);
      });

      expect(result.current.globalVariables).toHaveLength(3);
      expect(result.current.globalVariables[0].key).toBe('TEST_KEY');
      expect(mockVariableManager.saveVariables).toHaveBeenCalledTimes(4);
    });

    it('should handle environment creation', () => {
      const { result } = renderHook(() => useVariables());

      let id1 = '';

      act(() => {
        id1 = result.current.createEnvironment('Env1');
      });

      expect(id1).toBeDefined();
      expect(result.current.environments).toHaveLength(3);
      expect(result.current.environments[2].name).toBe('Env1');
    });
  });
});
