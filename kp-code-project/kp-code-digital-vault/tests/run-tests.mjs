import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { memoryStorage } from "./helpers/memoryStorage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nodeTestsDir = path.join(__dirname, "node");

const ensureGlobals = () => {
  globalThis.localStorage = memoryStorage;
  globalThis.window = {
    localStorage: memoryStorage,
    location: { hash: "#/" },
  };
};

ensureGlobals();

const { store, storeInitialState } = await import("../js/store/store.js");

const resetEnvironment = () => {
  memoryStorage.reset();
  store.resetState(storeInitialState);
};

const loadTestModules = async () => {
  const entries = await readdir(nodeTestsDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".test.mjs"))
    .map((entry) => entry.name)
    .sort();

  const modules = [];
  for (const file of files) {
    const moduleUrl = pathToFileURL(path.join(nodeTestsDir, file)).href;
    const mod = await import(moduleUrl);
    const tests = Array.isArray(mod.tests) ? mod.tests : [];
    modules.push({ file, tests });
  }
  return modules;
};

const run = async () => {
  const modules = await loadTestModules();
  let failures = 0;
  let total = 0;

  for (const { file, tests } of modules) {
    console.log(`\n# ${file}`);
    for (const test of tests) {
      total += 1;
      resetEnvironment();
      try {
        await test.run();
        console.log(`PASS ${test.name}`);
      } catch (error) {
        failures += 1;
        console.error(`FAIL ${test.name}`);
        console.error(error);
      }
    }
  }

  console.log(`\nRan ${total} tests: ${total - failures} passed, ${failures} failed.`);
  if (failures > 0) {
    process.exitCode = 1;
  }
};

await run();
