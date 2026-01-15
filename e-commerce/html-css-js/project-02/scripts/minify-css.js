import { spawnSync } from "node:child_process";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import fg from "fast-glob";

const binExt = process.platform === "win32" ? ".cmd" : "";
const cleancssBin = path.join(process.cwd(), "node_modules", ".bin", `cleancss${binExt}`);

const files = await fg(["styles/**/*.css"], { dot: false });
for (const file of files) {
  const outFile = path.join("dist", file);
  await mkdir(path.dirname(outFile), { recursive: true });

  const result = spawnSync(cleancssBin, ["-o", outFile, file], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
