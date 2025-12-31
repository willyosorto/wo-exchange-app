import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CalculatorProps {
  onCopy?: (value: string) => void;
}

export const Calculator = ({ onCopy }: CalculatorProps = {}) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [newNumber, setNewNumber] = useState(true);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    if (lastResult !== null) {
      // Starting a new calculation after getting a result
      setExpression(lastResult + ' ' + op);
      setLastResult(null);
    } else if (expression === '') {
      // First operation
      setExpression(display + ' ' + op);
    } else {
      // Continue building the expression
      setExpression(expression + ' ' + display + ' ' + op);
    }
    setNewNumber(true);
  };

  const evaluateExpression = (expr: string): number => {
    // Parse the expression and evaluate it
    const tokens = expr.trim().split(' ');
    if (tokens.length === 0) return 0;

    let result = parseFloat(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const operand = parseFloat(tokens[i + 1]);

      if (isNaN(operand)) continue;

      switch (operator) {
        case '+':
          result += operand;
          break;
        case '-':
          result -= operand;
          break;
        case '×':
          result *= operand;
          break;
        case '÷':
          result = operand !== 0 ? result / operand : 0;
          break;
      }
    }

    return result;
  };

  const calculate = () => {
    if (expression === '') return;

    // Build the complete expression
    const fullExpression = expression + ' ' + display;

    try {
      const result = evaluateExpression(fullExpression);
      const resultStr = result.toString();
      setDisplay(resultStr);
      setLastResult(resultStr);
      setExpression('');
      setNewNumber(true);
    } catch (err) {
      setDisplay('Error');
      setExpression('');
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setNewNumber(true);
    setLastResult(null);
  };

  const handleDelete = () => {
    if (display.length === 1) {
      setDisplay('0');
      setNewNumber(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    
    if (expression === '') {
      // No operation, just divide by 100
      setDisplay((current / 100).toString());
    } else {
      // Get the last number from the expression
      const tokens = expression.trim().split(' ');
      const lastOperator = tokens[tokens.length - 1];
      const baseNumber = parseFloat(tokens[tokens.length - 2] || tokens[0]);
      
      let result: number;
      
      switch (lastOperator) {
        case '+':
        case '-':
          // For addition/subtraction: calculate percentage of base number
          result = (baseNumber * current) / 100;
          break;
        case '×':
        case '÷':
          // For multiplication/division: just divide by 100
          result = current / 100;
          break;
        default:
          result = current / 100;
      }
      
      setDisplay(result.toString());
    }
    
    setNewNumber(true);
  };

  const handleCopy = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(display);
        onCopy?.(display);
        toast.success('Copied to clipboard!');
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = display;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          textArea.remove();

          if (successful) {
            onCopy?.(display);
            toast.success('Copied to clipboard!');
          } else {
            throw new Error('Copy command was unsuccessful');
          }
        } catch (err) {
          textArea.remove();
          throw err;
        }
      }
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error('Failed to copy');
    }
  };

  const buttonClass = "h-16 rounded-xl transition-all active:scale-95";
  const numberButtonClass = `${buttonClass} bg-card hover:bg-secondary border-0 shadow-sm text-foreground`;
  const operationButtonClass = `${buttonClass} bg-gray-700 text-white hover:bg-gray-600 border-0`;
  const utilityButtonClass = `${buttonClass} bg-card hover:bg-secondary border-0 shadow-sm text-foreground`;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle data-cy="calculator-title">Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-input-background rounded-xl p-6 min-h-[100px] flex items-end justify-end">
          <div className="text-right flex-1">
            {expression && (
              <div data-cy="calculator-operation" className="text-muted-foreground mb-1">
                {expression}
              </div>
            )}
            <div data-cy="calculator-display" className="text-3xl break-all">{display}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {/* Row 1: Delete, Clear, Copy, Divide */}
          <Button onClick={handleDelete} className={utilityButtonClass} data-cy="calculator-delete">
            ⌫
          </Button>
          <Button onClick={handleClear} className={utilityButtonClass} data-cy="calculator-clear">
            C
          </Button>
          <Button onClick={handleCopy} className={utilityButtonClass} data-cy="calculator-copy">
            <Copy className="h-5 w-5" />
          </Button>
          <Button onClick={() => handleOperation('÷')} className={operationButtonClass} data-cy="calculator-divide">
            ÷
          </Button>

          {/* Row 2: 7, 8, 9, Multiply */}
          <Button onClick={() => handleNumber('7')} className={numberButtonClass} data-cy="calculator-7">
            7
          </Button>
          <Button onClick={() => handleNumber('8')} className={numberButtonClass} data-cy="calculator-8">
            8
          </Button>
          <Button onClick={() => handleNumber('9')} className={numberButtonClass} data-cy="calculator-9">
            9
          </Button>
          <Button onClick={() => handleOperation('×')} className={operationButtonClass} data-cy="calculator-multiply">
            ×
          </Button>

          {/* Row 3: 4, 5, 6, Subtract */}
          <Button onClick={() => handleNumber('4')} className={numberButtonClass} data-cy="calculator-4">
            4
          </Button>
          <Button onClick={() => handleNumber('5')} className={numberButtonClass} data-cy="calculator-5">
            5
          </Button>
          <Button onClick={() => handleNumber('6')} className={numberButtonClass} data-cy="calculator-6">
            6
          </Button>
          <Button onClick={() => handleOperation('-')} className={operationButtonClass} data-cy="calculator-subtract">
            -
          </Button>

          {/* Row 4: 1, 2, 3, Add */}
          <Button onClick={() => handleNumber('1')} className={numberButtonClass} data-cy="calculator-1">
            1
          </Button>
          <Button onClick={() => handleNumber('2')} className={numberButtonClass} data-cy="calculator-2">
            2
          </Button>
          <Button onClick={() => handleNumber('3')} className={numberButtonClass} data-cy="calculator-3">
            3
          </Button>
          <Button onClick={() => handleOperation('+')} className={operationButtonClass} data-cy="calculator-add">
            +
          </Button>

          {/* Row 5: Percent, 0, Decimal, Equals */}
          <Button onClick={handlePercent} className={utilityButtonClass} data-cy="calculator-percent">
            %
          </Button>
          <Button onClick={() => handleNumber('0')} className={numberButtonClass} data-cy="calculator-0">
            0
          </Button>
          <Button onClick={handleDecimal} className={numberButtonClass} data-cy="calculator-decimal">
            .
          </Button>
          <Button onClick={calculate} className={operationButtonClass} data-cy="calculator-equals">
            =
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}