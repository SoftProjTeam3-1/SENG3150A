import { defineConfig } from "cypress";
import codeCoverageTask from '@cypress/code-coverage/task.js'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // enable code coverage tasks for e2e
      codeCoverageTask(on, config)
      // surface MAILSLURP API key if provided via environment
      if (process.env.CYPRESS_MAILSLURP_API_KEY && !config.env?.MAILSLURP_API_KEY) {
        config.env = config.env || {}
        config.env.MAILSLURP_API_KEY = process.env.CYPRESS_MAILSLURP_API_KEY
      }
      return config
    },
  },
  env: {
    codeCoverage: {
      // We don't collect backend coverage, avoid cy.request to /__coverage__
      expectFrontendCoverageOnly: true,
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      // enable code coverage tasks for component tests
      codeCoverageTask(on, config)
      return config
    }
  },
});
