export const mockExchangeRates: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 148.50,
    AUD: 1.52,
    CAD: 1.36,
    CHF: 0.88,
    CNY: 7.24,
    INR: 83.12,
    MXN: 17.15,
    BRL: 4.98,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.86,
    JPY: 161.50,
    AUD: 1.65,
    CAD: 1.48,
    CHF: 0.96,
    CNY: 7.88,
    INR: 90.45,
    MXN: 18.65,
    BRL: 5.42,
  },
  GBP: {
    USD: 1.27,
    EUR: 1.16,
    JPY: 188.65,
    AUD: 1.93,
    CAD: 1.72,
    CHF: 1.12,
    CNY: 9.19,
    INR: 105.60,
    MXN: 21.78,
    BRL: 6.32,
  },
  JPY: {
    USD: 0.0067,
    EUR: 0.0062,
    GBP: 0.0053,
    AUD: 0.0102,
    CAD: 0.0091,
    CHF: 0.0059,
    CNY: 0.0487,
    INR: 0.5596,
    MXN: 0.1154,
    BRL: 0.0335,
  },
};

export interface MockResponse {
  conversion_rate: number;
  conversion_result: number;
}

export const getMockExchangeRate = (
  from: string,
  to: string,
  amount: number
): MockResponse => {
  // Check if we have the rate
  if (mockExchangeRates[from] && mockExchangeRates[from][to]) {
    const rate = mockExchangeRates[from][to];
    return {
      conversion_rate: rate,
      conversion_result: amount * rate,
    };
  }

  // Try inverse rate
  if (mockExchangeRates[to] && mockExchangeRates[to][from]) {
    const rate = 1 / mockExchangeRates[to][from];
    return {
      conversion_rate: rate,
      conversion_result: amount * rate,
    };
  }

  // If same currency
  if (from === to) {
    return {
      conversion_rate: 1,
      conversion_result: amount,
    };
  }

  // Return a default rate if not found
  return {
    conversion_rate: 1,
    conversion_result: amount,
  };
};
