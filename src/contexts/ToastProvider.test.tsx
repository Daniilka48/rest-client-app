import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast, Toast } from './ToastContext';

jest.useFakeTimers();

const TestComponent = () => {
  const { toasts, addToast, removeToast, showSuccess, showError } = useToast();

  return (
    <div>
      <button onClick={() => addToast('Info message')}>Add Info</button>
      <button onClick={() => showSuccess('Success message')}>
        Add Success
      </button>
      <button onClick={() => showError('Error message')}>Add Error</button>
      <ul>
        {toasts.map((toast: Toast) => (
          <li key={toast.id} data-testid="toast">
            {toast.message} - {toast.type}
            <button onClick={() => removeToast(toast.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('ToastProvider', () => {
  it('adds and removes a toast manually', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Info');
    act(() => {
      addButton.click();
    });

    expect(screen.getByText('Info message - info')).toBeInTheDocument();

    const removeButton = screen.getByText('Remove');
    act(() => {
      removeButton.click();
    });

    expect(screen.queryByText('Info message - info')).not.toBeInTheDocument();
  });

  it('automatically removes toast after duration', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Info');
    act(() => {
      addButton.click();
    });

    expect(screen.getByText('Info message - info')).toBeInTheDocument();

    // fast-forward time
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.queryByText('Info message - info')).not.toBeInTheDocument();
  });

  it('showSuccess and showError work correctly', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Add Success').click();
    });
    expect(screen.getByText('Success message - success')).toBeInTheDocument();

    act(() => {
      screen.getByText('Add Error').click();
    });
    expect(screen.getByText('Error message - error')).toBeInTheDocument();
  });
});
