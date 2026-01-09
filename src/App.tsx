import { useState } from 'react';
import { CurrencyConverter } from './components/CurrencyConverter';
import { Calculator } from './components/Calculator';
import { Calculator as CalculatorIcon, ArrowLeftRight } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'converter' | 'calculator'>('converter');
  const [copiedAmount, setCopiedAmount] = useState<string | undefined>();

  // Listen for clipboard updates from calculator
  const handleCalculatorCopy = (amount: string) => {
    setCopiedAmount(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Top Navigation - Desktop Only */}
      <nav data-testid="desktop-menu" className="hidden md:block sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex gap-2 justify-center">
            <button
              data-testid="desktop-converter-button"
              onClick={() => setCurrentScreen('converter')}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all ${
                currentScreen === 'converter'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span className="text-sm">Converter</span>
            </button>
            <button
              data-testid="desktop-calculator-button"
              onClick={() => setCurrentScreen('calculator')}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all ${
                currentScreen === 'calculator'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <CalculatorIcon className="h-4 w-4" />
              <span className="text-sm">Calculator</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {currentScreen === 'converter' ? (
          <CurrencyConverter initialAmount={copiedAmount} />
        ) : (
          <Calculator onCopy={handleCalculatorCopy} />
        )}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav data-cy="mobile-menu" data-testid="mobile-menu" className="md:hidden fixed bottom-0 left-0 right-0 px-4 pb-6 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-card border border-border shadow-xl rounded-2xl p-2 grid grid-cols-2 gap-2">
            <button
              data-cy="mobile-converter-button"
              data-testid="mobile-converter-button"
              onClick={() => setCurrentScreen('converter')}
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all ${
                currentScreen === 'converter'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <ArrowLeftRight className="h-5 w-5 mb-1" />
              <span className="text-sm">Converter</span>
            </button>
            <button
              data-cy="mobile-calculator-button"
              data-testid="mobile-calculator-button"
              onClick={() => setCurrentScreen('calculator')}
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all ${
                currentScreen === 'calculator'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <CalculatorIcon className="h-5 w-5 mb-1" />
              <span className="text-sm">Calculator</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom padding to prevent content being hidden by nav */}
      <div className="h-32 md:h-0" />
    </div>
  );
}