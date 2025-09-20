'use client';

import React, { useState } from 'react';
import { useVariables } from '../../hooks/useVariables';
import styles from './Variables.module.css';

export default function VariablesPage() {
  const {
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
  } = useVariables();

  const [newEnvName, setNewEnvName] = useState('');
  const [editingEnvId, setEditingEnvId] = useState<string | null>(null);
  const [editingEnvName, setEditingEnvName] = useState('');

  if (!isLoaded) {
    return <div className={styles.container}>Loading...</div>;
  }

  const activeEnvironment = environments.find(
    (env) => env.id === activeEnvironmentId
  );

  const handleCreateEnvironment = () => {
    if (!newEnvName.trim()) return;
    createEnvironment(newEnvName.trim());
    setNewEnvName('');
  };

  const handleEditEnvironment = (envId: string, currentName: string) => {
    setEditingEnvId(envId);
    setEditingEnvName(currentName);
  };

  const handleSaveEnvironment = () => {
    if (!editingEnvId || !editingEnvName.trim()) return;

    const environment = environments.find((env) => env.id === editingEnvId);
    if (environment) {
      updateEnvironment(
        editingEnvId,
        editingEnvName.trim(),
        environment.variables
      );
    }

    setEditingEnvId(null);
    setEditingEnvName('');
  };

  const handleDeleteEnvironment = (envId: string) => {
    if (window.confirm('Are you sure you want to delete this environment?')) {
      deleteEnvironment(envId);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Variables</h1>

      <div className={styles.environmentSelector}>
        <label>Environment:</label>
        <select
          value={activeEnvironmentId || ''}
          onChange={(e) => setActiveEnvironment(e.target.value || null)}
          className={styles.environmentSelect}
        >
          <option value="">Global Variables Only</option>
          {environments.map((env) => (
            <option key={env.id} value={env.id}>
              {env.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Environment name:Testing"
          value={newEnvName}
          onChange={(e) => setNewEnvName(e.target.value)}
          className={styles.envNameInput}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateEnvironment()}
        />
        <button
          onClick={handleCreateEnvironment}
          className={styles.createEnvButton}
          disabled={!newEnvName.trim()}
        >
          Create Environment
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          Global Variables
          <button onClick={addGlobalVariable} className={styles.addButton}>
            + Add Variable
          </button>
        </div>

        {globalVariables.length === 0 ? (
          <div className={styles.emptyState}>
            No global variables. Click &quot;Add Variable&quot; to create
            one.After look at dropdow menu and select it.
          </div>
        ) : (
          <div className={styles.variableList}>
            {globalVariables.map((variable, index) => (
              <div key={index} className={styles.variableRow}>
                <input
                  type="checkbox"
                  checked={variable.enabled}
                  onChange={(e) =>
                    updateGlobalVariable(index, 'enabled', e.target.checked)
                  }
                  className={styles.checkbox}
                />
                <input
                  type="text"
                  placeholder="Variable name e.g., BASE_URL"
                  value={variable.key}
                  onChange={(e) =>
                    updateGlobalVariable(index, 'key', e.target.value)
                  }
                  className={`${styles.variableInput} ${styles.keyInput}`}
                />
                <input
                  type="text"
                  placeholder="Variable value: https://jsonplaceholder.typicode.com"
                  value={variable.value}
                  onChange={(e) =>
                    updateGlobalVariable(index, 'value', e.target.value)
                  }
                  className={`${styles.variableInput} ${styles.valueInput}`}
                />
                <button
                  onClick={() => removeGlobalVariable(index)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeEnvironment && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            {editingEnvId === activeEnvironment.id ? (
              <div className={styles.environmentActions}>
                <input
                  type="text"
                  value={editingEnvName}
                  onChange={(e) => setEditingEnvName(e.target.value)}
                  className={styles.envNameInput}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && handleSaveEnvironment()
                  }
                />
                <button
                  onClick={handleSaveEnvironment}
                  className={styles.saveEnvButton}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingEnvId(null)}
                  className={styles.deleteEnvButton}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.environmentActions}>
                <span>{activeEnvironment.name} Variables</span>
                <button
                  onClick={() =>
                    handleEditEnvironment(
                      activeEnvironment.id,
                      activeEnvironment.name
                    )
                  }
                  className={styles.addButton}
                >
                  Edit Name
                </button>
                <button
                  onClick={() => handleDeleteEnvironment(activeEnvironment.id)}
                  className={styles.deleteEnvButton}
                >
                  Delete Env
                </button>
              </div>
            )}
            <button
              onClick={() => addEnvironmentVariable(activeEnvironment.id)}
              className={styles.addButton}
            >
              + Add Variable
            </button>
          </div>

          {activeEnvironment.variables.length === 0 ? (
            <div className={styles.emptyState}>
              No environment variables. Click &quot;Add Variable&quot; to create
              one.
            </div>
          ) : (
            <div className={styles.variableList}>
              {activeEnvironment.variables.map((variable, index) => (
                <div key={index} className={styles.variableRow}>
                  <input
                    type="checkbox"
                    checked={variable.enabled}
                    onChange={(e) =>
                      updateEnvironmentVariable(
                        activeEnvironment.id,
                        index,
                        'enabled',
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <input
                    type="text"
                    placeholder="Variable name:POST_ID"
                    value={variable.key}
                    onChange={(e) =>
                      updateEnvironmentVariable(
                        activeEnvironment.id,
                        index,
                        'key',
                        e.target.value
                      )
                    }
                    className={`${styles.variableInput} ${styles.keyInput}`}
                  />
                  <input
                    type="text"
                    placeholder="Variable value e.g. 1"
                    value={variable.value}
                    onChange={(e) =>
                      updateEnvironmentVariable(
                        activeEnvironment.id,
                        index,
                        'value',
                        e.target.value
                      )
                    }
                    className={`${styles.variableInput} ${styles.valueInput}`}
                  />
                  <button
                    onClick={() =>
                      removeEnvironmentVariable(activeEnvironment.id, index)
                    }
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.usage}>
        <div className={styles.usageTitle}>How to use variables:</div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <h4>Step 1: Set up your variables (above)</h4>
            <p>
              Create global variables like BASE_URL, and environment-specific
              variables like USER_ID.
            </p>
          </div>

          <div className={styles.step}>
            <h4>Step 2: Go to REST Client</h4>
            <p>
              Navigate to <strong>/rest-client</strong> page or click &quot;REST
              Client&quot; in the header.
            </p>
          </div>

          <div className={styles.step}>
            <h4>Step 3: Use variables in your requests</h4>
            <p>Use variables by wrapping them in double braces:</p>
            <div className={styles.examples}>
              <div className={styles.example}>
                <strong>URL:</strong>{' '}
                <code>{'{{BASE_URL}}/posts/{{POST_ID}}'}</code>
              </div>
              <div className={styles.example}>
                <strong>Header:</strong>{' '}
                <code>Authorization: Bearer {'{{TOKEN}}'}</code>
              </div>
              <div className={styles.example}>
                <strong>Body:</strong> <code>{`{"userId": {{USER_ID}}}`}</code>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <h4>Step 4: Send the request</h4>
            <p>
              Click &quot;Send&quot; and watch variables get resolved
              automatically!
            </p>
          </div>

          <div className={styles.step}>
            <h4>Step 5: Check results</h4>
            <p>Variables are resolved in:</p>
            <ul>
              <li>✅ Response section (real API data)</li>
              <li>✅ Browser URL (shareable links)</li>
            </ul>
          </div>
        </div>

        <div className={styles.quickExample}>
          <h4>Quick Test Example:</h4>
          <div className={styles.testSteps}>
            <p>
              <strong>1.</strong> Add variable:{' '}
              <code>BASE_URL = https://jsonplaceholder.typicode.com</code>
            </p>
            <p>
              <strong>2.</strong> Add variable: <code>POST_ID = 1</code>
            </p>
            <p>
              <strong>3.</strong> Go to REST Client and try:{' '}
              <code>{'{{BASE_URL}}/posts/{{POST_ID}}'}</code>
            </p>
            <p>
              <strong>4.</strong> Click Send → Should fetch real JSON data!
            </p>
          </div>
        </div>

        <div className={styles.note}>
          <strong>Note:</strong> Environment variables override global variables
          with the same name. Switch environments to test different
          configurations instantly!
        </div>
      </div>
    </div>
  );
}
