import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  outputDir: ".qa/results",
  reporter: "list",
  fullyParallel: false,
  use: {
    baseURL: process.env.QA_BASE_URL || "http://localhost:3000",
    headless: true,
    channel: process.env.QA_BROWSER || "chrome",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
