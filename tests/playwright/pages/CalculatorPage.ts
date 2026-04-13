import { Page, Locator } from '@playwright/test';
import { isMobileViewport } from '../helpers/viewport';

export class CalculatorPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Selectors ---

  get title(): Locator {
    return this.page.getByTestId('calculator-title');
  }

  get display(): Locator {
    return this.page.getByTestId('calculator-display');
  }

  get operation(): Locator {
    return this.page.getByTestId('calculator-operation');
  }

  get addButton(): Locator {
    return this.page.getByTestId('calculator-add');
  }

  get subtractButton(): Locator {
    return this.page.getByTestId('calculator-subtract');
  }

  get multiplyButton(): Locator {
    return this.page.getByTestId('calculator-multiply');
  }

  get divideButton(): Locator {
    return this.page.getByTestId('calculator-divide');
  }

  get equalsButton(): Locator {
    return this.page.getByTestId('calculator-equals');
  }

  get percentButton(): Locator {
    return this.page.getByTestId('calculator-percent');
  }

  get clearButton(): Locator {
    return this.page.getByTestId('calculator-clear');
  }

  get deleteButton(): Locator {
    return this.page.getByTestId('calculator-delete');
  }

  get copyButton(): Locator {
    return this.page.getByTestId('calculator-copy');
  }

  // --- Actions ---

  async goto(): Promise<void> {
    const isMobile = await isMobileViewport(this.page);
    const navButtonId = isMobile ? 'mobile-calculator-button' : 'desktop-calculator-button';
    await this.page.goto('/');
    await this.page.getByTestId(navButtonId).click();
  }

  async clickDigit(digit: number): Promise<void> {
    await this.page.getByTestId(`calculator-${digit}`).click();
  }

  async clickAdd(): Promise<void> {
    await this.addButton.click();
  }

  async clickSubtract(): Promise<void> {
    await this.subtractButton.click();
  }

  async clickMultiply(): Promise<void> {
    await this.multiplyButton.click();
  }

  async clickDivide(): Promise<void> {
    await this.divideButton.click();
  }

  async clickEquals(): Promise<void> {
    await this.equalsButton.click();
  }

  async clickPercent(): Promise<void> {
    await this.percentButton.click();
  }

  async clickClear(): Promise<void> {
    await this.clearButton.click();
  }

  async clickDelete(): Promise<void> {
    await this.deleteButton.click();
  }

  async clickCopy(): Promise<void> {
    await this.copyButton.click();
  }
}
