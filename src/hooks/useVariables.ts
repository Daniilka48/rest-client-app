'use client';

import { Environment, Variable, VariableManager } from '../lib/variables';
import { useState, useEffect } from 'react';

export function useVariables() {
  const [globalVariables, setGlobalVariables] = useState<Variable[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [activeEnvironmentId, setActiveEnvironmentId] = useState<string | null>(
    null
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = VariableManager.getVariables();
    setGlobalVariables(data.globalVariables);
    setEnvironments(data.environments);
    setActiveEnvironmentId(data.activeEnvironmentId);
    setIsLoaded(true);
  }, []);

  const saveToStorage = (
    newEnvironments: Environment[],
    newGlobalVariables: Variable[]
  ) => {
    VariableManager.saveVariables(newEnvironments, newGlobalVariables);
  };

  const addGlobalVariable = () => {
    const newVariable: Variable = {
      key: '',
      value: '',
      enabled: true,
    };
    const updated = [...globalVariables, newVariable];
    setGlobalVariables(updated);
    saveToStorage(environments, updated);
  };

  const updateGlobalVariable = (
    index: number,
    field: keyof Variable,
    value: string | boolean
  ) => {
    const updated = globalVariables.map((variable, i) =>
      i === index ? { ...variable, [field]: value } : variable
    );
    setGlobalVariables(updated);
    saveToStorage(environments, updated);
  };

  const removeGlobalVariable = (index: number) => {
    const updated = globalVariables.filter((_, i) => i !== index);
    setGlobalVariables(updated);
    saveToStorage(environments, updated);
  };

  const createEnvironment = (name: string) => {
    const newEnvironment: Environment = {
      id: Date.now().toString(),
      name,
      variables: [],
    };
    const updated = [...environments, newEnvironment];
    setEnvironments(updated);
    saveToStorage(updated, globalVariables);
    return newEnvironment.id;
  };

  const updateEnvironment = (
    environmentId: string,
    name: string,
    variables: Variable[]
  ) => {
    const updated = environments.map((env) =>
      env.id === environmentId ? { ...env, name, variables } : env
    );
    setEnvironments(updated);
    saveToStorage(updated, globalVariables);
  };

  const deleteEnvironment = (environmentId: string) => {
    const updated = environments.filter((env) => env.id !== environmentId);
    setEnvironments(updated);
    saveToStorage(updated, globalVariables);

    if (activeEnvironmentId === environmentId) {
      setActiveEnvironmentId(null);
      VariableManager.setActiveEnvironment(null);
    }
  };

  const setActiveEnvironment = (environmentId: string | null) => {
    setActiveEnvironmentId(environmentId);
    VariableManager.setActiveEnvironment(environmentId);
  };

  const addEnvironmentVariable = (environmentId: string) => {
    const environment = environments.find((env) => env.id === environmentId);
    if (!environment) return;

    const newVariable: Variable = {
      key: '',
      value: '',
      enabled: true,
    };

    const updatedVariables = [...environment.variables, newVariable];
    updateEnvironment(environmentId, environment.name, updatedVariables);
  };

  const updateEnvironmentVariable = (
    environmentId: string,
    index: number,
    field: keyof Variable,
    value: string | boolean
  ) => {
    const environment = environments.find((env) => env.id === environmentId);
    if (!environment) return;

    const updatedVariables = environment.variables.map((variable, i) =>
      i === index ? { ...variable, [field]: value } : variable
    );

    updateEnvironment(environmentId, environment.name, updatedVariables);
  };

  const removeEnvironmentVariable = (environmentId: string, index: number) => {
    const environment = environments.find((env) => env.id === environmentId);
    if (!environment) return;

    const updatedVariables = environment.variables.filter(
      (_, i) => i !== index
    );
    updateEnvironment(environmentId, environment.name, updatedVariables);
  };

  const getCurrentEnvironmentVariables = (): Variable[] => {
    if (!activeEnvironmentId) return [];
    const environment = environments.find(
      (env) => env.id === activeEnvironmentId
    );
    return environment ? environment.variables : [];
  };

  const resolveVariables = (text: string): string => {
    const environmentVariables = getCurrentEnvironmentVariables();
    return VariableManager.resolveVariables(
      text,
      globalVariables,
      environmentVariables
    );
  };

  return {
    globalVariables,
    environments,
    activeEnvironmentId,
    isLoaded,
    addGlobalVariable,
    updateGlobalVariable,
    removeGlobalVariable,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    setActiveEnvironment,
    addEnvironmentVariable,
    updateEnvironmentVariable,
    removeEnvironmentVariable,
    getCurrentEnvironmentVariables,
    resolveVariables,
  };
}
