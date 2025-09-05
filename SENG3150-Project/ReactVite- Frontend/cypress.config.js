

import { defineConfig } from 'cypress'

export default defineConfig({
    reporter: 'mocha-junit-reporter',
    reporterOptions: {
        mochaFile: 'test-results/[datetime]/[name]-results.xml',
        toConsole: true
    },
    
    e2e: {
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        setupNodeEvents(on, config) { return config }
    }
})