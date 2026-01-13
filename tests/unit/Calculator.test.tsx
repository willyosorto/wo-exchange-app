import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from '../../src/components/Calculator';
import { waitFor } from '@testing-library/react';

describe('Calculator Component', () => {
  describe('Rendering', () => {
    it('should render the calculator with initial display of 0', () => {
      render(<Calculator />);
      
      expect(screen.getByTestId('calculator-title')).toHaveTextContent('Calculator');
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0');
    });

    it('should render all number buttons', () => {
      render(<Calculator />);
      
      for (let i = 0; i <= 9; i++) {
        expect(screen.getByTestId(`calculator-${i}`)).toBeInTheDocument();
      }
    });

    it('should render all operation buttons', () => {
      render(<Calculator />);
      
      expect(screen.getByTestId('calculator-add')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-subtract')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-multiply')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-divide')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-equals')).toBeInTheDocument();
    });

    it('should render utility buttons', () => {
      render(<Calculator />);
      
      expect(screen.getByTestId('calculator-clear')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-delete')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-copy')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-percent')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-decimal')).toBeInTheDocument();
    });
  });

  describe('Number Input', () => {
    it('should display number when clicked', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5');
    });

    it('should display multiple digits correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-1'));
      await user.click(screen.getByTestId('calculator-2'));
      await user.click(screen.getByTestId('calculator-3'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('123');
    });

    it('should handle decimal point correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-decimal'));
      await user.click(screen.getByTestId('calculator-7'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5.7');
    });

    it('should not add multiple decimal points', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-decimal'));
      await user.click(screen.getByTestId('calculator-decimal'));
      await user.click(screen.getByTestId('calculator-7'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5.7');
    });
  });

  describe('Basic Operations', () => {
    it('should perform addition correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-add'));
      await user.click(screen.getByTestId('calculator-3'));
      await user.click(screen.getByTestId('calculator-equals'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('8');
    });

    it('should perform subtraction correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-9'));
      await user.click(screen.getByTestId('calculator-subtract'));
      await user.click(screen.getByTestId('calculator-4'));
      await user.click(screen.getByTestId('calculator-equals'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('5');
    });

    it('should perform multiplication correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-6'));
      await user.click(screen.getByTestId('calculator-multiply'));
      await user.click(screen.getByTestId('calculator-7'));
      await user.click(screen.getByTestId('calculator-equals'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('42');
    });

    it('should perform division correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-8'));
      await user.click(screen.getByTestId('calculator-divide'));
      await user.click(screen.getByTestId('calculator-4'));
      await user.click(screen.getByTestId('calculator-equals'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('2');
    });

    it('should handle division by zero', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-8'));
      await user.click(screen.getByTestId('calculator-divide'));
      await user.click(screen.getByTestId('calculator-0'));
      await user.click(screen.getByTestId('calculator-equals'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0');
    });
  });

  describe('Complex Operations', () => {
    it('should perform chained operations correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-add'));
      await user.click(screen.getByTestId('calculator-3'));
      await user.click(screen.getByTestId('calculator-multiply'));
      await user.click(screen.getByTestId('calculator-2'));
      await user.click(screen.getByTestId('calculator-equals'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('16');
    });

    it('should display operation expression', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-add'));
      
      expect(screen.getByTestId('calculator-operation')).toHaveTextContent('5 +');
    });
  });

  describe('Utility Functions', () => {
    it('should clear display when C is clicked', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-3'));
      await user.click(screen.getByTestId('calculator-clear'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0');
    });

    it('should delete last digit when delete is clicked', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-1'));
      await user.click(screen.getByTestId('calculator-2'));
      await user.click(screen.getByTestId('calculator-3'));
      await user.click(screen.getByTestId('calculator-delete'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('12');
    });

    it('should handle delete on single digit', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-delete'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0');
    });

    it('should calculate percentage correctly', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-0'));
      await user.click(screen.getByTestId('calculator-percent'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('0.5');
    });
  });

  describe('Copy Functionality', () => {
    it('should call onCopy callback when copy button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCopy = vi.fn();
      
      // Mock clipboard API properly
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });
      
      // Mock isSecureContext to true to use the modern clipboard API path
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        writable: true,
        configurable: true,
      });
      
      render(<Calculator onCopy={mockOnCopy} />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-copy'));
      
      // Wait for async clipboard operation
      await waitFor(() => {
        expect(mockOnCopy).toHaveBeenCalledWith('5');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should start new number after operation', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-add'));
      await user.click(screen.getByTestId('calculator-3'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('3');
    });

    it('should handle operations on previous result', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      // First calculation
      await user.click(screen.getByTestId('calculator-5'));
      await user.click(screen.getByTestId('calculator-add'));
      await user.click(screen.getByTestId('calculator-3'));
      await user.click(screen.getByTestId('calculator-equals'));
      
      // Operation on result
      await user.click(screen.getByTestId('calculator-multiply'));
      await user.click(screen.getByTestId('calculator-2'));
      await user.click(screen.getByTestId('calculator-equals'));
      
      expect(screen.getByTestId('calculator-display')).toHaveTextContent('16');
    });
  });
});
