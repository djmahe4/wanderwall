import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60 * 1000,
  use: {
    baseURL: "http://localhost:3050",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3050",
    reuseExistingServer: !process.env.CI,
  },
});
