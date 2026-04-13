# Cypress End-to-End Tests

This directory contains comprehensive E2E and API integration tests using Cypress.

## Overview

Cypress tests provide fast, reliable testing for the currency exchange application with real-time browser automation and excellent debugging capabilities. Tests cover both UI interactions and API endpoints.

## Directory Structure

```
tests/cypress/
├── api/                   # API integration tests
│   └── exchange.cy.ts
├── e2e/                   # End-to-end UI tests
│   ├── calculator.cy.ts
│   └── currency-converter.cy.ts
├── fixtures/              # Test data
│   └── example.json
├── helpers/               # Test utilities
│   └── merger.ts          # JUnit report merger
├── support/               # Custom commands and setup
│   ├── commands.ts
│   └── e2e.ts            # Global setup (clipboard mock)
├── downloads/             # Downloaded files (generated)
├── screenshots/           # Screenshots on failure (generated)
├── videos/                # Test recordings (generated)
└── reports/               # Test reports (generated)
    ├── mochawesome/
    └── junit/
```

## Running Tests

### Run all tests
```bash
yarn test:e2e:cypress:run
```

### Open Cypress UI (interactive mode)
```bash
yarn test:e2e:cypress:open
```

### Generate combined reports
```bash
# Merge Mochawesome reports
yarn test:e2e:cypress:mochawesome:merge

# Generate HTML from merged reports
yarn test:e2e:cypress:mochawesome:html

# Merge JUnit reports
yarn test:e2e:cypress:junit:merge
```

## Test Coverage

### API Tests
- ✅ USD to HNL conversion with real API
- ✅ EUR to USD conversion with real API
- ✅ Response structure validation
- ✅ Rate caching validation
- ✅ Error handling (invalid currency codes)

### E2E Tests - Calculator
- ✅ Basic arithmetic operations
- ✅ Clear and decimal handling
- ✅ Division by zero error handling
- ✅ Keyboard input support
- ✅ Display updates in real-time

### E2E Tests - Currency Converter
- ✅ Default state verification (USD to HNL)
- ✅ Amount input and validation
- ✅ Currency dropdown selection
- ✅ Real-time conversion updates
- ✅ Exchange rate display
- ✅ Copy to clipboard functionality
- ✅ Swap currencies feature
- ✅ Conversion history tracking
- ✅ Cache behavior validation

## Configuration

Tests are configured in `cypress.config.ts`:
- **Base URL**: http://localhost:3000
- **Viewport**: 390x844 (mobile-first)
- **Videos**: Auto-deleted on passing tests
- **Screenshots**: Captured on failures
- **Spec Pattern**: `tests/cypress/{e2e,api}/**/*.cy.{ts,tsx}`

### Environment Variables
- `VITE_EXCHANGE_API_KEY`: API key for exchange rate service
- `VITE_EXCHANGE_API_URL`: API base URL

## Reporters

Cypress uses multiple reporters for comprehensive test reporting:

### Mochawesome
- HTML reports with screenshots and videos
- Charts and statistics
- Detailed test results
- Located in: `tests/cypress/reports/mochawesome/html/`

### JUnit
- XML format for CI/CD integration
- Compatible with GitHub Actions test result publishers
- Merged reports in: `tests/cypress/reports/junit/final-results.xml`

## CI/CD Integration

Cypress tests run automatically in GitHub Actions:
- `.github/workflows/cypress.yml`

### CI Configuration
- Uses Node.js 22
- Installs dependencies with frozen lockfile
- Waits for dev server on http://localhost:3000
- Runs tests with Cypress GitHub Action
- Publishes test results to PR
- Uploads screenshots (on failure), videos, and reports as artifacts
- Auto-deletes videos for passing tests to save space

## Custom Commands

The test suite includes custom Cypress commands for common operations:

```typescript
// Wait for API response and validate
cy.intercept('GET', '**/pair/**').as('apiCall');
cy.wait('@apiCall');

// Clipboard mock (for CI environments)
cy.window().then((win) => {
  win.navigator.clipboard.writeText('test');
});
```

## Page Object Model (POM)

All E2E tests follow the **Page Object Model** pattern to keep test logic clean, reusable, and maintainable. Page classes live in `tests/cypress/pages/`.

### Structure

```
tests/cypress/pages/
├── CalculatorPage.ts         # Calculator UI interactions
└── CurrencyConverterPage.ts  # Currency Converter UI interactions
```

Each page class encapsulates:
- **Locators** as `get` properties using `data-cy` attributes
- **Action methods** for user interactions (click, type, visit)

### CalculatorPage

```typescript
import { CalculatorPage } from '../pages/CalculatorPage';

const calculator = new CalculatorPage();

// Navigation
calculator.goto();               // Visits '/' and clicks the mobile calculator nav button

// Locators
calculator.title                 // [data-cy="calculator-title"]
calculator.display               // [data-cy="calculator-display"]
calculator.operation             // [data-cy="calculator-operation"]

// Actions
calculator.clickDigit(5);        // Clicks digit button by number
calculator.clickAdd();           // Clicks '+' operator
calculator.clickSubtract();      // Clicks '-' operator
calculator.clickMultiply();      // Clicks '×' operator
calculator.clickDivide();        // Clicks '÷' operator
calculator.clickEquals();        // Clicks '='
calculator.clickPercent();       // Clicks '%'
calculator.clickClear();         // Clicks 'C'
calculator.clickDelete();        // Clicks backspace
calculator.clickCopy();          // Copies display value to clipboard
calculator.navigateToConverter(); // Clicks the mobile converter nav button
```

### CurrencyConverterPage

```typescript
import { CurrencyConverterPage } from '../pages/CurrencyConverterPage';

const converter = new CurrencyConverterPage();

// Navigation
converter.goto();                // Visits '/' and clears localStorage via onBeforeLoad

// Locators
converter.title                  // [data-cy="exchange-title"]
converter.fromAmountInput        // [data-cy="exchange-from-amount-input"]
converter.toAmountInput          // [data-cy="exchange-to-amount-input"]
converter.fromCurrencyButton     // [data-cy="exchange-from-button"]
converter.toCurrencyButton       // [data-cy="exchange-to-button"]
converter.swapButton             // [data-cy="swap-exchange-button"]
converter.exchangeResult         // [data-cy="exchange-result"]

// Actions
converter.openFromCurrencyPicker();        // Clicks the 'from' currency button
converter.searchFromCurrency('USD');       // Types in 'from' currency search input
converter.selectFromCurrency('usd');       // Clicks a 'from' currency option
converter.openToCurrencyPicker();          // Clicks the 'to' currency button
converter.searchToCurrency('HNL');         // Types in 'to' currency search input
converter.selectToCurrency('hnl');         // Clicks a 'to' currency option
converter.fillFromAmount('100');           // Types in the amount input
converter.clickSwap();                     // Clicks the swap button
```

### Usage in Tests

```typescript
import { CalculatorPage } from '../pages/CalculatorPage';

const calculator = new CalculatorPage();

it('performs basic arithmetic', () => {
  calculator.goto();
  calculator.clickDigit(1);
  calculator.clickDigit(0);
  calculator.clickAdd();
  calculator.clickDigit(5);
  calculator.clickEquals();
  calculator.display.should('contain.text', '15');
});
```

## Best Practices

1. **Page Object Model**: All selectors and actions are encapsulated in page classes — never hard-code selectors in spec files
2. **data-cy selectors**: Page objects use `[data-cy]` attributes for stable, test-only selectors that won't conflict with `data-testid`
3. **Wait for API calls**: Use `cy.wait('@aliasName')` after intercepts
4. **Clipboard handling**: CI environments use mocked clipboard API defined in `support/e2e.ts`
5. **Video optimization**: Videos auto-delete on passing tests
6. **Mobile-first**: Default viewport is mobile (390x844)
7. **Real API testing**: Tests use actual API with environment variables
