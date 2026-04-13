export class CalculatorPage {
  // --- Selectors ---

  get title() {
    return cy.get('[data-cy="calculator-title"]');
  }

  get display() {
    return cy.get('[data-cy="calculator-display"]');
  }

  get operation() {
    return cy.get('[data-cy="calculator-operation"]');
  }

  // --- Actions ---

  goto(): void {
    cy.visit('/');
    cy.get('[data-cy="mobile-calculator-button"]').click();
  }

  navigateToConverter(): void {
    cy.get('[data-cy="mobile-converter-button"]').click();
  }

  clickDigit(digit: number): void {
    cy.get(`[data-cy="calculator-${digit}"]`).click();
  }

  clickAdd(): void {
    cy.get('[data-cy="calculator-add"]').click();
  }

  clickSubtract(): void {
    cy.get('[data-cy="calculator-subtract"]').click();
  }

  clickMultiply(): void {
    cy.get('[data-cy="calculator-multiply"]').click();
  }

  clickDivide(): void {
    cy.get('[data-cy="calculator-divide"]').click();
  }

  clickEquals(): void {
    cy.get('[data-cy="calculator-equals"]').click();
  }

  clickPercent(): void {
    cy.get('[data-cy="calculator-percent"]').click();
  }

  clickClear(): void {
    cy.get('[data-cy="calculator-clear"]').click();
  }

  clickDelete(): void {
    cy.get('[data-cy="calculator-delete"]').click();
  }

  clickCopy(): void {
    cy.get('[data-cy="calculator-copy"]').click();
  }
}
