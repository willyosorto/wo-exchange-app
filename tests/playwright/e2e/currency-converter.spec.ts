import { test, expect } from '@playwright/test';
import { Step, Verification, Log } from '../helpers/logger';
import { getDeviceLabel } from '../helpers/viewport';

test.describe('Currency Converter', () => {
    let device: string;

    test.beforeEach(async ({ page }) => {
        Log('Checking viewport to set device-specific test IDs');
        device = await getDeviceLabel(page);
    });

    test('loads the currency converter app properly', async ({ page }) => {
        Step(device, 'Navigate to the main page');
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        Verification(device, 'Check the main title is visible');
        const title = page.getByTestId('exchange-title');
        await expect(title).toBeVisible();
        await expect(title).toContainText('Currency Converter');
    });

    test('allows selecting currencies, searching, and converting', async ({ page }) => {
        Step(device, 'Navigate to the converter');
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        Step(device, 'Select Euro as the from currency');
        await page.getByTestId('exchange-from-button').click();
        await page.getByTestId('from-country-search-input').fill('Euro');
        await page.getByTestId('from-country-currency-eur').click();

        Step(device, 'Select Honduras as the destination currency');
        // Set up the wait BEFORE clicking to select the destination currency
        const initialResponsePromise = page.waitForResponse(response =>
            response.url().includes('/pair/EUR/HNL/') && response.status() === 200,
            { timeout: 10000 }
        );
        await page.getByTestId('exchange-to-button').click();
        await page.getByTestId('to-country-search-input').fill('Lempira');
        await page.getByTestId('to-country-currency-hnl').click();

        // Wait for the initial API call when currencies are selected (amount=1)
        const initialResponse = await initialResponsePromise;
        const initialResponseBody = await initialResponse.json();
        const conversionRate = initialResponseBody.conversion_rate;

        Step(device, 'Enter the amount to convert');
        await page.getByTestId('exchange-from-amount-input').fill('100');

        // Calculate expected value using the cached rate
        const expectedValue = (100 * conversionRate).toFixed(2);

        Verification(device, 'Confirm the converted total uses the cached rate correctly');
        const toAmountValue = await page.getByTestId('exchange-to-amount-input').inputValue();
        expect(toAmountValue).toBe(expectedValue);

        Verification(device, 'Validate the currencies are presents in the conversion rate');
        const exchangeResult = page.getByTestId('exchange-result');
        await expect(exchangeResult).toContainText('EUR');
        await expect(exchangeResult).toContainText('HNL');
    });

    test('swap country currencies', async ({ page }) => {
        Step(device, 'Navigate to the converter');
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        Step(device, 'Select US Dollar as the from currency');
        await page.getByTestId('exchange-from-button').click();
        await page.getByTestId('from-country-search-input').fill('United States');
        await page.getByTestId('from-country-currency-usd').click();

        // Set up the wait BEFORE clicking to select the destination currency
        const initialResponsePromise = page.waitForResponse(response =>
            response.url().includes('/pair/USD/HNL/') && response.status() === 200,
            { timeout: 10000 }
        );

        Step(device, 'Select Honduras as the destination currency');
        await page.getByTestId('exchange-to-button').click();
        await page.getByTestId('to-country-search-input').fill('Lempira');
        await page.getByTestId('to-country-currency-hnl').click();

        // Wait for the initial API call when currencies are selected (amount=1)
        const initialResponse = await initialResponsePromise;
        const initialResponseBody = await initialResponse.json();
        const conversionRate = initialResponseBody.conversion_rate;

        Step(device, 'Enter the amount to convert');
        await page.getByTestId('exchange-from-amount-input').fill('10');

        // Calculate expected value using the cached rate
        const expectedValue = (10 * conversionRate).toFixed(2);

        Verification(device, 'Confirm the converted total uses the cached rate correctly');
        let toAmountValue = await page.getByTestId('exchange-to-amount-input').inputValue();
        expect(Number(toAmountValue)).toBe(Number(expectedValue));

        Verification(device, 'Check that the currencies are present in the conversion rate');
        const exchangeResult = page.getByTestId('exchange-result');
        await expect(exchangeResult).toContainText('USD');
        await expect(exchangeResult).toContainText('HNL');

        Step(device, 'Click in the swap button and call the api');
        const swappedResponsePromise = page.waitForResponse(response =>
            response.url().includes('/pair/HNL/USD/') && response.status() === 200,
            { timeout: 10000 }
        );
        await page.getByTestId('swap-exchange-button').click();

        const swappedResponse = await swappedResponsePromise;
        const swappedResponseBody = await swappedResponse.json();
        const swappedConversionRate = swappedResponseBody.conversion_rate;
        const swappedExpectedValue = (10 * swappedConversionRate).toFixed(2);

        Verification(device, 'Confirm the converted total matches the swapped API response');
        toAmountValue = await page.getByTestId('exchange-to-amount-input').inputValue();
        expect(Number(toAmountValue)).toBe(Number(swappedExpectedValue));

        Verification(device, 'Validate the conversion rate displays the swapped currencies');
        await expect(exchangeResult).toBeVisible();
        await expect(exchangeResult).toContainText(`1 HNL = ${swappedConversionRate.toFixed(4)} USD`);
    });

    test('select same countries', async ({ page }) => {
        const amount = '25';

        Step(device, 'Navigate to the converter');
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        Step(device, 'Select Japanese Yen as the from currency');
        await page.getByTestId('exchange-from-button').click();
        await page.getByTestId('from-country-search-input').fill('Japan');
        await page.getByTestId('from-country-currency-jpy').click();

        Step(device, 'Select Japanese Yen as the destination currency');
        await page.getByTestId('exchange-to-button').click();
        await page.getByTestId('to-country-search-input').fill('Japan');
        await page.getByTestId('to-country-currency-jpy').click();

        Step(device, 'Enter the amount to convert');
        await page.getByTestId('exchange-from-amount-input').fill(amount);

        Verification(device, 'Validate the conversion rate in the correct one');
        const toAmountValue = await page.getByTestId('exchange-to-amount-input').inputValue();
        expect(Number(toAmountValue)).toBe(Number(amount));

        const exchangeResult = page.getByTestId('exchange-result');
        await expect(exchangeResult).toBeVisible();
        await expect(exchangeResult).toContainText('1 JPY = 1.0000 JPY');
    });
});
