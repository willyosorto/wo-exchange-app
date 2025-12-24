import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ArrowDownUp, Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
];

// Mock exchange rates (base: USD)
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.05,
  BRL: 4.97,
  KRW: 1308.50,
};

interface CurrencyConverterProps {
  initialAmount?: string;
}

export const CurrencyConverter = ({ initialAmount }: CurrencyConverterProps) => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(initialAmount || '100');
  const [convertedAmount, setConvertedAmount] = useState('0');
  const [openFromCurrency, setOpenFromCurrency] = useState(false);
  const [openToCurrency, setOpenToCurrency] = useState(false);

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);

  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount >= 0) {
      const fromRate = exchangeRates[fromCurrency];
      const toRate = exchangeRates[toCurrency];
      const result = (numAmount / fromRate) * toRate;
      setConvertedAmount(result.toFixed(2));
    } else {
      setConvertedAmount('0');
    }
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="from-currency">From</Label>
          <Popover open={openFromCurrency} onOpenChange={setOpenFromCurrency}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openFromCurrency}
                className="w-full justify-between bg-input-background border-0 h-auto py-3"
              >
                <div className="flex items-center gap-2">
                  <span>{fromCurrencyData?.flag}</span>
                  <span>{fromCurrencyData?.code}</span>
                  <span className="text-muted-foreground">- {fromCurrencyData?.name}</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search currency..." />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {currencies.map((currency) => (
                      <CommandItem
                        key={currency.code}
                        value={`${currency.code} ${currency.name}`}
                        onSelect={() => {
                          setFromCurrency(currency.code);
                          setOpenFromCurrency(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            fromCurrency === currency.code ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        <span>{currency.flag}</span>
                        <span className="ml-2">{currency.code}</span>
                        <span className="ml-2 text-muted-foreground">- {currency.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="relative mt-3">
            <Input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="pr-12 h-14 bg-input-background border-0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {fromCurrencyData?.symbol}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="rounded-full bg-gray-700 text-white hover:bg-gray-600 border-0 shadow-sm"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-currency">To</Label>
          <Popover open={openToCurrency} onOpenChange={setOpenToCurrency}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openToCurrency}
                className="w-full justify-between bg-input-background border-0 h-auto py-3"
              >
                <div className="flex items-center gap-2">
                  <span>{toCurrencyData?.flag}</span>
                  <span>{toCurrencyData?.code}</span>
                  <span className="text-muted-foreground">- {toCurrencyData?.name}</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search currency..." />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {currencies.map((currency) => (
                      <CommandItem
                        key={currency.code}
                        value={`${currency.code} ${currency.name}`}
                        onSelect={() => {
                          setToCurrency(currency.code);
                          setOpenToCurrency(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            toCurrency === currency.code ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        <span>{currency.flag}</span>
                        <span className="ml-2">{currency.code}</span>
                        <span className="ml-2 text-muted-foreground">- {currency.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="relative mt-3">
            <Input
              type="text"
              value={convertedAmount}
              readOnly
              className="pr-12 h-14 bg-secondary border-0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {toCurrencyData?.symbol}
            </span>
          </div>
        </div>

        <div className="pt-2 px-4 py-3 bg-muted rounded-lg">
          <p className="text-center text-muted-foreground">
            1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}