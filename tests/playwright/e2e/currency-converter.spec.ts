import { test, expect } from '@playwright/test';
import { Step, Verification, Log } from '../helpers/logger';
import { getDeviceLabel } from '../helpers/viewport';
import { CurrencyConverterPage } from '../pages/CurrencyConverterPage';

test.describe('Currency Converter', () => {
    let device: string;

    test.beforeEach(async ({ page }) => {
        Log('Checking viewport to set device-specific test IDs');
        device = await getDeviceLabel(page);
    });

    test('loads the currency converter app properly', async ({ page }) => {
        const converter = new CurrencyConverterPage(page);

        Step(device, 'Navigate to the main page');
        await converter.goto();

        Verification(device, 'Check the main title is visible');
        await expect(converter.title).toBeVisible();
        await expect(converter.title).toContainText('Currency Converter');
    });

    test('allows selecting currencies, searching, and converting', async ({ page }) => {
        const converter = new CurrencyConverterPage(page);

        Step(device, 'Navigate to the converter');
        await converter.goto();

        Step(device, 'Select Euro as the from currency');
        await converter.openFromCurrencyPicker();
        await converter.searchFromCurrency('Euro');
        await converter.selectFromCurrency('eur');

        Step(device, 'Select Honduras as the destination currency');
        const initialResponsePromise = page.waitForResponse(response =>
            response.url().includes('/pair/EUR/HNL/') && response.status() === 200,
            { timeout: 10000 }
        );
        await converter.openToCurrencyPicker();
        await converter.searchToCurrency('Lempira');
        await converter.selectToCurrency('hnl');

        const initialResponse = await initialResponsePromise;
        const initialResponseBody = await initialResponse.json();
        const conversionRate = initialResponseBody.conversion_rate;

        Step(device, 'Enter the amount to convert');
        await converter.fillFromAmount('100');
        const expectedValue = (100 * conversionRate).toFixed(2);

        Verification(device, 'Confirm the converted total uses the cached rate correctly');
        const toAmountValue = await converter.toAmountInput.inputValue();
        expect(toAmountValue).toBe(expectedValue);

        Verification(device, 'Validate the currencies are presents in the conversion rate');
        await expect(converter.exchangeResult).toContainText('EUR');
        await expect(converter.exchangeResult).toContainText('HNL');
    });

    test('swap country currencies', async ({ page }) => {
        const converter = new CurrencyConverterPage(page);

        Step(device, 'Navigate to the converter');
        await converter.goto();

        Step(device, 'Select US Dollar as the from currency');
        await converter.openFromCurrencyPicker();
        await converter.searchFromCurrency('United States');
        const initialResponsePromise = page.waitForResponse(response =>
            response.url().includes('/pair/USD/HNL/') && response.status() === 200,
            { timeout: 10000 }
        );
        await converter.selectFromCurrency('usd');

        Step(device, 'Select Honduras as the destination currency');
        await converter.openToCurrencyPicker();
        await converter.searchToCurrency('Lempira');
        await converter.selectToCurrency('hnl');

        const initialResponse = await initialResponsePromise;
        const initialResponseBody = await initialResponse.json();
        const conversionRate = initialResponseBody.conversion_rate;

        Step(device, 'Enter the amount to convert');
        await converter.fillFromAmount('10');
        const expectedValue = (10 * conversionRate).toFixed(2);

        Verification(device, 'Confirm the converted total uses the cached rate correctly');
        let toAmountValue = await converter.toAmountInput.inputValue();
        expect(Number(toAmountValue)).toBe(Number(expectedValue));

        Verification(device, 'Check that the currencies are present in the conversion rate');
        await expect(converter.exchangeResult).toContainText('USD');
        await expect(converter.exchangeResult).toContainText('HNL');

        Step(device, 'Click in the swap button and call the api');
        const swappedResponsePromise = page.waitForResponse(response =>
            response.url().includes('/pair/HNL/USD/') && response.status() === 200,
            { timeout: 10000 }
        );
        await converter.clickSwap();
        const swappedResponse = await swappedResponsePromise;
        const swappedResponseBody = await swappedResponse.json();
        const swappedConversionRate = swappedResponseBody.conversion_rate;
        const swappedExpectedValue = (10 * swappedConversionRate).toFixed(2);

        Verification(device, 'Confirm the converted total matches the swapped API response');
        toAmountValue = await converter.toAmountInput.inputValue();
        expect(Number(toAmountValue)).toBe(Number(swappedExpectedValue));

        Verification(device, 'Validate the conversion rate displays the swapped currencies');
        await expect(converter.exchangeResult).toBeVisible();
        await expect(converter.exchangeResult).toContainText(`1 HNL = ${swappedConversionRate.toFixed(4)} USD`);
    });

    test('select same countries', async ({ page }) => {
        const converter = new CurrencyConverterPage(page);
        const amount = '25';

        Step(device, 'Navigate to the converter');
        await converter.goto();

        Step(device, 'Select Japanese Yen as the from currency');
        await converter.openFromCurrencyPicker();
        await converter.searchFromCurrency('Japan');
        await converter.selectFromCurrency('jpy');

        Step(device, 'Select Japanese Yen as the destination currency');
        await converter.openToCurrencyPicker();
        await converter.searchToCurrency('Japan');
        await converter.selectToCurrency('jpy');

        Step(device, 'Enter the amount to convert');
        await converter.fillFromAmount(amount);

        Verification(device, 'Validate the conversion rate in the correct one');
        const toAmountValue = await converter.toAmountInput.inputValue();
        expect(Number(toAmountValue)).toBe(Number(amount));

        await expect(converter.exchangeResult).toBeVisible();
        await expect(converter.exchangeResult).toContainText('1 JPY = 1.0000 JPY');
    });
});
