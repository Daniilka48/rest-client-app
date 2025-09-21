import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastContainer } from './Toast';
import { useToast } from '@/contexts/ToastContext';

// Mock the ToastContext
jest.mock('@/contexts/ToastContext', () => ({
  useToast: jest.fn(),
}));

const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

describe('ToastContainer', () => {
  const mockRemoveToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToast.mockReturnValue({
      toasts: [],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
      showSuccess: jest.fn(),
      showError: jest.fn(),
    });
  });

  it('should render nothing when there are no toasts', () => {
    mockUseToast.mockReturnValue({
      toasts: [],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
      showSuccess: jest.fn(),
      showError: jest.fn(),
    });

    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('should render toast container when toasts exist', () => {
    const mockToasts = [
      {
        id: '1',
        message: 'Success message',
        type: 'success' as const,
        duration: 3000,
      },
    ];

    mockUseToast.mockReturnValue({
      toasts: mockToasts,
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
      showSuccess: jest.fn(),
      showError: jest.fn(),
    });

    render(<ToastContainer />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  describe('Different Toast Types', () => {
    it('should render success toast with correct icon', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'Success message',
          type: 'success' as const,
          duration: 3000,
        },
      ];

      mockUseToast.mockReturnValue({
        toasts: mockToasts,
        addToast: jest.fn(),
        removeToast: mockRemoveToast,
        showSuccess: jest.fn(),
        showError: jest.fn(),
      });

      render(<ToastContainer />);

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('should render error toast with correct icon', () => {
      const mockToasts = [
        {
          id: '2',
          message: 'Error message',
          type: 'error' as const,
          duration: 3000,
        },
      ];

      mockUseToast.mockReturnValue({
        toasts: mockToasts,
        addToast: jest.fn(),
        removeToast: mockRemoveToast,
        showSuccess: jest.fn(),
        showError: jest.fn(),
      });

      render(<ToastContainer />);

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('❌')).toBeInTheDocument();
    });

    it('should render warning toast with correct icon', () => {
      const mockToasts = [
        {
          id: '3',
          message: 'Warning message',
          type: 'warning' as const,
          duration: 3000,
        },
      ];

      mockUseToast.mockReturnValue({
        toasts: mockToasts,
        addToast: jest.fn(),
        removeToast: mockRemoveToast,
        showSuccess: jest.fn(),
        showError: jest.fn(),
      });

      render(<ToastContainer />);

      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should render info toast with correct icon', () => {
      const mockToasts = [
        {
          id: '4',
          message: 'Info message',
          type: 'info' as const,
          duration: 3000,
        },
      ];

      mockUseToast.mockReturnValue({
        toasts: mockToasts,
        addToast: jest.fn(),
        removeToast: mockRemoveToast,
        showSuccess: jest.fn(),
        showError: jest.fn(),
      });

      render(<ToastContainer />);

      expect(screen.getByText('Info message')).toBeInTheDocument();
      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });
  });

  describe('Toast Interactions', () => {
    it('should call removeToast when close button is clicked', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'Test message',
          type: 'success' as const,
          duration: 3000,
        },
      ];

      mockUseToast.mockReturnValue({
        toasts: mockToasts,
        addToast: jest.fn(),
        removeToast: mockRemoveToast,
        showSuccess: jest.fn(),
        showError: jest.fn(),
      });

      render(<ToastContainer />);

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(mockRemoveToast).toHaveBeenCalledWith('1');
    });

    it('should call removeToast when toast container is clicked', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'Test message',
          type: 'success' as const,
          duration: 3000,
        },
      ];

      mockUseToast.mockReturnValue({
        toasts: mockToasts,
        addToast: jest.fn(),
        removeToast: mockRemoveToast,
        showSuccess: jest.fn(),
        showError: jest.fn(),
      });

      render(<ToastContainer />);

      const toastElement = screen
        .getByText('Test message')
        .closest('[class*="toast"]');
      if (toastElement) {
        fireEvent.click(toastElement);
      }

      expect(mockRemoveToast).toHaveBeenCalledWith('1');
    });
  });

  describe('Multiple Toasts', () => {
    it('should render multiple toasts', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'First message',
          type: 'success' as const,
          duration: 3000,
        },
        {
          id: '2',
          message: 'Second message',
          type: 'error' as const,
          duration: 3000,
        },
        {
          id: '3',
          message: 'Third message',
          type: 'warning' as const,
          duration: 3000,
        },
      ];

      mockUseToast.mockReturnValue({
        toasts: mockToasts,
        addToast: jest.fn(),
        removeToast: mockRemoveToast,
        showSuccess: jest.fn(),
        showError: jest.fn(),
      });

      render(<ToastContainer />);

      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Second message')).toBeInTheDocument();
      expect(screen.getByText('Third message')).toBeInTheDocument();
      expect(screen.getByText('✅')).toBeInTheDocument();
      expect(screen.getByText('❌')).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should handle removing individual toasts from multiple toasts', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'First message',
          type: 'success' as const,
          duration: 3000,
        },
        {
          id: '2',
          message: 'Second message',
          type: 'error' as const,
          duration: 3000,
        },
      ];

      mockUseToast.mockReturnValue({
        toasts: mockToasts,
        addToast: jest.fn(),
        removeToast: mockRemoveToast,
        showSuccess: jest.fn(),
        showError: jest.fn(),
      });

      render(<ToastContainer />);

      const closeButtons = screen.getAllByText('×');
      fireEvent.click(closeButtons[0]);

      expect(mockRemoveToast).toHaveBeenCalledWith('1');
    });
  });

  describe('Toast Structure', () => {
    it('should render toast with correct structure', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'Test message',
          type: 'success' as const,
          duration: 3000,
        },
      ];

      mockUseToast.mockReturnValue({
        toasts: mockToasts,
        addToast: jest.fn(),
        removeToast: mockRemoveToast,
        showSuccess: jest.fn(),
        showError: jest.fn(),
      });

      render(<ToastContainer />);

      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('✅')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();

      const closeButton = screen.getByText('×');
      expect(closeButton).toHaveAttribute(
        'class',
        expect.stringContaining('closeButton')
      );
    });
  });
});
