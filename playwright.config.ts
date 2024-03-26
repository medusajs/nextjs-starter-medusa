import { defineConfig, devices } from "@playwright/test"
import path from "path"
import "dotenv/config.js"

export const STORAGE_STATE = path.join(__dirname, "playwright/.auth/user.json")

export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /global\/setup\.ts/,
      teardown: "cleanup test database",
    },
    {
      name: "public setup",
      testMatch: /global\/public-setup\.ts/,
      teardown: "cleanup test database",
    },
    {
      name: "cleanup test database",
      testMatch: /global\/teardown\.ts/,
    },
    {
      name: "chromium auth",
      dependencies: ["setup"],
      testIgnore: "public/*.spec.ts",
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
    },

    {
      name: "chromium public",
      dependencies: ["public setup"],
      testMatch: "public/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },

    /*
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    */
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
     command: 'yarn start',
     url: process.env.NEXT_PUBLIC_BASE_URL,
  //   reuseExistingServer: !process.env.CI,
  },
})
