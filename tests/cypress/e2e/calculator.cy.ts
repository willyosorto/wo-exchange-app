/// <reference types="cypress" />
import { CalculatorPage } from '../pages/CalculatorPage';
import { CurrencyConverterPage } from '../pages/CurrencyConverterPage';

describe("Calculator", () => {
  it("loads the calculator app properly", () => {
    const calculator = new CalculatorPage();

    cy.step("navigate to the main page and click the calculator button from the menu");
    calculator.goto();

    cy.verification("check the main title is visible");
    calculator.title.should("exist").contains("Calculator");
  });

  it("performs basic arithmetic operations", () => {
    const calculator = new CalculatorPage();

    cy.step("navigate to the calculator");
    calculator.goto();

    cy.step("enter 10 + 40 - 20");
    calculator.clickDigit(1);
    calculator.clickDigit(0);
    calculator.clickAdd();
    calculator.clickDigit(4);
    calculator.clickDigit(0);
    calculator.clickSubtract();
    calculator.clickDigit(2);
    calculator.clickDigit(0);
    calculator.clickEquals();

    cy.verification("check the result is 30");
    calculator.display.should("contain", "30");

    cy.step("multiply result by 2");
    calculator.clickMultiply();
    calculator.clickDigit(2);
    calculator.clickEquals();

    cy.verification("validate the result is 60");
    calculator.display.should("contain", "60");

    cy.step("divide result by 6");
    calculator.clickDivide();
    calculator.clickDigit(6);
    calculator.clickEquals();

    cy.verification("check the final result is 10");
    calculator.display.should("contain", "10");
  });

  it("performs percentage calculations correctly", () => {
    const calculator = new CalculatorPage();

    cy.step("navigate to the calculator");
    calculator.goto();

    cy.step("calculate 100 + 50% (should be 150)");
    calculator.clickDigit(1);
    calculator.clickDigit(0);
    calculator.clickDigit(0);
    calculator.clickAdd();
    calculator.clickDigit(5);
    calculator.clickDigit(0);
    calculator.clickPercent();
    calculator.clickEquals();

    cy.verification("check the result is 150");
    calculator.display.should("contain", "150");

    cy.step("clear and calculate 200 - 25% (should be 150)");
    calculator.clickClear();
    calculator.clickDigit(2);
    calculator.clickDigit(0);
    calculator.clickDigit(0);
    calculator.clickSubtract();
    calculator.clickDigit(2);
    calculator.clickDigit(5);
    calculator.clickPercent();
    calculator.clickEquals();

    cy.verification("check the result is 150");
    calculator.display.should("contain", "150");

    cy.step("clear and calculate 50 × 20% (should be 10)");
    calculator.clickClear();
    calculator.clickDigit(5);
    calculator.clickDigit(0);
    calculator.clickMultiply();
    calculator.clickDigit(2);
    calculator.clickDigit(0);
    calculator.clickPercent();
    calculator.clickEquals();

    cy.verification("check the result is 10");
    calculator.display.should("contain", "10");
  });

  it("verifies backspace and clear button functionalities", () => {
    const calculator = new CalculatorPage();

    cy.step("navigate to the calculator");
    calculator.goto();

    cy.step("enter 12345");
    calculator.clickDigit(1);
    calculator.clickDigit(2);
    calculator.clickDigit(3);
    calculator.clickDigit(4);
    calculator.clickDigit(5);

    cy.verification("check the display shows 12345");
    calculator.display.should("contain", "12345");

    cy.step("press backspace once");
    calculator.clickDelete();

    cy.verification("check the display shows 1234");
    calculator.display.should("contain", "1234");

    cy.step("press backspace three more times");
    calculator.clickDelete();
    calculator.clickDelete();
    calculator.clickDelete();

    cy.verification("check the display shows 1");
    calculator.display.should("contain", "1");

    cy.step("press backspace one more time");
    calculator.clickDelete();

    cy.verification("check the display shows 0 after deleting all digits");
    calculator.display.should("contain", "0");

    cy.step("enter 999 and an operation");
    calculator.clickDigit(9);
    calculator.clickDigit(9);
    calculator.clickDigit(9);
    calculator.clickAdd();
    calculator.clickDigit(1);

    cy.verification("check the operation is displayed");
    calculator.operation.should("contain", "999 +");
    calculator.display.should("contain", "1");

    cy.step("press clear button");
    calculator.clickClear();

    cy.verification("check everything is cleared");
    calculator.display.should("contain", "0");
    calculator.operation.should("not.exist");
  });

  it("validate the copy to clipboard and verify the number in the exchange converter", () => {
    const calculator = new CalculatorPage();
    const converter = new CurrencyConverterPage();

    cy.step("navigate to the calculator");
    calculator.goto();

    cy.step("enter a calculation: 250 + 150");
    calculator.clickDigit(2);
    calculator.clickDigit(5);
    calculator.clickDigit(0);
    calculator.clickAdd();
    calculator.clickDigit(1);
    calculator.clickDigit(5);
    calculator.clickDigit(0);
    calculator.clickEquals();

    cy.verification("check the result is 400");
    calculator.display.should("contain", "400");

    cy.step("copy the result to clipboard");
    calculator.clickCopy();

    cy.step("navigate to the exchange converter");
    calculator.navigateToConverter();

    cy.verification("check the copied value is set to the from input");
    converter.fromAmountInput.should("have.value", "400");
  });
});


