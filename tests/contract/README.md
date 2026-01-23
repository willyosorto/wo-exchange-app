# Contract Testing with Pact.js

This directory contains contract tests for the external Exchange Rate API using Pact.js.

## Overview

Contract testing ensures that the consumer (our application) and the provider (Exchange Rate API) maintain compatibility through defined contracts. Pact generates these contracts based on actual API interactions.

## Directory Structure

```
tests/contract/
├── consumer/              # Consumer contract tests
│   └── exchange.pact.spec.ts
├── helpers/               # Helper utilities
│   ├── apiClient.ts      # API client wrapper
│   └── pactSetup.ts      # Pact configuration
├── logs/                  # Pact test logs
├── pacts/                 # Generated pact files (contracts)
├── setup.ts               # Test setup file
└── README.md             # This file
```

## Running Contract Tests

### Run all contract tests
```bash
yarn test:contract:pact
```

### Run tests in watch mode
```bash
yarn test:contract:pact:watch
```

### Run tests with verbose output
```bash
yarn test:contract:pact:verbose
```

## Test Coverage

The contract tests cover:

### ✅ Successful Scenarios
- USD to HNL exchange rate conversion
- EUR to USD exchange rate conversion
- GBP to USD exchange rate with amount 1
- USD to JPY exchange rate with large amounts

### ❌ Error Scenarios
- Invalid currency code (404 error)
- Unauthorized request with invalid API key (401 error)
- Invalid target currency code error

## Contract Generated

After running the tests, a Pact file will be generated in `tests/pact/pacts/` directory:
- `wo-exchange-app-exchange-rate-api.json`

This contract file can be shared with the API provider to verify their implementation matches our expectations.

## Key Features

- **Consumer-Driven**: Tests are written from the consumer's perspective
- **Type-Safe**: Uses TypeScript interfaces for request/response validation
- **Flexible Matchers**: Uses Pact matchers (like, term, integer) for flexible matching
- **Isolated**: Runs against a mock provider server, no real API calls needed
- **Documentation**: Generated contracts serve as living documentation

## Understanding Matchers

- `like()`: Matches the type, not the exact value
- `term()`: Matches against a regular expression pattern
- `integer()`: Matches integer numbers
- Exact values: For critical fields like currency codes

## Provider Verification

The provider (Exchange Rate API) can verify these contracts using:
- Pact Broker (recommended for sharing contracts)
- Direct file sharing of generated JSON contracts
- Provider verification tests

## Resources

- [Pact.js Documentation](https://docs.pact.io/)
- [Contract Testing Guide](https://pactflow.io/how-pact-works/)
- [Exchange Rate API Docs](https://www.exchangerate-api.com/docs)
