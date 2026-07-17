import { spawn, spawnSync } from "node:child_process";
import { stat, utimes } from "node:fs/promises";
import { get } from "node:http";
import { dirname, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

import { RUNTIME_CSS_PATHS, RUNTIME_JAVASCRIPT_PATHS } from "./pwa-config.mjs";
import { INDEXABLE_PAGES } from "./site-config.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = "http://127.0.0.1:8181";
const MANIFEST_FILE = resolve(ROOT, "site.webmanifest");
const SHARED_SHELL_FILE = resolve(ROOT, "scripts/shared-shell.mjs");

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const findPython = () => {
  const candidates = [
    ...(process.env.PYTHON ? [{ command: process.env.PYTHON, args: [] }] : []),
    ...(process.platform === "win32"
      ? [
          { command: "python", args: [] },
          { command: "py", args: ["-3"] },
        ]
      : [
          { command: "python3", args: [] },
          { command: "python", args: [] },
        ]),
  ];
  const candidate = candidates.find(
    ({ command, args }) =>
      spawnSync(command, [...args, "--version"], {
        stdio: "ignore",
        windowsHide: true,
      }).status === 0,
  );
  assert(candidate, "Python 3 is unavailable");
  return candidate;
};

const waitFor = async (callback, label, timeout = 15_000) => {
  const deadline = Date.now() + timeout;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const result = await callback();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw new Error(
    `${label} timed out${lastError ? `: ${lastError.message}` : ""}`,
  );
};

const readFreshStatus = () =>
  new Promise((resolveStatus, rejectStatus) => {
    const request = get(
      `${BASE_URL}/__lauren_dev/status?check=${Date.now()}`,
      { agent: false, headers: { connection: "close" } },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          try {
            assert(
              response.statusCode === 200,
              "Development status endpoint failed",
            );
            resolveStatus(JSON.parse(body));
          } catch (error) {
            rejectStatus(error);
          }
        });
      },
    );
    request.on("error", rejectStatus);
  });

const touchFile = async (path) => {
  const original = await stat(path);
  await utimes(path, original.atime, new Date(Date.now() + 2_000));
  return original;
};

const restoreFileTimes = async (path, original) => {
  if (original) await utimes(path, original.atime, original.mtime);
};

const stopServer = async (server) => {
  if (!server || server.exitCode !== null) return;
  server.stdin.end();
  await Promise.race([
    new Promise((resolveExit) => server.once("exit", resolveExit)),
    delay(5_000),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
};

const run = async () => {
  const python = findPython();
  const output = [];
  let server;
  let browser;
  let manifestTimes;
  let sharedShellTimes;

  try {
    server = spawn(
      python.command,
      [
        ...python.args,
        "scripts/dev-server.py",
        "--port",
        "8181",
        "--no-browser",
        "--shutdown-on-stdin",
      ],
      {
        cwd: ROOT,
        env: { ...process.env, PYTHONUNBUFFERED: "1" },
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
      },
    );
    for (const stream of [server.stdout, server.stderr]) {
      stream.on("data", (chunk) => {
        const text = chunk.toString();
        output.push(text);
        process.stdout.write(text);
      });
    }

    await waitFor(
      async () => {
        if (server.exitCode !== null) {
          throw new Error(`server exited with ${server.exitCode}`);
        }
        return (await fetch(`${BASE_URL}/__lauren_dev/status`)).status === 200;
      },
      "Python development server",
      30_000,
    );

    for (const page of INDEXABLE_PAGES) {
      const response = await fetch(`${BASE_URL}${page.runtimePath}`);
      assert(response.status === 200, `${page.runtimePath} did not return 200`);
      assert(
        response.headers.get("cache-control")?.includes("no-store"),
        `${page.runtimePath} is missing development no-cache headers`,
      );
    }

    for (const path of RUNTIME_CSS_PATHS) {
      const response = await fetch(`${BASE_URL}${path}`);
      assert(response.status === 200, `${path} did not return 200`);
      assert(
        response.headers.get("content-type")?.includes("text/css"),
        `${path} has the wrong MIME type`,
      );
    }
    for (const path of RUNTIME_JAVASCRIPT_PATHS) {
      const response = await fetch(`${BASE_URL}${path}`);
      assert(response.status === 200, `${path} did not return 200`);
      assert(
        response.headers.get("content-type")?.includes("javascript"),
        `${path} has the wrong MIME type`,
      );
    }
    assert(
      (await fetch(`${BASE_URL}/dev-workflow-missing-page`)).status === 404,
      "Development server must preserve a real local 404",
    );

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ serviceWorkers: "allow" });
    const page = await context.newPage();
    const runtimeRequests = [];
    let pageLoads = 0;
    page.on("request", (request) => {
      runtimeRequests.push(new URL(request.url()).pathname);
    });
    await page.exposeFunction("reportLaurenDevLoad", () => {
      pageLoads += 1;
    });
    await page.addInitScript(() => {
      addEventListener("DOMContentLoaded", () => window.reportLaurenDevLoad());
    });
    await page.goto(`${BASE_URL}/index.html`, {
      waitUntil: "domcontentloaded",
    });
    await waitFor(() => pageLoads >= 1, "initial browser load");
    assert(
      (await page.locator('link[href="/css/style.css"]').count()) === 1,
      "Browser did not receive the canonical CSS entry",
    );
    assert(
      (await page
        .locator('script[type="module"][src="/js/main.js"]')
        .count()) === 1,
      "Browser did not receive the canonical JavaScript module entry",
    );
    assert(
      (await page.locator('script[src="/__lauren_dev/client.js"]').count()) ===
        1,
      "Live-reload client was not injected into the development response",
    );
    await waitFor(
      () => page.evaluate(() => window.__laurenDevReloadReady === true),
      "initial live-reload connection",
    );
    assert(
      !runtimeRequests.includes("/assets/build/style.min.css") &&
        !runtimeRequests.includes("/assets/build/main.min.js"),
      "Browser requested a legacy assets/build file",
    );

    await page.evaluate(async () => {
      await navigator.serviceWorker.register("/service-worker.js");
      await navigator.serviceWorker.ready;
      await caches.open("lauren-english-v-local-development-probe");
      await caches.open("unrelated-local-development-probe");
    });
    await page.reload({ waitUntil: "load" });
    await waitFor(
      () =>
        page.evaluate(async () => {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          const cacheNames = await caches.keys();
          return (
            registrations.every((registration) =>
              [
                registration.active,
                registration.waiting,
                registration.installing,
              ]
                .filter(Boolean)
                .every(
                  (worker) =>
                    new URL(worker.scriptURL).pathname !== "/service-worker.js",
                ),
            ) &&
            !cacheNames.some((name) => name.startsWith("lauren-english-v")) &&
            cacheNames.includes("unrelated-local-development-probe")
          );
        }),
      "local Service Worker and cache cleanup",
    );
    await waitFor(
      () => page.evaluate(() => window.__laurenDevReloadReady === true),
      "live-reload connection after PWA cleanup",
    );

    const regularReloadStart = pageLoads;
    manifestTimes = await touchFile(MANIFEST_FILE);
    await waitFor(
      () => pageLoads > regularReloadStart,
      "live reload after a regular source change",
    );

    sharedShellTimes = await touchFile(SHARED_SHELL_FILE);
    await waitFor(async () => {
      const status = await readFreshStatus();
      return (
        status.lastBuildSuccess === true &&
        status.lastChanged.includes("scripts/shared-shell.mjs")
      );
    }, "HTML assembly and reload publication after a shared-shell change");
    assert(
      (await fetch(`${BASE_URL}/index.html`)).status === 200,
      "Generated HTML was unavailable after shared-source assembly",
    );

    console.log(
      `Verified Python development workflow at ${BASE_URL}: ${INDEXABLE_PAGES.length} pages, ${RUNTIME_CSS_PATHS.length} CSS files, ${RUNTIME_JAVASCRIPT_PATHS.length} JavaScript modules, live reload, HTML regeneration, local PWA cleanup, MIME types, no-cache headers, and project 404 behavior.`,
    );
  } catch (error) {
    throw new Error(
      `${error.message}\nDevelopment server output:\n${output.join("")}`,
    );
  } finally {
    await browser?.close().catch(() => {});
    await stopServer(server);
    await restoreFileTimes(MANIFEST_FILE, manifestTimes);
    await restoreFileTimes(SHARED_SHELL_FILE, sharedShellTimes);
  }
};

run().catch((error) => {
  console.error(`Development workflow check failed: ${error.message}`);
  process.exitCode = 1;
});
