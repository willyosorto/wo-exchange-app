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
    setDisplay((current / 100).toString());
    setNewNumber(true);
  };

  const handleCopy = async () => {
    try {
      // Use fallback method as primary since Clipboard API is blocked in this context
      const textArea = document.createElement('textarea');
      textArea.value = display;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        onCopy?.(display);
        toast.success('Copied to clipboard!');
      } else {
        throw new Error('Copy command was unsuccessful');
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
        <CardTitle>Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-input-background rounded-xl p-6 min-h-[100px] flex items-end justify-end">
          <div className="text-right flex-1">
            {expression && (
              <div className="text-muted-foreground mb-1">
                {expression}
              </div>
            )}
            <div className="text-3xl break-all">{display}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {/* Row 1: Delete, Clear, Copy, Divide */}
          <Button onClick={handleDelete} className={utilityButtonClass}>
            ⌫
          </Button>
          <Button onClick={handleClear} className={utilityButtonClass}>
            C
          </Button>
          <Button onClick={handleCopy} className={utilityButtonClass}>
            <Copy className="h-5 w-5" />
          </Button>
          <Button onClick={() => handleOperation('÷')} className={operationButtonClass}>
            ÷
          </Button>

          {/* Row 2: 7, 8, 9, Multiply */}
          <Button onClick={() => handleNumber('7')} className={numberButtonClass}>
            7
          </Button>
          <Button onClick={() => handleNumber('8')} className={numberButtonClass}>
            8
          </Button>
          <Button onClick={() => handleNumber('9')} className={numberButtonClass}>
            9
          </Button>
          <Button onClick={() => handleOperation('×')} className={operationButtonClass}>
            ×
          </Button>

          {/* Row 3: 4, 5, 6, Subtract */}
          <Button onClick={() => handleNumber('4')} className={numberButtonClass}>
            4
          </Button>
          <Button onClick={() => handleNumber('5')} className={numberButtonClass}>
            5
          </Button>
          <Button onClick={() => handleNumber('6')} className={numberButtonClass}>
            6
          </Button>
          <Button onClick={() => handleOperation('-')} className={operationButtonClass}>
            -
          </Button>

          {/* Row 4: 1, 2, 3, Add */}
          <Button onClick={() => handleNumber('1')} className={numberButtonClass}>
            1
          </Button>
          <Button onClick={() => handleNumber('2')} className={numberButtonClass}>
            2
          </Button>
          <Button onClick={() => handleNumber('3')} className={numberButtonClass}>
            3
          </Button>
          <Button onClick={() => handleOperation('+')} className={operationButtonClass}>
            +
          </Button>

          {/* Row 5: Percent, 0, Decimal, Equals */}
          <Button onClick={handlePercent} className={utilityButtonClass}>
            %
          </Button>
          <Button onClick={() => handleNumber('0')} className={numberButtonClass}>
            0
          </Button>
          <Button onClick={handleDecimal} className={numberButtonClass}>
            .
          </Button>
          <Button onClick={calculate} className={operationButtonClass}>
            =
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}