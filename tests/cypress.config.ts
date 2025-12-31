import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "tests/cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "tests/cypress/support/e2e.ts",
    video: false,
    setupNodeEvents(on) {
      on("task", {
        log(message: string) {
          console.log(message);
          return null;
        },
      });
    },
  },
  screenshotOnRunFailure: true,
  viewportWidth: 390,
  viewportHeight: 844,
});
