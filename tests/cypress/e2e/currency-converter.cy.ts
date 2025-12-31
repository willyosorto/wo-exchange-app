/// <reference types="cypress" />

describe("Currency Converter", () => {
  it("loads the currency converter app properly", () => {
    cy.step("navigate to the main page");
    cy.visit("/");

    cy.verification("check the main title is visible");
    cy.get('[data-cy="exchange-title"]').should("exist").contains("Currency Converter");
  });

  it("allows selecting currencies, searching, and converting", () => {
    cy.step("navigate to the converter");
    cy.visit("/");

    cy.step("select Euro as the from currency");
    cy.get('[data-cy="exchange-from-button"]').click();
    cy.get('[data-cy="from-country-search-input"]').type("Euro");
    cy.get('[data-cy="from-country-currency-eur"]').click();

    cy.step("select Honduras as the destination currency");
    cy.get('[data-cy="exchange-to-button"]').click();
    cy.get('[data-cy="to-country-search-input"]').type("Lempira");
    cy.get('[data-cy="to-country-currency-hnl"]').click();

    cy.step("enter the amount to convert");
    cy.intercept("GET", "**/pair/EUR/HNL/100**").as("convertRequest");
    cy.get('[data-cy="exchange-from-amount-input"]').clear().type("100");

    cy.wait("@convertRequest").then((interception) => {
      const expectedValue = interception.response?.body?.conversion_result;

      cy.verification("confirm the converted total and displayed rate");
      cy.get('[data-cy="exchange-to-amount-input"]').invoke("val").then((value) => {
        expect(Number(value)).to.equal(expectedValue);
      });
    });

    cy.verification("validate the currencies are presents in the conversion rate");
    cy.get('[data-cy="exchange-result"]').should("contain", "EUR").and("contain", "HNL");
  });

  it("swap country currencies", () => {
    cy.step("navigate to the converter");
    cy.visit("/");

    cy.step("select US Dollar as the from currency");
    cy.get('[data-cy="exchange-from-button"]').click();
    cy.get('[data-cy="from-country-search-input"]').type("United States");
    cy.get('[data-cy="from-country-currency-usd"]').click();

    cy.step("select Honduras as the destination currency");
    cy.get('[data-cy="exchange-to-button"]').click();
    cy.get('[data-cy="to-country-search-input"]').type("Lempira");
    cy.get('[data-cy="to-country-currency-hnl"]').click();

    cy.step("enter the amount to convert");
    cy.intercept("GET", "**/pair/USD/HNL/10**").as("convertRequest");
    cy.get('[data-cy="exchange-from-amount-input"]').clear().type("10");

    cy.wait("@convertRequest").then((interception) => {
      const expectedValue = interception.response?.body?.conversion_result;

      cy.verification("confirm the converted total and displayed rate");
      cy.get('[data-cy="exchange-to-amount-input"]').invoke("val").then((value) => {
        expect(Number(value)).to.equal(Number(expectedValue.toFixed(2)));
      });
    });

    cy.verification("check that the currencies are present in the conversion rate");
    cy.get('[data-cy="exchange-result"]').should("contain", "USD").and("contain", "HNL");

    cy.step("click in the swap button and call the api");
    cy.get('[data-cy="swap-exchange-button"]').click();
    cy.intercept("GET", "**/pair/HNL/USD/10**").as("swappedConvertRequest");

    cy.wait("@swappedConvertRequest").then((interception) => {
      const expectedValue = interception.response?.body?.conversion_result;

      cy.verification("confirm the converted total and displayed rate");
      cy.get('[data-cy="exchange-to-amount-input"]').invoke("val").then((value) => {
        expect(Number(value)).to.equal(Number(expectedValue.toFixed(2)));
      });

      cy.verification("validate the conversion rate in the correct one");
      cy.get('[data-cy="exchange-result"]').should("exist").contains(`1 HNL = ${interception.response?.body?.conversion_rate.toFixed(4)} USD`);
    });
  });

  it("select same countries", () => {
    let amount = "25";
    cy.step("navigate to the converter");
    cy.visit("/");

    cy.step("select Japanese Yen as the from currency");
    cy.get('[data-cy="exchange-from-button"]').click();
    cy.get('[data-cy="from-country-search-input"]').type("Japan");
    cy.get('[data-cy="from-country-currency-jpy"]').click();

    cy.step("select Japanese Yen as the destination currency");
    cy.get('[data-cy="exchange-to-button"]').click();
    cy.get('[data-cy="to-country-search-input"]').type("Japan");
    cy.get('[data-cy="to-country-currency-jpy"]').click();

    cy.step("enter the amount to convert");
    cy.get('[data-cy="exchange-from-amount-input"]').clear().type(amount);

    cy.verification("validate the conversion rate in the correct one");
    cy.get('[data-cy="exchange-to-amount-input"]').invoke("val").then((value) => {
      expect(Number(value)).to.equal(Number(amount));
    });
    cy.get('[data-cy="exchange-result"]').should("exist").contains(`1 JPY = 1.0000 JPY`);
  });
});


