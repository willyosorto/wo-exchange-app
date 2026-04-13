import { test, expect } from '@playwright/test';
import { Step, Verification, Log } from '../helpers/logger';
import { getDeviceLabel } from '../helpers/viewport';
import { CalculatorPage } from '../pages/CalculatorPage';
import { CurrencyConverterPage } from '../pages/CurrencyConverterPage';

test.describe('Calculator', () => {
  let device: string;

  test.beforeEach(async ({ page }) => {
    Log('Checking viewport to set device-specific test IDs');
    device = await getDeviceLabel(page);
  })

  test('loads the calculator app properly', async ({ page }) => {
    const calculator = new CalculatorPage(page);

    Step(device, 'Navigate to the main page and click the calculator button from the menu');
    await calculator.goto();

    Verification(device, 'Check the main title is visible');
    await expect(calculator.title).toBeVisible();
    await expect(calculator.title).toContainText('Calculator');
  });

  test('performs basic arithmetic operations', async ({ page }) => {
    const calculator = new CalculatorPage(page);
    await calculator.goto();

    Step(device, 'Enter 10 + 40 - 20');
    await calculator.clickDigit(1);
    await calculator.clickDigit(0);
    await calculator.clickAdd();
    await calculator.clickDigit(4);
    await calculator.clickDigit(0);
    await calculator.clickSubtract();
    await calculator.clickDigit(2);
    await calculator.clickDigit(0);
    await calculator.clickEquals();

    Verification(device, 'Check the result is 30');
    await expect(calculator.display).toContainText('30');

    Step(device, 'Multiply result by 2');
    await calculator.clickMultiply();
    await calculator.clickDigit(2);
    await calculator.clickEquals();

    Verification(device, 'Validate the result is 60');
    await expect(calculator.display).toContainText('60');

    Step(device, 'Divide result by 6');
    await calculator.clickDivide();
    await calculator.clickDigit(6);
    await calculator.clickEquals();

    Verification(device, 'Check the final result is 10');
    await expect(calculator.display).toContainText('10');
  });

  test('performs percentage calculations correctly', async ({ page }) => {
    const calculator = new CalculatorPage(page);

    Step(device, 'Navigate to the calculator');
    await calculator.goto();

    Step(device, `Calculate 100 + 50% (should be 150)`);
    await calculator.clickDigit(1);
    await calculator.clickDigit(0);
    await calculator.clickDigit(0);
    await calculator.clickAdd();
    await calculator.clickDigit(5);
    await calculator.clickDigit(0);
    await calculator.clickPercent();
    await calculator.clickEquals();

    Verification(device, 'Check the result is 150');
    await expect(calculator.display).toContainText('150');

    Step(device, 'Clear and calculate 200 - 25% (should be 150)');
    await calculator.clickClear();
    await calculator.clickDigit(2);
    await calculator.clickDigit(0);
    await calculator.clickDigit(0);
    await calculator.clickSubtract();
    await calculator.clickDigit(2);
    await calculator.clickDigit(5);
    await calculator.clickPercent();
    await calculator.clickEquals();

    Verification(device, 'Check the result is 150');
    await expect(calculator.display).toContainText('150');

    Step(device, 'Clear and calculate 50 × 20% (should be 10)');
    await calculator.clickClear();
    await calculator.clickDigit(5);
    await calculator.clickDigit(0);
    await calculator.clickMultiply();
    await calculator.clickDigit(2);
    await calculator.clickDigit(0);
    await calculator.clickPercent();
    await calculator.clickEquals();

    Verification(device, 'Check the result is 10');
    await expect(calculator.display).toContainText('10');
  });

  test('verifies backspace and clear button functionalities', async ({ page }) => {
    const calculator = new CalculatorPage(page);

    Step(device, 'Navigate to the calculator');
    await calculator.goto();

    Step(device, 'Enter 12345');
    await calculator.clickDigit(1);
    await calculator.clickDigit(2);
    await calculator.clickDigit(3);
    await calculator.clickDigit(4);
    await calculator.clickDigit(5);

    Verification(device, 'Check the display shows 12345');
    await expect(calculator.display).toContainText('12345');

    Step(device, 'Press backspace once');
    await calculator.clickDelete();

    Verification(device, 'Check the display shows 1234');
    await expect(calculator.display).toContainText('1234');

    Step(device, 'Press backspace three more times');
    await calculator.clickDelete();
    await calculator.clickDelete();
    await calculator.clickDelete();

    Verification(device, 'Check the display shows 1');
    await expect(calculator.display).toContainText('1');

    Step(device, 'Press backspace one more time');
    await calculator.clickDelete();

    Verification(device, 'Check the display shows 0 after deleting all digits');
    await expect(calculator.display).toContainText('0');

    Step(device, 'Enter 999 and an operation');
    await calculator.clickDigit(9);
    await calculator.clickDigit(9);
    await calculator.clickDigit(9);
    await calculator.clickAdd();
    await calculator.clickDigit(1);

    Verification(device, 'Check the operation is displayed');
    await expect(calculator.operation).toContainText('999 +');
    await expect(calculator.display).toContainText('1');

    Step(device, 'Press clear button');
    await calculator.clickClear();

    Verification(device, 'Check everything is cleared');
    await expect(calculator.display).toContainText('0');
    await expect(calculator.operation).not.toBeVisible();
  });

  test('validate the copy to clipboard and verify the number in the exchange converter', async ({ page }) => {
    const calculator = new CalculatorPage(page);
    const converter = new CurrencyConverterPage(page);

    Step(device, 'Navigate to the calculator');
    await calculator.goto();

    Step(device, 'Enter a calculation: 250 + 150');
    await calculator.clickDigit(2);
    await calculator.clickDigit(5);
    await calculator.clickDigit(0);
    await calculator.clickAdd();
    await calculator.clickDigit(1);
    await calculator.clickDigit(5);
    await calculator.clickDigit(0);
    await calculator.clickEquals();

    Verification(device, 'Check the result is 400');
    await expect(calculator.display).toContainText('400');

    Step(device, 'Copy the result to clipboard');
    await calculator.clickCopy();

    Step(device, 'Navigate to the exchange converter');
    await converter.navigateFromNav();

    Verification(device, 'Check the copied value is set to the from input');
    await expect(converter.fromAmountInput).toHaveValue('400');
  });
});
