/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
    namespace Cypress {
        interface Chainable {
            step(message: string): Chainable<void>;
            verification(message: string): Chainable<void>;
        }
    }
}

Cypress.Commands.add('step', (message: string) => {
    if (Cypress.config('isInteractive')) {
        cy.log(`Step: ${message}`);
    } else {
        cy.task('log', `\x1b[36m Step:\x1b[0m ${message}`);
    }
});

Cypress.Commands.add('verification', (message: string) => {
    if (Cypress.config('isInteractive')) {
        cy.log(`Verification: ${message}`);
    } else {
        cy.task('log', `\x1b[32m Verification:\x1b[0m ${message}`);
    }
});

export {}; 
