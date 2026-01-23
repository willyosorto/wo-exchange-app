import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './playwright',

    /* Run tests in files in parallel */
    fullyParallel: true,

    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html', { outputFolder: 'playwright/reports/html' }],
        ['json', { outputFile: 'playwright/reports/json/results.json' }],
        ['junit', { outputFile: 'playwright/reports/junit/results.xml' }]
    ],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',

        /* Screenshot on failure */
        screenshot: 'only-on-failure',

        /* Video on failure */
        video: 'retain-on-failure',

        /* Grant clipboard permissions */
        permissions: ['clipboard-read', 'clipboard-write'],
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'API Tests',
            testMatch: '**/playwright/api/**/*.spec.ts',
            use: {
                // API tests don't need browser context
            },
        },
        {
            name: 'Contract Tests',
            testMatch: '**/playwright/contract/**/*.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Desktop Chrome',
            testMatch: '**/playwright/e2e/**/*.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },
        /* Test against mobile viewports. */
        {
            name: 'Mobile Chrome',
            testMatch: '**/playwright/e2e/**/*.spec.ts',
            use: { ...devices['Pixel 7'] },
        },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'yarn run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
