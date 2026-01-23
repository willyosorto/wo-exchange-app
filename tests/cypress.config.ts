import { defineConfig } from "cypress";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import fs from 'fs';

export default defineConfig({
  env: {
    VITE_EXCHANGE_API_KEY: process.env.VITE_EXCHANGE_API_KEY,
    VITE_EXCHANGE_API_URL: process.env.VITE_EXCHANGE_API_URL,
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: [
      'tests/cypress/e2e/**/*.cy.{ts,tsx}',
      'tests/cypress/api/**/*.cy.{ts,tsx}'
    ],
    supportFile: "tests/cypress/support/e2e.ts",
    video: true,
    videosFolder: 'tests/cypress/videos',
    screenshotsFolder: 'tests/cypress/screenshots',
    setupNodeEvents(on) {
      on("task", {
        log(message: string) {
          console.log(message);
          return null;
        },
      });
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' || browser.name === 'chromium') {
          launchOptions.args.push('--disable-blink-features=AutomationControlled');
          launchOptions.args.push('--disable-features=IsolateOrigins,site-per-process');
          launchOptions.args.push('--disable-site-isolation-trials');
          launchOptions.args.push('--unsafely-treat-insecure-origin-as-secure=http://localhost:3000');
        }
        return launchOptions;
      });
      on(
        'after:spec',
        (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
          if (results && results.video) {
            // Do we have failures for any retry attempts?
            const failures = results.tests.some((test) =>
              test.attempts.some((attempt) => attempt.state === 'failed')
            )
            if (!failures) {
              // delete the video if the spec passed and no tests retried
              fs.unlinkSync(results.video)
            }
          }
        }
      )
    },
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      configFile: "tests/cypress.reporter.config.json",
    },
  },
  screenshotOnRunFailure: true,
  viewportWidth: 390,
  viewportHeight: 844,
});
