import pc from "picocolors";
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { IMG_GEN_DIR, ensureDir, ensureGitkeep, toPosix } from "./lib/img-utils.js";

const clean = () => {
  ensureDir(IMG_GEN_DIR);
  ensureGitkeep(IMG_GEN_DIR);

  if (!existsSync(IMG_GEN_DIR)) {
    console.log("No generated images folder found.");
    return;
  }

  const entries = readdirSync(IMG_GEN_DIR, { withFileTypes: true });
  let removed = 0;

  entries.forEach((entry) => {
    if (entry.name === ".gitkeep") {
      return;
    }
    const target = join(IMG_GEN_DIR, entry.name);
    rmSync(target, { recursive: true, force: true });
    removed += 1;
    const rel = toPosix(relative(IMG_GEN_DIR, target));
    console.log(pc.yellow(`[img] Removed ${rel}`));
  });

  if (!removed) {
    console.log("[img] Nothing to clean.");
  } else {
    console.log(pc.green(`[img] Cleaned ${removed} item(s).`));
  }
};

try {
  clean();
} catch (error) {
  console.error(pc.red(`[img] ${error.message}`));
  process.exitCode = 1;
}
