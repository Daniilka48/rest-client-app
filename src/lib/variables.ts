export interface Variable {
  key: string;
  value: string;
  enabled: boolean;
}

export interface Environment {
  id: string;
  name: string;
  variables: Variable[];
}

export interface VariableScope {
  global: Variable[];
  environment: Variable[];
}

export class VariableManager {
  private static readonly STORAGE_KEY = 'rest-client-variables';
  private static readonly ACTIVE_ENV_KEY = 'rest-client-active-env';

  static getVariables(): {
    environments: Environment[];
    globalVariables: Variable[];
    activeEnvironmentId: string | null;
  } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const activeEnvId = localStorage.getItem(this.ACTIVE_ENV_KEY);

      if (data) {
        const parsed = JSON.parse(data);
        return {
          environments: parsed.environments || [],
          globalVariables: parsed.globalVariables || [],
          activeEnvironmentId: activeEnvId,
        };
      }
    } catch (error) {
      throw new Error(`Failed to load variables: ${error}`);
    }

    return {
      environments: [],
      globalVariables: [],
      activeEnvironmentId: null,
    };
  }

  static saveVariables(
    environments: Environment[],
    globalVariables: Variable[]
  ): void {
    try {
      const data = {
        environments,
        globalVariables,
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      throw new Error(`Failed to save variables: ${error}`);
    }
  }

  static setActiveEnvironment(environmentId: string | null): void {
    try {
      if (environmentId) {
        localStorage.setItem(this.ACTIVE_ENV_KEY, environmentId);
      } else {
        localStorage.removeItem(this.ACTIVE_ENV_KEY);
      }
    } catch (error) {
      throw new Error(`Failed to set active environment: ${error}`);
    }
  }

  static resolveVariables(
    text: string,
    globalVariables: Variable[],
    environmentVariables: Variable[] = []
  ): string {
    if (!text) return text;

    const variableMap = new Map<string, string>();

    globalVariables.forEach((variable) => {
      if (variable.enabled) {
        variableMap.set(variable.key, variable.value);
      }
    });

    environmentVariables.forEach((variable) => {
      if (variable.enabled) {
        variableMap.set(variable.key, variable.value);
      }
    });

    let resolvedText = text;
    const variableRegex = /\{\{([^}]+)\}\}/g;

    resolvedText = resolvedText.replace(
      variableRegex,
      (match, variableName) => {
        const trimmedName = variableName.trim();
        return variableMap.get(trimmedName) || match;
      }
    );

    return resolvedText;
  }

  static extractVariablesFromText(text: string): string[] {
    if (!text) return [];

    const variableRegex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(text)) !== null) {
      const variableName = match[1].trim();
      if (!variables.includes(variableName)) {
        variables.push(variableName);
      }
    }

    return variables;
  }

  static generateVariablePreview(
    text: string,
    globalVariables: Variable[],
    environmentVariables: Variable[] = []
  ): { resolved: string; unresolvedVariables: string[] } {
    const resolved = this.resolveVariables(
      text,
      globalVariables,
      environmentVariables
    );
    const allVariables = this.extractVariablesFromText(text);

    const variableMap = new Map<string, string>();
    globalVariables.forEach(
      (v) => v.enabled && variableMap.set(v.key, v.value)
    );
    environmentVariables.forEach(
      (v) => v.enabled && variableMap.set(v.key, v.value)
    );

    const unresolvedVariables = allVariables.filter(
      (varName) => !variableMap.has(varName)
    );

    return {
      resolved,
      unresolvedVariables,
    };
  }
}
