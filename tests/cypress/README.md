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

## Best Practices

1. **Use data-cy attributes**: All interactive elements use `data-cy` for stable selectors
2. **Wait for API calls**: Use `cy.wait('@aliasName')` after intercepts
3. **Clipboard handling**: CI environments use mocked clipboard API
4. **Video optimization**: Videos auto-delete on passing tests
5. **Mobile-first**: Default viewport is mobile (390x844)
6. **Real API testing**: Tests use actual API with environment variables
