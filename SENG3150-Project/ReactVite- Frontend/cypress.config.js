import { defineConfig } from "cypress";
import codeCoverageTask from '@cypress/code-coverage/task.js'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // enable code coverage tasks for e2e
      codeCoverageTask(on, config)
      return config
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
