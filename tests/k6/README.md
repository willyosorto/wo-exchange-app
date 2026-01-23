# K6 Performance Tests

Performance testing for the exchange app using k6 and k6/browser with mock data to avoid stressing the external API.

## Overview

This setup includes:
- **Mock API server** (`tests/mock-server.ts`) - Express server on port 3001
- **Mock exchange rates** (`src/api/mockData.ts`) - Predefined rates for testing
- **Browser tests** (`performance.test.js`) - Full user flow validation with web vitals
- **API tests** (`api-errors.test.js`) - Load testing and error handling
- **HTML reports** - Detailed metrics and visualizations

## Prerequisites

**Install k6:**
- macOS: `brew install k6`
- Linux: https://k6.io/docs/get-started/installation/
- Windows: `choco install k6`

Dependencies are already included in package.json (express, cors, and their types).

## Test Files

### performance.test.js
Browser-based performance tests:
- Tests USD→EUR and GBP→JPY conversions
- Validates full user interaction flow (amount input, currency selection, results)
- Measures web vitals (FCP, LCP)
- Configuration: 3 VUs for 90 seconds

### api-errors.test.js
API load and error handling tests:
- Valid conversion requests (USD→EUR, GBP→JPY)
- Error responses (401 Unauthorized, 404 Not Found)
- Configuration: 3 VUs for 20 seconds

## Running Tests

### Quick Start

```bash
# Terminal 1: Start mock API server
yarn test:k6:mock-server

# Terminal 2: Start app in mock mode
yarn dev:mock

# Terminal 3: Run tests
yarn test:k6:browser  # Browser performance tests
yarn test:k6:api      # API load tests
yarn test:k6:all      # Run all tests
```

### Available Scripts

```json
"dev:mock": "VITE_USE_MOCK_API=true vite"
"test:k6:mock-server": "tsx tests/mock-server.ts"
"test:k6:browser": "k6 run tests/k6/performance.test.js"
"test:k6:api": "k6 run tests/k6/api-errors.test.js"
"test:k6:all": "yarn test:k6:browser && yarn test:k6:api"
```

## Reports

HTML reports are auto-generated in `tests/k6/reports/`:
- `performance-report.html` - Browser test results with web vitals
- `api-error-report.html` - API test results with request metrics

Open in your browser to view detailed charts and metrics.

## Understanding Metrics

### Browser Tests
- **checks**: Assertion pass rate (target: >75%)
- **browser_web_vital_fcp**: First Contentful Paint (target: <18s at p95)
- **browser_web_vital_lcp**: Largest Contentful Paint (target: <18s at p95)
- **vus**: Virtual users simulating concurrent load

### API Tests
- **http_req_duration**: Response time (target: <500ms at p95)
- **http_reqs**: Total requests made
- **http_req_failed**: Failed request rate
- **checks**: All validations (conversions + error handling)

**Note:** In API tests, "failed requests" include intentional error tests (401, 404). Check "Failed Checks" for actual test failures.

## Customization

### Adjust Test Load

Edit `options` in test files:

```javascript
export const options = {
  scenarios: {
    browser_test: {
      vus: 5,           // Number of concurrent users
      duration: '120s', // Test duration
    },
  },
};
```

### Modify Thresholds

```javascript
thresholds: {
  checks: ['rate>0.8'],                    // 80% pass rate
  browser_web_vital_fcp: ['p(95)<10000'],  // 10s at 95th percentile
  http_req_duration: ['p(95)<300'],        // 300ms at 95th percentile
}
```

### Add Currency Pairs

Edit `src/api/mockData.ts`:

```typescript
export const mockExchangeRates: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    // Add more here
  },
};
```

## Architecture

### Mock Server Endpoints

- `GET /pair/:from/:to/:amount` - Currency conversion
- `GET /error/unauthorized` - 401 error test
- `GET /error/not-found` - 404 error test
- `GET /error/server-error` - 500 error test

### Environment Variables

Set `VITE_USE_MOCK_API=true` to use mock server instead of external API. The app automatically switches between:
- Mock API: `http://localhost:3001`
- Real API: `VITE_EXCHANGE_API_URL` (requires `VITE_EXCHANGE_API_KEY`)

## Troubleshooting

**Port already in use:**
```bash
lsof -i :3001        # Check what's using port 3001
kill -9 <PID>        # Kill the process
```

**k6 not found:**
```bash
k6 version           # Verify installation
brew install k6      # Reinstall if needed
```

**Tests timing out:**
- Verify mock server is running on port 3001
- Verify app is running on port 3000 (or 5173)
- Check `VITE_USE_MOCK_API=true` is set

**Browser process killed:**
- This is normal at test end - k6 forcefully terminates browser processes
- Only concern if it happens during test execution

## Next Steps

1. Review HTML reports to establish performance baselines
2. Adjust thresholds based on your requirements
