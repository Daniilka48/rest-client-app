import { VariableManager, Variable, Environment } from './variables';

describe('VariableManager', () => {
  const mockLocalStorage: Record<string, string> = {};

  beforeAll(() => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: (key: string) => mockLocalStorage[key] ?? null,
        setItem: (key: string, value: string) => {
          mockLocalStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockLocalStorage[key];
        },
      },
      writable: true,
    });
  });

  beforeEach(() => {
    for (const key in mockLocalStorage) delete mockLocalStorage[key];
  });

  describe('getVariables & saveVariables', () => {
    it('should return empty arrays and null if no data in localStorage', () => {
      const result = VariableManager.getVariables();
      expect(result).toEqual({
        environments: [],
        globalVariables: [],
        activeEnvironmentId: null,
      });
    });

    it('should save and retrieve variables correctly', () => {
      const envs: Environment[] = [
        {
          id: '1',
          name: 'Env1',
          variables: [{ key: 'foo', value: 'bar', enabled: true }],
        },
      ];
      const globals: Variable[] = [{ key: 'g', value: 'v', enabled: true }];

      VariableManager.saveVariables(envs, globals);

      const result = VariableManager.getVariables();
      expect(result.environments).toEqual(envs);
      expect(result.globalVariables).toEqual(globals);
    });
  });

  describe('setActiveEnvironment', () => {
    it('should set and remove active environment', () => {
      VariableManager.setActiveEnvironment('env1');
      expect(localStorage.getItem('rest-client-active-env')).toBe('env1');

      VariableManager.setActiveEnvironment(null);
      expect(localStorage.getItem('rest-client-active-env')).toBe(null);
    });
  });

  describe('resolveVariables', () => {
    const globals: Variable[] = [
      { key: 'g1', value: 'val1', enabled: true },
      { key: 'g2', value: 'val2', enabled: false },
    ];
    const envVars: Variable[] = [
      { key: 'e1', value: 'envval1', enabled: true },
    ];

    it('should resolve variables from global and environment', () => {
      const text = 'Hello {{g1}} and {{e1}} and {{missing}}';
      const resolved = VariableManager.resolveVariables(text, globals, envVars);
      expect(resolved).toBe('Hello val1 and envval1 and {{missing}}');
    });

    it('should return original text if empty', () => {
      expect(VariableManager.resolveVariables('', globals, envVars)).toBe('');
    });
  });

  describe('extractVariablesFromText', () => {
    it('should extract unique variables from text', () => {
      const text = 'Use {{var1}} and {{var2}} and {{var1}}';
      const vars = VariableManager.extractVariablesFromText(text);
      expect(vars).toEqual(['var1', 'var2']);
    });

    it('should return empty array for empty text', () => {
      expect(VariableManager.extractVariablesFromText('')).toEqual([]);
    });
  });

  describe('generateVariablePreview', () => {
    const globals: Variable[] = [{ key: 'g', value: 'gv', enabled: true }];
    const envVars: Variable[] = [{ key: 'e', value: 'ev', enabled: true }];

    it('should resolve variables and list unresolved', () => {
      const text = 'Hello {{g}} {{e}} {{missing}}';
      const preview = VariableManager.generateVariablePreview(
        text,
        globals,
        envVars
      );

      expect(preview.resolved).toBe('Hello gv ev {{missing}}');
      expect(preview.unresolvedVariables).toEqual(['missing']);
    });
  });
});
