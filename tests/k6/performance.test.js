import { browser } from 'k6/browser';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  scenarios: {
    browser_test: {
      executor: 'constant-vus',
      vus: 3,
      duration: '90s',
      gracefulStop: '30s',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate>0.75'],
    browser_web_vital_fcp: ['p(95)<18000'],
    browser_web_vital_lcp: ['p(95)<18000'],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    // Navigate and measure load performance
    const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    check(response, {
      'Page loaded successfully': (r) => r.status() === 200,
    });

    // Wait for amount input
    await page.waitForSelector('[data-testid="exchange-from-amount-input"]', { timeout: 5000 });

    // Test 1: USD to EUR conversion
    await testConversion(page, 'usd', 'eur', '100');
    
    sleep(2);

    // Test 2: GBP to JPY conversion  
    await testConversion(page, 'gbp', 'jpy', '50');

  } catch (error) {
    console.error(`Test error: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testConversion(page, fromCode, toCode, amount) {
  try {
    console.log(`Testing: ${amount} ${fromCode.toUpperCase()} → ${toCode.toUpperCase()}`);

    // Fill amount
    const amountInput = await page.$('[data-testid="exchange-from-amount-input"]');
    await amountInput.click();
    await amountInput.fill('');
    await amountInput.type(amount);
    
    const inputValue = await amountInput.inputValue();
    check(null, {
      [`Amount ${amount} entered`]: () => inputValue === amount,
    });

    // Select FROM currency
    await page.click('[data-testid="exchange-from-button"]');
    await page.waitForSelector('[data-testid="from-country-search-input"]', { state: 'visible' });
    await page.click(`[data-testid="from-country-currency-${fromCode}"]`);
    
    sleep(0.5);

    // Select TO currency
    await page.click('[data-testid="exchange-to-button"]');
    await page.waitForSelector('[data-testid="to-country-search-input"]', { state: 'visible' });
    await page.click(`[data-testid="to-country-currency-${toCode}"]`);
    
    // Wait for conversion to happen (auto-converts)
    sleep(1.5);

    // Check result displayed
    const resultInput = await page.$('[data-testid="exchange-to-amount-input"]');
    const resultValue = await resultInput.inputValue();
    
    check(null, {
      [`Conversion ${fromCode.toUpperCase()}→${toCode.toUpperCase()} completed`]: () => {
        const numResult = parseFloat(resultValue);
        return numResult > 0;
      },
    });

    console.log(`Result: ${resultValue} ${toCode.toUpperCase()}`);

  } catch (error) {
    console.error(`Conversion failed: ${error.message}`);
    check(null, {
      [`Conversion ${fromCode.toUpperCase()}→${toCode.toUpperCase()} succeeded`]: () => false,
    });
  }
}

export function handleSummary(data) {
  return {
    'tests/k6/reports/performance-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options = {}) {
  const indent = options.indent || '';
  
  let summary = `\n${indent}Performance Test Summary:\n`;
  summary += `${indent}=========================\n\n`;
  
  if (data.metrics.checks) {
    const checks = data.metrics.checks.values;
    summary += `${indent}✓ Checks passed: ${checks.passes}/${checks.passes + checks.fails}\n`;
  }
  
  if (data.metrics.browser_web_vital_fcp && data.metrics.browser_web_vital_fcp.values) {
    const fcp = data.metrics.browser_web_vital_fcp.values;
    summary += `${indent}First Contentful Paint:\n`;
    summary += `${indent}  avg: ${fcp.avg.toFixed(2)}ms\n`;
    summary += `${indent}  p95: ${fcp['p(95)'].toFixed(2)}ms\n`;
  }
  
  if (data.metrics.browser_web_vital_lcp && data.metrics.browser_web_vital_lcp.values) {
    const lcp = data.metrics.browser_web_vital_lcp.values;
    summary += `${indent}Largest Contentful Paint:\n`;
    summary += `${indent}  avg: ${lcp.avg.toFixed(2)}ms\n`;
    summary += `${indent}  p95: ${lcp['p(95)'].toFixed(2)}ms\n`;
  }
  
  return summary;
}
