import { test, expect } from '@playwright/test';
import { Step, Verification, Log } from '../helpers/logger';
import { isMobileViewport, getDeviceLabel } from '../helpers/viewport';

test.describe('Calculator', () => {
  let device: string;
  let calculatorButtonTestId: string;
  let exchangeButtonTestId: string;

  test.beforeEach(async ({ page }) => {
    Log('Checking viewport to set device-specific test IDs');
    device = await getDeviceLabel(page);
    const isMobile = await isMobileViewport(page);
    calculatorButtonTestId = isMobile ? 'mobile-calculator-button' : 'desktop-calculator-button';
    exchangeButtonTestId = isMobile ? 'mobile-converter-button' : 'desktop-converter-button';
  })

  test('loads the calculator app properly', async ({ page }) => {
    Step(device, 'Navigate to the main page and click the calculator button from the menu');
    await page.goto('/');
    await page.getByTestId(calculatorButtonTestId).click();

    Verification(device, 'Check the main title is visible');
    const title = page.getByTestId('calculator-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Calculator');
  });

  test('performs basic arithmetic operations', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId(calculatorButtonTestId).click();

    Step(device, 'Enter 10 + 40 - 20');
    await page.getByTestId('calculator-1').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-add').click();
    await page.getByTestId('calculator-4').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-subtract').click();
    await page.getByTestId('calculator-2').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-equals').click();

    Verification(device, 'Check the result is 30');
    const display = page.getByTestId('calculator-display');
    await expect(display).toContainText('30');

    Step(device, 'Multiply result by 2');
    await page.getByTestId('calculator-multiply').click();
    await page.getByTestId('calculator-2').click();
    await page.getByTestId('calculator-equals').click();

    Verification(device, 'Validate the result is 60');
    await expect(display).toContainText('60');

    Step(device, 'Divide result by 6');
    await page.getByTestId('calculator-divide').click();
    await page.getByTestId('calculator-6').click();
    await page.getByTestId('calculator-equals').click();

    Verification(device, 'Check the final result is 10');
    await expect(display).toContainText('10');
  });

  test('performs percentage calculations correctly', async ({ page }) => {
    Step(device, 'Navigate to the calculator');
    await page.goto('/');
    await page.getByTestId(calculatorButtonTestId).click();

    const display = page.getByTestId('calculator-display');

    Step(device, `Calculate 100 + 50% (should be 150)`);
    await page.getByTestId('calculator-1').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-add').click();
    await page.getByTestId('calculator-5').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-percent').click();
    await page.getByTestId('calculator-equals').click();

    Verification(device, 'Check the result is 150');
    await expect(display).toContainText('150');

    Step(device, 'Clear and calculate 200 - 25% (should be 150)');
    await page.getByTestId('calculator-clear').click();
    await page.getByTestId('calculator-2').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-subtract').click();
    await page.getByTestId('calculator-2').click();
    await page.getByTestId('calculator-5').click();
    await page.getByTestId('calculator-percent').click();
    await page.getByTestId('calculator-equals').click();

    Verification(device, 'Check the result is 150');
    await expect(display).toContainText('150');

    Step(device, 'Clear and calculate 50 × 20% (should be 10)');
    await page.getByTestId('calculator-clear').click();
    await page.getByTestId('calculator-5').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-multiply').click();
    await page.getByTestId('calculator-2').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-percent').click();
    await page.getByTestId('calculator-equals').click();

    Verification(device, 'Check the result is 10');
    await expect(display).toContainText('10');
  });

  test('verifies backspace and clear button functionalities', async ({ page }) => {
    Step(device, 'Navigate to the calculator');
    await page.goto('/');
    await page.getByTestId(calculatorButtonTestId).click();

    const display = page.getByTestId('calculator-display');

    Step(device, 'Enter 12345');
    await page.getByTestId('calculator-1').click();
    await page.getByTestId('calculator-2').click();
    await page.getByTestId('calculator-3').click();
    await page.getByTestId('calculator-4').click();
    await page.getByTestId('calculator-5').click();

    Verification(device, 'Check the display shows 12345');
    await expect(display).toContainText('12345');

    Step(device, 'Press backspace once');
    await page.getByTestId('calculator-delete').click();

    Verification(device, 'Check the display shows 1234');
    await expect(display).toContainText('1234');

    Step(device, 'Press backspace three more times');
    await page.getByTestId('calculator-delete').click();
    await page.getByTestId('calculator-delete').click();
    await page.getByTestId('calculator-delete').click();

    Verification(device, 'Check the display shows 1');
    await expect(display).toContainText('1');

    Step(device, 'Press backspace one more time');
    await page.getByTestId('calculator-delete').click();

    Verification(device, 'Check the display shows 0 after deleting all digits');
    await expect(display).toContainText('0');

    Step(device, 'Enter 999 and an operation');
    await page.getByTestId('calculator-9').click();
    await page.getByTestId('calculator-9').click();
    await page.getByTestId('calculator-9').click();
    await page.getByTestId('calculator-add').click();
    await page.getByTestId('calculator-1').click();

    Verification(device, 'Check the operation is displayed');
    const operation = page.getByTestId('calculator-operation');
    await expect(operation).toContainText('999 +');
    await expect(display).toContainText('1');

    Step(device, 'Press clear button');
    await page.getByTestId('calculator-clear').click();

    Verification(device, 'Check everything is cleared');
    await expect(display).toContainText('0');
    await expect(operation).not.toBeVisible();
  });

  test('validate the copy to clipboard and verify the number in the exchange converter', async ({ page }) => {
    Step(device, 'Navigate to the calculator');
    await page.goto('/');
    await page.getByTestId(calculatorButtonTestId).click();

    Step(device, 'Enter a calculation: 250 + 150');
    await page.getByTestId('calculator-2').click();
    await page.getByTestId('calculator-5').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-add').click();
    await page.getByTestId('calculator-1').click();
    await page.getByTestId('calculator-5').click();
    await page.getByTestId('calculator-0').click();
    await page.getByTestId('calculator-equals').click();

    Verification(device, 'Check the result is 400');
    const display = page.getByTestId('calculator-display');
    await expect(display).toContainText('400');

    Step(device, 'Copy the result to clipboard');
    await page.getByTestId('calculator-copy').click();

    Step(device, 'Navigate to the exchange converter');
    await page.getByTestId(exchangeButtonTestId).click();

    Verification(device, 'Check the copied value is set to the from input');
    const fromInput = page.getByTestId('exchange-from-amount-input');
    await expect(fromInput).toHaveValue('400');
  });
});
