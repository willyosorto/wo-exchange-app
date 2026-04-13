# Playwright End-to-End Tests

This directory contains comprehensive E2E and contract validation tests using Playwright.

## Overview

Playwright tests ensure the application works correctly from a user's perspective across multiple browsers and devices. Tests are organized into API tests, E2E tests, and contract validation tests.

## Directory Structure

```
tests/playwright/
├── api/                   # API integration tests
│   └── exchange.spec.ts
├── contract/              # Contract validation tests
│   └── currency-converter-contract.spec.ts
├── e2e/                   # End-to-end UI tests
│   ├── calculator.spec.ts
│   └── currency-converter.spec.ts
├── helpers/               # Test utilities
│   ├── logger.ts
│   └── viewport.ts
└── reports/               # Test reports (generated)
    ├── html/
    ├── json/
    └── junit/
```

## Running Tests

### Run all E2E tests (excluding contract tests)
```bash
yarn test:e2e:playwright:run
```

### Run tests in UI mode (interactive)
```bash
yarn test:e2e:playwright:ui
```

### Run tests in debug mode
```bash
yarn test:e2e:playwright:debug
```

### Run contract validation tests
```bash
yarn test:contract:validation
```

### View HTML report
```bash
yarn test:e2e:playwright:report
```

## Test Coverage

### API Tests
- ✅ USD to HNL conversion
- ✅ EUR to USD conversion
- ✅ Response structure validation
- ✅ Error handling (invalid currency, unauthorized)

### E2E Tests - Calculator
- ✅ Basic arithmetic operations (addition, subtraction, multiplication, division)
- ✅ Clear button functionality
- ✅ Decimal point handling
- ✅ Error handling (division by zero)
- ✅ Tested on Desktop Chrome and Mobile Chrome (Pixel 7)

### E2E Tests - Currency Converter
- ✅ Default state (USD to HNL with amount 1)
- ✅ Currency selection from dropdown
- ✅ Amount input validation
- ✅ Real-time conversion updates
- ✅ Exchange rate display
- ✅ Copy result to clipboard
- ✅ Swap currencies functionality
- ✅ Tested on Desktop Chrome and Mobile Chrome (Pixel 7)

### Contract Validation Tests
- ✅ USD/HNL/10 conversion using Pact contract
- ✅ EUR/USD/100 conversion using Pact contract
- ✅ GBP/USD/1 conversion using Pact contract
- ✅ USD/JPY/1000000 conversion using Pact contract
- Uses Pact stub server to validate against consumer contracts
- Intercepts network requests to ensure contract compliance

## Configuration

Tests are configured in `playwright.config.ts`:
- **Base URL**: http://localhost:3000
- **Browsers**: Chromium
- **Retries**: 2 on CI, 0 locally
- **Workers**: 1 on CI (to avoid resource contention)
- **Web Server**: Automatically starts dev server before tests
- **Reporters**: HTML, JSON, JUnit

## Projects

Tests are organized into separate projects:
- **API Tests**: API-level integration tests
- **Contract Tests**: Contract validation against Pact stub server
- **Desktop Chrome**: E2E tests on desktop viewport
- **Mobile Chrome**: E2E tests on mobile viewport (Pixel 7)

## CI/CD Integration

Playwright tests run automatically in GitHub Actions:
- `.github/workflows/playwright.yml` - E2E tests
- `.github/workflows/contract-tests.yml` - Contract validation tests

### CI Configuration
- Uses Node.js 22
- Installs Chromium with dependencies
- Runs on ubuntu-latest
- Publishes test results to PR
- Uploads screenshots, videos, and reports as artifacts
- Contract tests use Docker Compose for Pact stub server

## Page Object Model (POM)

All E2E tests follow the **Page Object Model** pattern to keep test logic clean, reusable, and maintainable. Page classes live in `tests/playwright/pages/`.

### Structure

```
tests/playwright/pages/
├── CalculatorPage.ts         # Calculator UI interactions
└── CurrencyConverterPage.ts  # Currency Converter UI interactions
```

Each page class encapsulates:
- **Locators** as `get` properties using `data-testid` attributes
- **Action methods** for user interactions (click, fill, navigate)

### CalculatorPage

```typescript
import { CalculatorPage } from '../pages/CalculatorPage';

const calculator = new CalculatorPage(page);

// Navigation
await calculator.goto();             // Visits '/' and clicks the calculator nav button

// Locators
calculator.title                     // [data-testid="calculator-title"]
calculator.display                   // [data-testid="calculator-display"]
calculator.operation                 // [data-testid="calculator-operation"]

// Actions
await calculator.clickDigit(5);      // Clicks digit button by number
await calculator.clickAdd();         // Clicks '+' operator
await calculator.clickSubtract();    // Clicks '-' operator
await calculator.clickMultiply();    // Clicks '×' operator
await calculator.clickDivide();      // Clicks '÷' operator
await calculator.clickEquals();      // Clicks '='
await calculator.clickPercent();     // Clicks '%'
await calculator.clickClear();       // Clicks 'C'
await calculator.clickDelete();      // Clicks backspace
await calculator.clickCopy();        // Copies display value to clipboard
```

### CurrencyConverterPage

```typescript
import { CurrencyConverterPage } from '../pages/CurrencyConverterPage';

const converter = new CurrencyConverterPage(page);

// Navigation
await converter.goto();              // Visits '/' and clears localStorage
await converter.navigateFromNav();   // Clicks the converter nav button (viewport-aware)

// Locators
converter.title                      // [data-testid="exchange-title"]
converter.fromAmountInput            // [data-testid="exchange-from-amount-input"]
converter.toAmountInput              // [data-testid="exchange-to-amount-input"]
converter.fromCurrencyButton         // [data-testid="exchange-from-button"]
converter.toCurrencyButton           // [data-testid="exchange-to-button"]
converter.swapButton                 // [data-testid="swap-exchange-button"]
converter.exchangeResult             // [data-testid="exchange-result"]

// Actions
await converter.openFromCurrencyPicker();        // Opens 'from' currency dropdown
await converter.searchFromCurrency('USD');       // Types in the 'from' search input
await converter.selectFromCurrency('usd');       // Clicks a 'from' currency option
await converter.openToCurrencyPicker();          // Opens 'to' currency dropdown
await converter.searchToCurrency('HNL');         // Types in the 'to' search input
await converter.selectToCurrency('hnl');         // Clicks a 'to' currency option
await converter.fillFromAmount('100');           // Fills the amount input
await converter.clickSwap();                     // Clicks the swap button
```

### Viewport-Aware Navigation

The `goto()` method in `CalculatorPage` and `navigateFromNav()` in `CurrencyConverterPage` automatically resolve the correct nav button based on viewport width, using the `isMobileViewport` helper:

```typescript
// helpers/viewport.ts
const isMobile = await isMobileViewport(page);
const navButtonId = isMobile ? 'mobile-calculator-button' : 'desktop-calculator-button';
await page.getByTestId(navButtonId).click();
```

This ensures the same test file runs correctly on both Desktop Chrome and Mobile Chrome (Pixel 7) projects without any branching logic in the specs.

### Usage in Tests

```typescript
test('performs basic arithmetic', async ({ page }) => {
  const calculator = new CalculatorPage(page);
  await calculator.goto();

  await calculator.clickDigit(1);
  await calculator.clickDigit(0);
  await calculator.clickAdd();
  await calculator.clickDigit(5);
  await calculator.clickEquals();

  await expect(calculator.display).toContainText('15');
});
```

## Best Practices

1. **Page Object Model**: All selectors and actions are encapsulated in page classes — never hard-code locators in spec files
2. **data-testid selectors**: Page objects use `getByTestId()` with `data-testid` attributes for stability
3. **Viewport-aware actions**: Use `isMobileViewport()` helper for nav interactions that differ by device
4. **Wait for API responses**: Always use `page.waitForResponse()` before triggering actions
5. **Clear cache**: Use `localStorage.clear()` in contract tests to ensure clean state
6. **Handle timing**: Set up response promises before triggering actions to avoid race conditions
7. **Mobile testing**: Always test responsive behavior on mobile viewports
