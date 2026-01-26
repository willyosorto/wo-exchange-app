import http from 'k6/http';
import { check, sleep } from 'k6';

// HTML reporter only works locally, not in CI
// Uncomment the line below to generate HTML reports when running locally:
// import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  scenarios: {
    api_error_tests: {
      executor: 'constant-vus',
      vus: 3,
      duration: '20s',
    },
  },
  thresholds: {
    checks: ['rate>0.95'],
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = 'http://localhost:3001';

export default function () {
  // Test 1: Valid conversion request - USD to EUR
  testValidConversion('USD', 'EUR', 100);
  sleep(1);

  // Test 2: Valid conversion request - GBP to JPY
  testValidConversion('GBP', 'JPY', 50);
  sleep(1);

  // Test 3: Unauthorized error
  testUnauthorizedError();
  sleep(1);

  // Test 4: Not found error
  testNotFoundError();
  sleep(1);
}

function testValidConversion(from, to, amount) {
  const response = http.get(`${BASE_URL}/pair/${from}/${to}/${amount}`);
  
  check(response, {
    [`Valid conversion ${from} to ${to}: status is 200`]: (r) => r.status === 200,
    [`Valid conversion ${from} to ${to}: has conversion_rate`]: (r) => {
      const body = JSON.parse(r.body);
      return body.conversion_rate !== undefined;
    },
    [`Valid conversion ${from} to ${to}: has conversion_result`]: (r) => {
      const body = JSON.parse(r.body);
      return body.conversion_result !== undefined;
    },
    [`Valid conversion ${from} to ${to}: result is positive`]: (r) => {
      const body = JSON.parse(r.body);
      return body.conversion_result > 0;
    },
  });
}

function testUnauthorizedError() {
  const response = http.get(`${BASE_URL}/error/unauthorized`);
  
  check(response, {
    'Unauthorized error: status is 401': (r) => r.status === 401,
    'Unauthorized error: has error message': (r) => {
      const body = JSON.parse(r.body);
      return body.error !== undefined;
    },
  });
}

function testNotFoundError() {
  const response = http.get(`${BASE_URL}/error/not-found`);
  
  check(response, {
    'Not found error: status is 404': (r) => r.status === 404,
    'Not found error: has error message': (r) => {
      const body = JSON.parse(r.body);
      return body.error !== undefined;
    },
  });
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    'tests/k6/reports/api-error-summary.json': JSON.stringify(data, null, 2),
  };
  
  // To generate HTML report locally, uncomment the import at the top and add:
  // 'tests/k6/reports/api-error-report.html': htmlReport(data),
}

function textSummary(data, options = {}) {
  const indent = options.indent || '';
  
  let summary = `\n${indent}API Error Test Summary:\n`;
  summary += `${indent}=======================\n\n`;
  
  if (data.metrics.checks) {
    const checks = data.metrics.checks.values;
    const passRate = ((checks.passes / (checks.passes + checks.fails)) * 100).toFixed(2);
    summary += `${indent}✓ Checks passed: ${checks.passes}/${checks.passes + checks.fails} (${passRate}%)\n`;
  }
  
  if (data.metrics.http_reqs) {
    summary += `${indent}Total HTTP Requests: ${data.metrics.http_reqs.values.count}\n`;
  }
  
  if (data.metrics.http_req_duration) {
    const duration = data.metrics.http_req_duration.values;
    summary += `${indent}HTTP Request Duration:\n`;
    summary += `${indent}  avg: ${duration.avg.toFixed(2)}ms\n`;
    summary += `${indent}  min: ${duration.min.toFixed(2)}ms\n`;
    summary += `${indent}  max: ${duration.max.toFixed(2)}ms\n`;
    summary += `${indent}  p95: ${duration['p(95)'].toFixed(2)}ms\n`;
  }
  
  if (data.metrics.http_req_failed) {
    const failed = data.metrics.http_req_failed.values;
    summary += `${indent}Failed Requests: ${failed.passes} (${(failed.rate * 100).toFixed(2)}%)\n`;
  }
  
  return summary;
}
