/// <reference types="cypress" />

describe("Calculator", () => {
  it("loads the calculator app properly", () => {
    cy.step("navigate to the main page and click the calculator button from the menu");
    cy.visit("/");
    cy.get('[data-cy="mobile-calculator-button"]').click();

    cy.verification("check the main title is visible");
    cy.get('[data-cy="calculator-title"]').should("exist").contains("Calculator");
  });

  it("performs basic arithmetic operations", () => {
    cy.step("navigate to the calculator");
    cy.visit("/");
    cy.get('[data-cy="mobile-calculator-button"]').click();

    cy.step("enter 10 + 40 - 20");
    cy.get('[data-cy="calculator-1"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-add"]').click();
    cy.get('[data-cy="calculator-4"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-subtract"]').click();
    cy.get('[data-cy="calculator-2"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-equals"]').click();

    cy.verification("check the result is 30");
    cy.get('[data-cy="calculator-display"]').should("contain", "30");

    cy.step("multiply result by 2");
    cy.get('[data-cy="calculator-multiply"]').click();
    cy.get('[data-cy="calculator-2"]').click();
    cy.get('[data-cy="calculator-equals"]').click();

    cy.verification("validate the result is 60");
    cy.get('[data-cy="calculator-display"]').should("contain", "60");

    cy.step("divide result by 6");
    cy.get('[data-cy="calculator-divide"]').click();
    cy.get('[data-cy="calculator-6"]').click();
    cy.get('[data-cy="calculator-equals"]').click();

    cy.verification("check the final result is 10");
    cy.get('[data-cy="calculator-display"]').should("contain", "10");
  });

  it("performs percentage calculations correctly", () => {
    cy.step("navigate to the calculator");
    cy.visit("/");
    cy.get('[data-cy="mobile-calculator-button"]').click();

    cy.step("calculate 100 + 50% (should be 150)");
    cy.get('[data-cy="calculator-1"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-add"]').click();
    cy.get('[data-cy="calculator-5"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-percent"]').click();
    cy.get('[data-cy="calculator-equals"]').click();

    cy.verification("check the result is 150");
    cy.get('[data-cy="calculator-display"]').should("contain", "150");

    cy.step("clear and calculate 200 - 25% (should be 150)");
    cy.get('[data-cy="calculator-clear"]').click();
    cy.get('[data-cy="calculator-2"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-subtract"]').click();
    cy.get('[data-cy="calculator-2"]').click();
    cy.get('[data-cy="calculator-5"]').click();
    cy.get('[data-cy="calculator-percent"]').click();
    cy.get('[data-cy="calculator-equals"]').click();

    cy.verification("check the result is 150");
    cy.get('[data-cy="calculator-display"]').should("contain", "150");

    cy.step("clear and calculate 50 × 20% (should be 10)");
    cy.get('[data-cy="calculator-clear"]').click();
    cy.get('[data-cy="calculator-5"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-multiply"]').click();
    cy.get('[data-cy="calculator-2"]').click();
    cy.get('[data-cy="calculator-0"]').click();
    cy.get('[data-cy="calculator-percent"]').click();
    cy.get('[data-cy="calculator-equals"]').click();

    cy.verification("check the result is 10");
    cy.get('[data-cy="calculator-display"]').should("contain", "10");
  });

  it("verifies backspace and clear button functionalities", () => {
    cy.step("navigate to the calculator");
    cy.visit("/");
    cy.get('[data-cy="mobile-calculator-button"]').click();

    cy.step("enter 12345");
    cy.get('[data-cy="calculator-1"]').click();
    cy.get('[data-cy="calculator-2"]').click();
    cy.get('[data-cy="calculator-3"]').click();
    cy.get('[data-cy="calculator-4"]').click();
    cy.get('[data-cy="calculator-5"]').click();

    cy.verification("check the display shows 12345");
    cy.get('[data-cy="calculator-display"]').should("contain", "12345");

    cy.step("press backspace once");
    cy.get('[data-cy="calculator-delete"]').click();

    cy.verification("check the display shows 1234");
    cy.get('[data-cy="calculator-display"]').should("contain", "1234");

    cy.step("press backspace three more times");
    cy.get('[data-cy="calculator-delete"]').click();
    cy.get('[data-cy="calculator-delete"]').click();
    cy.get('[data-cy="calculator-delete"]').click();

    cy.verification("check the display shows 1");
    cy.get('[data-cy="calculator-display"]').should("contain", "1");

    cy.step("press backspace one more time");
    cy.get('[data-cy="calculator-delete"]').click();

    cy.verification("check the display shows 0 after deleting all digits");
    cy.get('[data-cy="calculator-display"]').should("contain", "0");

    cy.step("enter 999 and an operation");
    cy.get('[data-cy="calculator-9"]').click();
    cy.get('[data-cy="calculator-9"]').click();
    cy.get('[data-cy="calculator-9"]').click();
    cy.get('[data-cy="calculator-add"]').click();
    cy.get('[data-cy="calculator-1"]').click();

    cy.verification("check the operation is displayed");
    cy.get('[data-cy="calculator-operation"]').should("contain", "999 +");
    cy.get('[data-cy="calculator-display"]').should("contain", "1");

    cy.step("press clear button");
    cy.get('[data-cy="calculator-clear"]').click();

    cy.verification("check everything is cleared");
    cy.get('[data-cy="calculator-display"]').should("contain", "0");
    cy.get('[data-cy="calculator-operation"]').should("not.exist");
  });


  it.only("validate the copy to clipboard and verify the number in the exchange converter", () => {
      cy.step("navigate to the calculator");
      cy.visit("/");
      cy.get('[data-cy="mobile-calculator-button"]').click();
      
      cy.step("enter a calculation: 250 + 150");
      cy.get('[data-cy="calculator-2"]').click();
      cy.get('[data-cy="calculator-5"]').click();
      cy.get('[data-cy="calculator-0"]').click();
      cy.get('[data-cy="calculator-add"]').click();
      cy.get('[data-cy="calculator-1"]').click();
      cy.get('[data-cy="calculator-5"]').click();
      cy.get('[data-cy="calculator-0"]').click();
      cy.get('[data-cy="calculator-equals"]').click();
      
      cy.verification("check the result is 400");
      cy.get('[data-cy="calculator-display"]').should("contain", "400");
      
      cy.step("copy the result to clipboard");
      cy.get('[data-cy="calculator-copy"]').click();
      
      cy.step("navigate to the exchange converter");
      cy.get('[data-cy="mobile-converter-button"]').click();
      
      cy.verification("check the copied value is set to the from input");
      cy.get('[data-cy="exchange-from-amount-input"]').should("have.value", "400");
  });
});


