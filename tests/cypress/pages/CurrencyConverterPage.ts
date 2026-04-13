export class CurrencyConverterPage {
  // --- Selectors ---

  get title() {
    return cy.get('[data-cy="exchange-title"]');
  }

  get fromCurrencyButton() {
    return cy.get('[data-cy="exchange-from-button"]');
  }

  get toCurrencyButton() {
    return cy.get('[data-cy="exchange-to-button"]');
  }

  get fromSearchInput() {
    return cy.get('[data-cy="from-country-search-input"]');
  }

  get toSearchInput() {
    return cy.get('[data-cy="to-country-search-input"]');
  }

  fromCurrencyOption(code: string) {
    return cy.get(`[data-cy="from-country-currency-${code.toLowerCase()}"]`);
  }

  toCurrencyOption(code: string) {
    return cy.get(`[data-cy="to-country-currency-${code.toLowerCase()}"]`);
  }

  get fromAmountInput() {
    return cy.get('[data-cy="exchange-from-amount-input"]');
  }

  get toAmountInput() {
    return cy.get('[data-cy="exchange-to-amount-input"]');
  }

  get exchangeResult() {
    return cy.get('[data-cy="exchange-result"]');
  }

  get swapButton() {
    return cy.get('[data-cy="swap-exchange-button"]');
  }

  // --- Actions ---

  goto(): void {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  }

  openFromCurrencyPicker(): void {
    cy.get('[data-cy="exchange-from-button"]').click();
  }

  searchFromCurrency(query: string): void {
    cy.get('[data-cy="from-country-search-input"]').type(query);
  }

  selectFromCurrency(code: string): void {
    cy.get(`[data-cy="from-country-currency-${code.toLowerCase()}"]`).click();
  }

  openToCurrencyPicker(): void {
    cy.get('[data-cy="exchange-to-button"]').click();
  }

  searchToCurrency(query: string): void {
    cy.get('[data-cy="to-country-search-input"]').type(query);
  }

  selectToCurrency(code: string): void {
    cy.get(`[data-cy="to-country-currency-${code.toLowerCase()}"]`).click();
  }

  fillFromAmount(amount: string): void {
    cy.get('[data-cy="exchange-from-amount-input"]').clear().type(amount);
  }

  clickSwap(): void {
    cy.get('[data-cy="swap-exchange-button"]').click();
  }
}
