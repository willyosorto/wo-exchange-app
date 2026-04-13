/// <reference types="cypress" />
import { CurrencyConverterPage } from '../pages/CurrencyConverterPage';

describe("Currency Converter", () => {
  it("loads the currency converter app properly", () => {
    const converter = new CurrencyConverterPage();

    cy.step("navigate to the main page");
    converter.goto();

    cy.verification("check the main title is visible");
    converter.title.should("exist").contains("Currency Converter");
  });

  it("allows selecting currencies, searching, and converting", () => {
    const converter = new CurrencyConverterPage();
    cy.intercept("GET", "**/pair/EUR/HNL/**").as("convertRequest");

    cy.step("navigate to the converter");
    converter.goto();

    cy.step("select Euro as the from currency");
    converter.openFromCurrencyPicker();
    converter.searchFromCurrency("Euro");
    converter.selectFromCurrency("eur");

    cy.step("select Honduras as the destination currency");
    converter.openToCurrencyPicker();
    converter.searchToCurrency("Lempira");
    converter.selectToCurrency("hnl");

    cy.wait("@convertRequest").then((interception) => {
      const apiResponse = interception.response?.body;
      const conversionRate = apiResponse.conversion_rate;

      cy.step("enter the amount to convert");
      converter.fillFromAmount("100");

      const expectedValue = (100 * conversionRate).toFixed(2);

      cy.verification("confirm the converted total uses the cached rate correctly");
      converter.toAmountInput.invoke("val").should("equal", expectedValue);

      cy.verification("validate the conversion rate matches the API response");
      converter.exchangeResult
        .should("contain", "EUR")
        .and("contain", "HNL")
        .and("contain", conversionRate.toFixed(4));
    });
  });

  it("swap country currencies", () => {
    const converter = new CurrencyConverterPage();
    cy.intercept("GET", "**/pair/USD/HNL/**").as("convertRequest");
    cy.intercept("GET", "**/pair/HNL/USD/**").as("swappedConvertRequest");

    cy.step("navigate to the converter");
    converter.goto();

    cy.step("select US Dollar as the from currency");
    converter.openFromCurrencyPicker();
    converter.searchFromCurrency("United States");
    converter.selectFromCurrency("usd");

    cy.step("select Honduras as the destination currency");
    converter.openToCurrencyPicker();
    converter.searchToCurrency("Lempira");
    converter.selectToCurrency("hnl");

    cy.wait("@convertRequest").then((interception) => {
      const apiResponse = interception.response?.body;
      const conversionRate = apiResponse.conversion_rate;

      cy.step("enter the amount to convert");
      converter.fillFromAmount("10");

      const expectedValue = (10 * conversionRate).toFixed(2);

      cy.verification("confirm the converted total uses the cached rate correctly");
      converter.toAmountInput.invoke("val").should("equal", expectedValue);

      cy.verification("validate the conversion rate matches the API response");
      converter.exchangeResult
        .should("contain", "USD")
        .and("contain", "HNL")
        .and("contain", conversionRate.toFixed(4));
    });

    cy.step("click in the swap button and call the api");
    converter.clickSwap();

    cy.wait("@swappedConvertRequest").then((interception) => {
      const apiResponse = interception.response?.body;
      const conversionRate = apiResponse.conversion_rate;
      const expectedValue = (10 * conversionRate).toFixed(2);

      cy.verification("confirm the converted total matches the swapped API response");
      converter.toAmountInput.invoke("val").should("equal", expectedValue);

      cy.verification("validate the conversion rate displays the swapped currencies");
      converter.exchangeResult
        .should("contain", "HNL")
        .and("contain", "USD")
        .and("contain", `1 HNL = ${conversionRate.toFixed(4)} USD`);
    });
  });

  it("select same countries", () => {
    const converter = new CurrencyConverterPage();
    const amount = "25";

    cy.step("navigate to the converter");
    converter.goto();

    cy.step("select Japanese Yen as the from currency");
    converter.openFromCurrencyPicker();
    converter.searchFromCurrency("Japan");
    converter.selectFromCurrency("jpy");

    cy.step("select Japanese Yen as the destination currency");
    converter.openToCurrencyPicker();
    converter.searchToCurrency("Japan");
    converter.selectToCurrency("jpy");

    cy.step("enter the amount to convert");
    converter.fillFromAmount(amount);

    cy.verification("validate the conversion rate in the correct one");
    converter.toAmountInput.invoke("val").then((value) => {
      expect(Number(value)).to.equal(Number(amount));
    });
    converter.exchangeResult.should("exist").contains(`1 JPY = 1.0000 JPY`);
  });
});


