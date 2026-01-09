import { useEffect, useState } from 'react';
import { ArrowDownUp, Check, ChevronsUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { convertCurrency, currencies } from '../api/exchangeApi';

interface CurrencyConverterProps {
  initialAmount?: string;
}

export const CurrencyConverter = ({ initialAmount }: CurrencyConverterProps) => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('HNL');
  const [amount, setAmount] = useState(initialAmount || '1');
  const [convertedAmount, setConvertedAmount] = useState('0');
  const [conversionRate, setConversionRate] = useState(1);
  const [openFromCurrency, setOpenFromCurrency] = useState(false);
  const [openToCurrency, setOpenToCurrency] = useState(false);

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);

  useEffect(() => {
    let isMounted = true;

    const performConversion = async () => {
      const parsedAmount = parseFloat(amount);

      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
        if (isMounted) {
          setConvertedAmount('0');
        }
        return;
      }

      try {
        const result = await convertCurrency(
          fromCurrency,
          toCurrency,
          parsedAmount
        );

        if (!isMounted) {
          return;
        }

        setConversionRate(result.conversion_rate);
        setConvertedAmount(result.conversion_result.toFixed(2));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.warn('Failed to convert currency', error);
        setConvertedAmount('0');
      }
    };

    performConversion();

    return () => {
      isMounted = false;
    };
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
        <CardTitle data-cy="exchange-title" data-testid="exchange-title">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="from-currency">From</Label>
          <Popover open={openFromCurrency} onOpenChange={setOpenFromCurrency}>
            <PopoverTrigger asChild>
              <Button
                data-cy="exchange-from-button"
                data-testid="exchange-from-button"
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
                <CommandInput placeholder="Search currency..." data-cy="from-country-search-input" data-testid="from-country-search-input" />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {currencies.map((currency) => (
                      <CommandItem
                        data-cy={`from-country-currency-${currency.code.toLowerCase()}`}
                        data-testid={`from-country-currency-${currency.code.toLowerCase()}`}
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
              data-cy="exchange-from-amount-input"
              data-testid="exchange-from-amount-input"
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
            data-cy="swap-exchange-button"
            data-testid="swap-exchange-button"
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
                data-cy="exchange-to-button"
                data-testid="exchange-to-button"
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
                <CommandInput placeholder="Search currency..." data-cy="to-country-search-input" data-testid="to-country-search-input" />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {currencies.map((currency) => (
                      <CommandItem
                        data-cy={`to-country-currency-${currency.code.toLowerCase()}`}
                        data-testid={`to-country-currency-${currency.code.toLowerCase()}`}
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
              data-cy="exchange-to-amount-input"
              data-testid="exchange-to-amount-input"
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
          <p className="text-center text-muted-foreground" data-cy="exchange-result" data-testid="exchange-result">
            1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}