// ***********************************************************
// This example support/e2e.js is processed and
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
import './commands'
import "@cypress/code-coverage/support";
// Enable MailSlurp commands like cy.mailslurp()
import 'cypress-mailslurp';

Cypress.config({
    defaultCommandTimeout: 10000, // 10 seconds
});
//TODO: enable this later when testing accessability
// require('@axe-core/watcher/dist/cypressCommands');

// afterEach(() => {
//   cy.axeWatcherFlush();
// });