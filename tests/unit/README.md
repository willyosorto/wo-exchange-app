# Unit Tests

This directory contains unit tests for React components using Vitest and React Testing Library.

## Overview

Unit tests validate individual components in isolation, ensuring they render correctly, handle user interactions, and manage state properly. Tests use Vitest for fast execution and React Testing Library for user-centric testing.

## Directory Structure

```
tests/unit/
├── Calculator.test.tsx           # Calculator component tests
├── CurrencyConverter.test.tsx    # Currency converter tests
└── reports/                       # Coverage reports (generated)
    └── coverage/
        ├── index.html            # HTML coverage report
        ├── coverage-summary.json
        └── [coverage files]
```

## Running Tests

### Run all tests
```bash
yarn test
```

### Run tests in watch mode
```bash
yarn test
# or
yarn test:run
```

### Run tests with UI
```bash
yarn test:ui
```

### Run tests with coverage
```bash
yarn test:coverage
```

## Test Coverage

### Calculator Component (97.61% coverage)
- ✅ Renders with initial state (0)
- ✅ Number input (0-9)
- ✅ Decimal point handling
- ✅ Basic operations (+, -, ×, ÷)
- ✅ Equals calculation
- ✅ Clear functionality (C)
- ✅ All Clear functionality (AC)
- ✅ Error handling (division by zero)
- ✅ Multiple decimal points prevention
- ✅ Operator chaining
- ✅ Negative numbers

### Currency Converter Component (97.22% coverage)
- ✅ Renders with default currencies (USD → HNL)
- ✅ Default amount display
- ✅ Currency dropdown interactions
- ✅ Currency selection (EUR, GBP, JPY, etc.)
- ✅ Amount input validation
- ✅ Real-time conversion updates
- ✅ Exchange rate display
- ✅ Conversion history
- ✅ Swap currencies functionality
- ✅ Copy to clipboard
- ✅ Loading states
- ✅ Error handling

## Overall Coverage

```
File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
All files                 |   56.64 |    55.07 |   53.12 |   56.64
 src/api                  |   39.39 |    16.66 |      25 |   39.39
  exchangeApi.ts          |   36.23 |    16.66 |   21.42 |   36.23
  mockData.ts             |      50 |      100 |      50 |      50
 src/components           |   97.36 |    91.11 |    97.5 |   97.36
  Calculator.tsx          |   97.61 |    88.88 |     100 |   97.61
  CurrencyConverter.tsx   |   97.22 |    92.85 |      96 |   97.22
```

## Configuration

Tests are configured in `vitest.config.ts`:
- **Test Environment**: happy-dom (lightweight browser simulation)
- **Setup Files**: `tests/setup.ts`
- **Coverage Provider**: v8
- **Coverage Directory**: `tests/unit/reports/coverage`
- **Reporters**: text, json, html

### Coverage Thresholds
- Statements: Not enforced
- Branches: Not enforced  
- Functions: Not enforced
- Lines: Not enforced

## Testing Libraries

### Vitest
- Fast unit test framework for Vite projects
- Compatible with Jest API
- Native ESM support
- Instant HMR for tests

### React Testing Library
- User-centric testing approach
- Queries based on accessibility
- Encourages best practices
- No implementation details testing

### Testing Library User Event
- Simulates real user interactions
- More realistic than fireEvent
- Handles complex user flows
- Better for accessibility testing

## CI/CD Integration

Unit tests run automatically in GitHub Actions:
- `.github/workflows/unit-tests.yml`

### CI Configuration
- Uses Node.js 22
- Installs dependencies with frozen lockfile
- Runs tests with coverage
- Uploads coverage reports as artifacts
- Retention: 30 days

## Best Practices

1. **Query by role**: Use `getByRole()` for better accessibility
2. **User interactions**: Use `userEvent` over `fireEvent`
3. **Async operations**: Use `waitFor()` for async state updates
4. **Mock API calls**: Mock `exchangeApi` to avoid external dependencies
5. **Test behavior**: Focus on what users see and do, not implementation
6. **Descriptive tests**: Use clear, descriptive test names
7. **Arrange-Act-Assert**: Structure tests with AAA pattern

## Writing Tests

Example test structure:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should handle user interaction', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<MyComponent />);
    
    // Act
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Assert
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

## Viewing Coverage

After running `yarn test:coverage`, open the HTML report:

```bash
open tests/unit/reports/coverage/index.html
```

The report shows:
- Line-by-line coverage
- Uncovered lines highlighted
- Branch coverage details
- Function coverage stats
