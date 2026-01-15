import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: number;
}

interface ConversionHistory {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  convertedAmount: string;
  conversionRate: number;
  timestamp: number;
}

interface ExchangeContextType {
  selectedFromCurrency: string;
  selectedToCurrency: string;
  setSelectedFromCurrency: (currency: string) => void;
  setSelectedToCurrency: (currency: string) => void;
  
  cachedRates: ExchangeRate[];
  getCachedRate: (from: string, to: string) => ExchangeRate | null;
  cacheRate: (from: string, to: string, rate: number) => void;
  
  lastConversion: ConversionHistory | null;
  saveConversion: (conversion: ConversionHistory) => void;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

const CACHE_DURATION = 1000 * 60 * 60;
const STORAGE_KEY = 'exchange_app_state';

interface StorageData {
  selectedFromCurrency: string;
  selectedToCurrency: string;
  cachedRates: ExchangeRate[];
  lastConversion: ConversionHistory | null;
}

const loadFromStorage = (): Partial<StorageData> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
  }
  return {};
};

const saveToStorage = (data: StorageData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

interface ExchangeProviderProps {
  children: ReactNode;
}

export const ExchangeProvider = ({ children }: ExchangeProviderProps) => {
  const stored = loadFromStorage();
  
  const [selectedFromCurrency, setSelectedFromCurrency] = useState<string>(
    stored.selectedFromCurrency || 'USD'
  );
  const [selectedToCurrency, setSelectedToCurrency] = useState<string>(
    stored.selectedToCurrency || 'HNL'
  );
  const [cachedRates, setCachedRates] = useState<ExchangeRate[]>(
    stored.cachedRates || []
  );
  const [lastConversion, setLastConversion] = useState<ConversionHistory | null>(
    stored.lastConversion || null
  );

  useEffect(() => {
    saveToStorage({
      selectedFromCurrency,
      selectedToCurrency,
      cachedRates,
      lastConversion,
    });
  }, [selectedFromCurrency, selectedToCurrency, cachedRates, lastConversion]);

  const getCachedRate = useCallback((from: string, to: string): ExchangeRate | null => {
    const now = Date.now();
    const cached = cachedRates.find(
      (rate) =>
        rate.fromCurrency === from &&
        rate.toCurrency === to &&
        now - rate.timestamp < CACHE_DURATION
    );
    return cached || null;
  }, [cachedRates]);

  const cacheRate = useCallback((from: string, to: string, rate: number) => {
    const now = Date.now();
    setCachedRates((prev) => {
      const filtered = prev.filter(
        (r) => !(r.fromCurrency === from && r.toCurrency === to)
      );
      return [
        ...filtered,
        {
          fromCurrency: from,
          toCurrency: to,
          rate,
          timestamp: now,
        },
      ];
    });
  }, []);

  const saveConversion = useCallback((conversion: ConversionHistory) => {
    setLastConversion(conversion);
  }, []);

  const value: ExchangeContextType = {
    selectedFromCurrency,
    selectedToCurrency,
    setSelectedFromCurrency,
    setSelectedToCurrency,
    cachedRates,
    getCachedRate,
    cacheRate,
    lastConversion,
    saveConversion,
  };

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = (): ExchangeContextType => {
  const context = useContext(ExchangeContext);
  if (context === undefined) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
};
