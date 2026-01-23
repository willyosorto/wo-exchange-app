import { PactV4, MatchersV3 } from '@pact-foundation/pact';
import * as path from 'path';
import { ExchangeApiClient } from '../helpers/apiClient';

const { string, integer, regex, decimal } = MatchersV3;

describe('Exchange Rate API - Contract Tests', () => {
  const provider = new PactV4({
    consumer: 'wo-exchange-app',
    provider: 'exchange-rate-api',
    dir: path.resolve(process.cwd(), 'tests/contract/pacts'),
    logLevel: 'info',
  });

  describe('Successful Exchange Rate Request', () => {
    it('should return exchange rate data for USD to HNL conversion', async () => {
      const amount = 10;
      const baseCode = 'USD';
      const targetCode = 'HNL';

      await provider
        .addInteraction()
        .given('exchange rate data exists for USD to HNL')
        .uponReceiving('a request for USD to HNL exchange rate with amount 10')
        .withRequest(
          'GET',
          `/pair/${baseCode}/${targetCode}/${amount}`,
          (builder) => {
            builder.headers({ 'Authorization': 'Bearer test-api-key' });
          }
        )
        .willRespondWith(200, (builder) => {
          builder
            .headers({ 'Content-Type': 'application/json' })
            .jsonBody({
              result: 'success',
              documentation: string('https://www.exchangerate-api.com/docs'),
              terms_of_use: string('https://www.exchangerate-api.com/terms'),
              time_last_update_unix: integer(1705308000),
              time_last_update_utc: regex(
                /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} \+\d{4}$/,
                'Sun, 15 Jan 2026 00:00:00 +0000'
              ),
              time_next_update_unix: integer(1705394400),
              time_next_update_utc: regex(
                /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} \+\d{4}$/,
                'Mon, 16 Jan 2026 00:00:00 +0000'
              ),
              base_code: baseCode,
              target_code: targetCode,
              conversion_rate: decimal(24.5),
              conversion_result: decimal(245.0),
            });
        })
        .executeTest(async (mockServer) => {
          const client = new ExchangeApiClient(mockServer.url, 'test-api-key');
          const response = await client.getExchangeRate(baseCode, targetCode, amount);

          expect(response.status).toBe(200);
          expect(response.data.result).toBe('success');
          expect(response.data.base_code).toBe(baseCode);
          expect(response.data.target_code).toBe(targetCode);
          expect(response.data.conversion_rate).toBeDefined();
          expect(typeof response.data.conversion_rate).toBe('number');
          expect(response.data.conversion_result).toBeDefined();
          expect(typeof response.data.conversion_result).toBe('number');
          expect(response.data.documentation).toBeDefined();
          expect(response.data.terms_of_use).toBeDefined();
        });
    });

    it('should return exchange rate data for EUR to USD conversion', async () => {
      const amount = 100;
      const baseCode = 'EUR';
      const targetCode = 'USD';

      await provider
        .addInteraction()
        .given('exchange rate data exists for EUR to USD')
        .uponReceiving('a request for EUR to USD exchange rate with amount 100')
        .withRequest(
          'GET',
          `/pair/${baseCode}/${targetCode}/${amount}`,
          (builder) => {
            builder.headers({ 'Authorization': 'Bearer test-api-key' });
          }
        )
        .willRespondWith(200, (builder) => {
          builder
            .headers({ 'Content-Type': 'application/json' })
            .jsonBody({
              result: 'success',
              documentation: string('https://www.exchangerate-api.com/docs'),
              terms_of_use: string('https://www.exchangerate-api.com/terms'),
              time_last_update_unix: integer(1705308000),
              time_last_update_utc: regex(
                /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} \+\d{4}$/,
                'Sun, 15 Jan 2026 00:00:00 +0000'
              ),
              time_next_update_unix: integer(1705394400),
              time_next_update_utc: regex(
                /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} \+\d{4}$/,
                'Mon, 16 Jan 2026 00:00:00 +0000'
              ),
              base_code: baseCode,
              target_code: targetCode,
              conversion_rate: decimal(1.09),
              conversion_result: decimal(109.0),
            });
        })
        .executeTest(async (mockServer) => {
          const client = new ExchangeApiClient(mockServer.url, 'test-api-key');
          const response = await client.getExchangeRate(baseCode, targetCode, amount);

          expect(response.status).toBe(200);
          expect(response.data.result).toBe('success');
          expect(response.data.base_code).toBe(baseCode);
          expect(response.data.target_code).toBe(targetCode);
          expect(response.data.conversion_rate).toBeGreaterThan(0);
          expect(response.data.conversion_result).toBeGreaterThan(0);
        });
    });
  });

  describe('Error Scenarios', () => {
    it('should return 404 for invalid currency code', async () => {
      const amount = 10;
      const baseCode = 'UZD'; // Invalid currency code
      const targetCode = 'HNL';

      await provider
        .addInteraction()
        .given('exchange rate data does not exist for invalid currency code')
        .uponReceiving('a request with invalid currency code UZD')
        .withRequest(
          'GET',
          `/pair/${baseCode}/${targetCode}/${amount}`,
          (builder) => {
            builder.headers({ 'Authorization': 'Bearer test-api-key' });
          }
        )
        .willRespondWith(404, (builder) => {
          builder
            .headers({ 'Content-Type': 'application/json' })
            .jsonBody({
              result: 'error',
              'error-type': regex(/unsupported-code/, 'unsupported-code'),
            });
        })
        .executeTest(async (mockServer) => {
          const client = new ExchangeApiClient(mockServer.url, 'test-api-key');
          const response = await client.getExchangeRate(baseCode, targetCode, amount);

          expect(response.status).toBe(404);
          expect(response.data.result).toBe('error');
          expect(response.data['error-type']).toContain('unsupported-code');
        });
    });

    it('should return 401 for unauthorized request with invalid API key', async () => {
      const amount = 10;
      const baseCode = 'USD';
      const targetCode = 'HNL';

      await provider
        .addInteraction()
        .given('API key is invalid')
        .uponReceiving('a request with invalid API key')
        .withRequest(
          'GET',
          `/pair/${baseCode}/${targetCode}/${amount}`,
          (builder) => {
            builder.headers({ 'Authorization': 'Bearer invalid-key' });
          }
        )
        .willRespondWith(401, (builder) => {
          builder
            .headers({ 'Content-Type': 'application/json' })
            .jsonBody({
              result: 'error',
              'error-type': regex(/invalid-key/, 'invalid-key'),
            });
        })
        .executeTest(async (mockServer) => {
          const client = new ExchangeApiClient(mockServer.url, 'invalid-key');
          const response = await client.getExchangeRate(baseCode, targetCode, amount);

          expect(response.status).toBe(401);
          expect(response.data.result).toBe('error');
          expect(response.data['error-type']).toContain('invalid-key');
        });
    });

    it('should handle target currency code error', async () => {
      const amount = 10;
      const baseCode = 'USD';
      const targetCode = 'XYZ'; // Invalid target code

      await provider
        .addInteraction()
        .given('exchange rate data does not exist for invalid target currency')
        .uponReceiving('a request with invalid target currency code XYZ')
        .withRequest(
          'GET',
          `/pair/${baseCode}/${targetCode}/${amount}`,
          (builder) => {
            builder.headers({ 'Authorization': 'Bearer test-api-key' });
          }
        )
        .willRespondWith(404, (builder) => {
          builder
            .headers({ 'Content-Type': 'application/json' })
            .jsonBody({
              result: 'error',
              'error-type': regex(/unsupported-code/, 'unsupported-code'),
            });
        })
        .executeTest(async (mockServer) => {
          const client = new ExchangeApiClient(mockServer.url, 'test-api-key');
          const response = await client.getExchangeRate(baseCode, targetCode, amount);

          expect(response.status).toBe(404);
          expect(response.data.result).toBe('error');
          expect(response.data['error-type']).toContain('unsupported-code');
        });
    });
  });

  describe('Different Amount Scenarios', () => {
    it('should handle conversion with amount 1', async () => {
      const amount = 1;
      const baseCode = 'GBP';
      const targetCode = 'USD';

      await provider
        .addInteraction()
        .given('exchange rate data exists for GBP to USD')
        .uponReceiving('a request for GBP to USD exchange rate with amount 1')
        .withRequest(
          'GET',
          `/pair/${baseCode}/${targetCode}/${amount}`,
          (builder) => {
            builder.headers({ 'Authorization': 'Bearer test-api-key' });
          }
        )
        .willRespondWith(200, (builder) => {
          builder
            .headers({ 'Content-Type': 'application/json' })
            .jsonBody({
              result: 'success',
              documentation: string('https://www.exchangerate-api.com/docs'),
              terms_of_use: string('https://www.exchangerate-api.com/terms'),
              time_last_update_unix: integer(1705308000),
              time_last_update_utc: regex(
                /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} \+\d{4}$/,
                'Sun, 15 Jan 2026 00:00:00 +0000'
              ),
              time_next_update_unix: integer(1705394400),
              time_next_update_utc: regex(
                /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} \+\d{4}$/,
                'Mon, 16 Jan 2026 00:00:00 +0000'
              ),
              base_code: baseCode,
              target_code: targetCode,
              conversion_rate: decimal(1.27),
              conversion_result: decimal(1.27),
            });
        })
        .executeTest(async (mockServer) => {
          const client = new ExchangeApiClient(mockServer.url, 'test-api-key');
          const response = await client.getExchangeRate(baseCode, targetCode, amount);

          expect(response.status).toBe(200);
          expect(response.data.result).toBe('success');
          expect(response.data.base_code).toBe(baseCode);
          expect(response.data.target_code).toBe(targetCode);
        });
    });

    it('should handle conversion with large amount', async () => {
      const amount = 1000000;
      const baseCode = 'USD';
      const targetCode = 'JPY';

      await provider
        .addInteraction()
        .given('exchange rate data exists for USD to JPY')
        .uponReceiving('a request for USD to JPY exchange rate with large amount')
        .withRequest(
          'GET',
          `/pair/${baseCode}/${targetCode}/${amount}`,
          (builder) => {
            builder.headers({ 'Authorization': 'Bearer test-api-key' });
          }
        )
        .willRespondWith(200, (builder) => {
          builder
            .headers({ 'Content-Type': 'application/json' })
            .jsonBody({
              result: 'success',
              documentation: string('https://www.exchangerate-api.com/docs'),
              terms_of_use: string('https://www.exchangerate-api.com/terms'),
              time_last_update_unix: integer(1705308000),
              time_last_update_utc: regex(
                /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} \+\d{4}$/,
                'Sun, 15 Jan 2026 00:00:00 +0000'
              ),
              time_next_update_unix: integer(1705394400),
              time_next_update_utc: regex(
                /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} \+\d{4}$/,
                'Mon, 16 Jan 2026 00:00:00 +0000'
              ),
              base_code: baseCode,
              target_code: targetCode,
              conversion_rate: decimal(148.5),
              conversion_result: decimal(148500000),
            });
        })
        .executeTest(async (mockServer) => {
          const client = new ExchangeApiClient(mockServer.url, 'test-api-key');
          const response = await client.getExchangeRate(baseCode, targetCode, amount);

          expect(response.status).toBe(200);
          expect(response.data.result).toBe('success');
          expect(response.data.conversion_result).toBeGreaterThan(0);
        });
    });
  });
});
