import { readdirSync, rmSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const VIDEO_DIR = resolve("assets/video");
const OPTIMIZED_SUFFIX = ".optimized.mp4";

const shouldRemove = (name) => {
  if (name.endsWith(OPTIMIZED_SUFFIX)) {
    return true;
  }
  if (name.endsWith("-poster.jpg")) {
    return true;
  }
  return extname(name).toLowerCase() === ".webm";
};

readdirSync(VIDEO_DIR).forEach((name) => {
  if (!shouldRemove(name)) {
    return;
  }
  rmSync(join(VIDEO_DIR, name), { force: true });
});
