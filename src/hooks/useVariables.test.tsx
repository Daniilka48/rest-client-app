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

describe('useVariables hook', () => {
  const mockData = {
    globalVariables: [],
    environments: [],
    activeEnvironmentId: null,
  };

  beforeEach(() => {
    (VariableManager.getVariables as jest.Mock).mockReturnValue(mockData);
  });

  it('loads initial variables', () => {
    const { result } = renderHook(() => useVariables());
    expect(result.current.globalVariables).toEqual([]);
    expect(result.current.environments).toEqual([]);
    expect(result.current.activeEnvironmentId).toBeNull();
    expect(result.current.isLoaded).toBe(true);
  });

  it('adds a global variable', () => {
    const { result } = renderHook(() => useVariables());
    act(() => {
      result.current.addGlobalVariable();
    });
    expect(result.current.globalVariables.length).toBe(1);
    expect(VariableManager.saveVariables).toHaveBeenCalled();
  });

  it('creates and deletes an environment', () => {
    const { result } = renderHook(() => useVariables());
    let envId: string;
    act(() => {
      envId = result.current.createEnvironment('TestEnv');
    });
    expect(
      result.current.environments.find((e) => e.id === envId)
    ).toBeDefined();

    act(() => {
      result.current.deleteEnvironment(envId);
    });
    expect(
      result.current.environments.find((e) => e.id === envId)
    ).toBeUndefined();
  });
});
