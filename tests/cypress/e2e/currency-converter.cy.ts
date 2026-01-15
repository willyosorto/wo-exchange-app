/// <reference types="cypress" />

describe("Currency Converter", () => {
  it("loads the currency converter app properly", () => {
    cy.step("navigate to the main page");
    cy.visit("/");

    cy.verification("check the main title is visible");
    cy.get('[data-cy="exchange-title"]').should("exist").contains("Currency Converter");
  });

  it("allows selecting currencies, searching, and converting", () => {
    cy.intercept("GET", "**/pair/EUR/HNL/**").as("convertRequest");
    
    cy.step("navigate to the converter");
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      }
    });

    cy.step("select Euro as the from currency");
    cy.get('[data-cy="exchange-from-button"]').click();
    cy.get('[data-cy="from-country-search-input"]').type("Euro");
    cy.get('[data-cy="from-country-currency-eur"]').click();

    cy.step("select Honduras as the destination currency");
    cy.get('[data-cy="exchange-to-button"]').click();
    cy.get('[data-cy="to-country-search-input"]').type("Lempira");
    cy.get('[data-cy="to-country-currency-hnl"]').click();

    cy.wait("@convertRequest").then((interception) => {
      const apiResponse = interception.response?.body;
      const conversionRate = apiResponse.conversion_rate;

      cy.step("enter the amount to convert");
      cy.get('[data-cy="exchange-from-amount-input"]').clear().type("100");

      const expectedValue = (100 * conversionRate).toFixed(2);

      cy.verification("confirm the converted total uses the cached rate correctly");
      cy.get('[data-cy="exchange-to-amount-input"]').invoke("val").should("equal", expectedValue);

      cy.verification("validate the conversion rate matches the API response");
      cy.get('[data-cy="exchange-result"]')
        .should("contain", "EUR")
        .and("contain", "HNL")
        .and("contain", conversionRate.toFixed(4));
    });
  });

  it("swap country currencies", () => {
    cy.intercept("GET", "**/pair/USD/HNL/**").as("convertRequest");
    cy.intercept("GET", "**/pair/HNL/USD/**").as("swappedConvertRequest");
    
    cy.step("navigate to the converter");
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      }
    });

    cy.step("select US Dollar as the from currency");
    cy.get('[data-cy="exchange-from-button"]').click();
    cy.get('[data-cy="from-country-search-input"]').type("United States");
    cy.get('[data-cy="from-country-currency-usd"]').click();

    cy.step("select Honduras as the destination currency");
    cy.get('[data-cy="exchange-to-button"]').click();
    cy.get('[data-cy="to-country-search-input"]').type("Lempira");
    cy.get('[data-cy="to-country-currency-hnl"]').click();

    cy.wait("@convertRequest").then((interception) => {
      const apiResponse = interception.response?.body;
      const conversionRate = apiResponse.conversion_rate;

      cy.step("enter the amount to convert");
      cy.get('[data-cy="exchange-from-amount-input"]').clear().type("10");

      const expectedValue = (10 * conversionRate).toFixed(2);

      cy.verification("confirm the converted total uses the cached rate correctly");
      cy.get('[data-cy="exchange-to-amount-input"]').invoke("val").should("equal", expectedValue);

      cy.verification("validate the conversion rate matches the API response");
      cy.get('[data-cy="exchange-result"]')
        .should("contain", "USD")
        .and("contain", "HNL")
        .and("contain", conversionRate.toFixed(4));
    });

    cy.step("click in the swap button and call the api");
    cy.get('[data-cy="swap-exchange-button"]').click();

    cy.wait("@swappedConvertRequest").then((interception) => {
      const apiResponse = interception.response?.body;
      const conversionRate = apiResponse.conversion_rate;
      const expectedValue = (10 * conversionRate).toFixed(2);

      cy.verification("confirm the converted total matches the swapped API response");
      cy.get('[data-cy="exchange-to-amount-input"]').invoke("val").should("equal", expectedValue);

      cy.verification("validate the conversion rate displays the swapped currencies");
      cy.get('[data-cy="exchange-result"]')
        .should("contain", "HNL")
        .and("contain", "USD")
        .and("contain", `1 HNL = ${conversionRate.toFixed(4)} USD`);
    });
  });

  it("select same countries", () => {
    let amount = "25";
    cy.step("navigate to the converter");
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      }
    });

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


