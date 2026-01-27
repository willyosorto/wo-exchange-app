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

## Best Practices

1. **Wait for API responses**: Always use `page.waitForResponse()` before triggering actions
2. **Clear cache**: Use `localStorage.clear()` in contract tests to ensure clean state
3. **Use role-based selectors**: Prefer `getByRole()` over CSS selectors for better accessibility
4. **Handle timing**: Set up response promises before triggering actions to avoid race conditions
5. **Mobile testing**: Always test responsive behavior on mobile viewports
