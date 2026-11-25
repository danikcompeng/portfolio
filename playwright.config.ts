// Playwright: screenshots for the design-critic (e2e/screens.e2e.ts) and smoke checks
// (e2e/smoke.e2e.ts). Runs against BASE_URL, or starts `next dev` on port 3417.
import { defineConfig } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3417";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --port 3417",
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
