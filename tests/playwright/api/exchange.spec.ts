import { test, expect } from '@playwright/test';
import { Step, Verification } from '../helpers/logger';

test.describe('Exchange API', () => {
    const apiKey = process.env.VITE_EXCHANGE_API_KEY;
    const apiUrl = process.env.VITE_EXCHANGE_API_URL;

    test('status 200: success request for an exchange from USD to HNL', async ({ request }) => {
        const amount = 10;
        
        Step('API', `Making GET request to ${apiUrl}/pair/USD/HNL/${amount}`);
        const response = await request.get(`${apiUrl}/pair/USD/HNL/${amount}`, {
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        });

        Verification('API', 'Check response status is 200');
        expect(response.status()).toBe(200);

        const body = await response.json();

        Verification('API', 'Check response body contains all required keys');
        expect(body).toHaveProperty('result');
        expect(body).toHaveProperty('documentation');
        expect(body).toHaveProperty('terms_of_use');
        expect(body).toHaveProperty('time_last_update_unix');
        expect(body).toHaveProperty('time_last_update_utc');
        expect(body).toHaveProperty('time_next_update_unix');
        expect(body).toHaveProperty('time_next_update_utc');
        expect(body).toHaveProperty('base_code');
        expect(body).toHaveProperty('target_code');
        expect(body).toHaveProperty('conversion_rate');
        expect(body).toHaveProperty('conversion_result');

        Verification('API', 'Check response values are correct');
        expect(body.result).toBe('success');
        expect(body.base_code).toBe('USD');
        expect(body.target_code).toBe('HNL');
        expect(body.conversion_rate).toBeGreaterThan(0);
        expect(typeof body.conversion_rate).toBe('number');
        
        const expectedResult = body.conversion_rate * amount;
        expect(body.conversion_result).toBeCloseTo(expectedResult, 4);
    });

    test('status 401: unauthorized request for using an invalid API key', async ({ request }) => {
        Step('API', `Making GET request with invalid API key to ${apiUrl}/pair/USD/HNL/1`);
        const response = await request.get(`${apiUrl}/pair/USD/HNL/1`, {
            headers: { Authorization: 'Bearer invalid-key' },
            failOnStatusCode: false,
        });

        Verification('API', 'Check response status is 401 or 403');
        const status = response.status();
        expect([401, 403]).toContain(status);

        const body = await response.json();

        Verification('API', 'Check response body indicates error');
        expect(body).toHaveProperty('result');
        expect(body).toHaveProperty('error-type');
        expect(body.result).not.toBe('success');
    });

    test('status 404: invalid request for an incorrect currency code', async ({ request }) => {
        Step('API', `Making GET request with invalid currency code to ${apiUrl}/pair/UZD/HNL/1`);
        const response = await request.get(`${apiUrl}/pair/UZD/HNL/1`, {
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
            failOnStatusCode: false,
        });

        Verification('API', 'Check response status is 404');
        expect(response.status()).toBe(404);

        const body = await response.json();

        Verification('API', 'Check response body indicates unsupported code error');
        expect(body).toHaveProperty('result');
        expect(body).toHaveProperty('error-type');
        expect(body.result).not.toBe('success');
        expect(body['error-type']).toMatch(/unsupported-code/i);
    });
});
