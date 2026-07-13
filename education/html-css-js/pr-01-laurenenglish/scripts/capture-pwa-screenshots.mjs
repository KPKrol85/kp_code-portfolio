import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = "http://127.0.0.1:4173";
const OUTPUT_DIRECTORY = resolve(ROOT, "assets/pwa/screenshots");
const SERVER_ENTRY = resolve(ROOT, "node_modules/serve/build/main.js");

const SCREENSHOTS = Object.freeze([
  {
    path: resolve(OUTPUT_DIRECTORY, "home-desktop-1280x720.png"),
    viewport: { width: 1280, height: 720 },
  },
  {
    path: resolve(OUTPUT_DIRECTORY, "home-mobile-720x1280.png"),
    viewport: { width: 720, height: 1280 },
  },
]);

const waitForServer = async () => {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/index.html`);
      if (response.ok) return;
    } catch {
      // The child server has not bound its port yet.
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
  }
  throw new Error(`Static server did not become ready at ${BASE_URL}`);
};

const stopServer = async (server) => {
  if (server.exitCode !== null) return;
  server.kill();
  await Promise.race([
    new Promise((resolvePromise) => server.once("exit", resolvePromise)),
    new Promise((resolvePromise) => setTimeout(resolvePromise, 5_000)),
  ]);
};

const run = async () => {
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  const server = spawn(
    process.execPath,
    [SERVER_ENTRY, ".", "-l", "4173", "--no-clipboard"],
    {
      cwd: ROOT,
      stdio: "ignore",
      windowsHide: true,
    },
  );

  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });

    for (const screenshot of SCREENSHOTS) {
      const context = await browser.newContext({
        colorScheme: "light",
        deviceScaleFactor: 1,
        serviceWorkers: "block",
        viewport: screenshot.viewport,
      });
      const page = await context.newPage();
      const response = await page.goto(`${BASE_URL}/index.html`, {
        waitUntil: "networkidle",
      });
      if (!response?.ok()) {
        throw new Error(
          `Homepage returned ${response?.status() ?? "no response"}`,
        );
      }
      await page.evaluate(() => document.fonts.ready.then(() => true));
      await page.locator("main").waitFor({ state: "visible" });
      await page.screenshot({
        animations: "disabled",
        path: screenshot.path,
        type: "png",
      });
      await context.close();
    }
  } finally {
    await browser?.close();
    await stopServer(server);
  }

  console.log(
    `Captured ${SCREENSHOTS.length} production PWA screenshots in ${OUTPUT_DIRECTORY}.`,
  );
};

run().catch((error) => {
  console.error(`PWA screenshot capture failed: ${error.message}`);
  process.exitCode = 1;
});
