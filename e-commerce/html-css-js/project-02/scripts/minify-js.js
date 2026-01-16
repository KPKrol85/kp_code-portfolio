import { spawnSync } from "node:child_process";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import fg from "fast-glob";

const binExt = process.platform === "win32" ? ".cmd" : "";
const terserBin = path.join(process.cwd(), "node_modules", ".bin", `terser${binExt}`);

const files = await fg(["js/**/*.js"], { dot: false });
for (const file of files) {
  const outFile = path.join("dist", file);
  await mkdir(path.dirname(outFile), { recursive: true });

  const result = spawnSync(terserBin, [file, "-o", outFile, "-c", "-m"], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
