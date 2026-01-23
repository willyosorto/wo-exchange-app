// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Mock clipboard API for CI environments
Cypress.on('window:before:load', (win) => {
  let clipboardData = '';
  
  // Mock clipboard API
  Object.defineProperty(win.navigator, 'clipboard', {
    value: {
      writeText: (text: string) => {
        clipboardData = text;
        return Promise.resolve();
      },
      readText: () => {
        return Promise.resolve(clipboardData);
      }
    },
    writable: true,
    configurable: true
  });
});

export {};