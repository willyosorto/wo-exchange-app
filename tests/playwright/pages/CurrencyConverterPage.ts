import { Page, Locator } from '@playwright/test';
import { isMobileViewport } from '../helpers/viewport';

export class CurrencyConverterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Selectors ---

  get title(): Locator {
    return this.page.getByTestId('exchange-title');
  }

  get fromCurrencyButton(): Locator {
    return this.page.getByTestId('exchange-from-button');
  }

  get toCurrencyButton(): Locator {
    return this.page.getByTestId('exchange-to-button');
  }

  get fromSearchInput(): Locator {
    return this.page.getByTestId('from-country-search-input');
  }

  get toSearchInput(): Locator {
    return this.page.getByTestId('to-country-search-input');
  }

  fromCurrencyOption(code: string): Locator {
    return this.page.getByTestId(`from-country-currency-${code.toLowerCase()}`);
  }

  toCurrencyOption(code: string): Locator {
    return this.page.getByTestId(`to-country-currency-${code.toLowerCase()}`);
  }

  get fromAmountInput(): Locator {
    return this.page.getByTestId('exchange-from-amount-input');
  }

  get toAmountInput(): Locator {
    return this.page.getByTestId('exchange-to-amount-input');
  }

  get exchangeResult(): Locator {
    return this.page.getByTestId('exchange-result');
  }

  get swapButton(): Locator {
    return this.page.getByTestId('swap-exchange-button');
  }

  // --- Actions ---

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.evaluate(() => localStorage.clear());
  }

  async navigateFromNav(): Promise<void> {
    const isMobile = await isMobileViewport(this.page);
    const navButtonId = isMobile ? 'mobile-converter-button' : 'desktop-converter-button';
    await this.page.getByTestId(navButtonId).click();
  }

  async openFromCurrencyPicker(): Promise<void> {
    await this.fromCurrencyButton.click();
  }

  async searchFromCurrency(query: string): Promise<void> {
    await this.fromSearchInput.fill(query);
  }

  async selectFromCurrency(code: string): Promise<void> {
    await this.fromCurrencyOption(code).click();
  }

  async openToCurrencyPicker(): Promise<void> {
    await this.toCurrencyButton.click();
  }

  async searchToCurrency(query: string): Promise<void> {
    await this.toSearchInput.fill(query);
  }

  async selectToCurrency(code: string): Promise<void> {
    await this.toCurrencyOption(code).click();
  }

  async fillFromAmount(amount: string): Promise<void> {
    await this.fromAmountInput.fill(amount);
  }

  async clickSwap(): Promise<void> {
    await this.swapButton.click();
  }
}
