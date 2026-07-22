import { defineConfig } from "@playwright/test";

import { PROJECT_DISCLOSURE } from "./scripts/site-config.mjs";

const BASE_URL = "http://127.0.0.1:4173";
const DEFAULT_STORAGE_STATE = {
  cookies: [],
  origins: [
    {
      origin: BASE_URL,
      localStorage: [
        {
          name: PROJECT_DISCLOSURE.storageKey,
          value: PROJECT_DISCLOSURE.version,
        },
      ],
    },
  ],
};

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: [
    ["line"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL: BASE_URL,
    browserName: "chromium",
    storageState: DEFAULT_STORAGE_STATE,
    serviceWorkers: "block",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  webServer: {
    command: "npm run serve -- --listen 4173",
    url: `${BASE_URL}/index.html`,
    reuseExistingServer: true,
    timeout: 30_000,
    stdout: "pipe",
    stderr: "pipe",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "chromium-mobile",
      use: {
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
});
