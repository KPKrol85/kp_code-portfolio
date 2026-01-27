import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

import ffmpegPath from "ffmpeg-static";
import ffprobe from "ffprobe-static";

const VIDEO_DIR = resolve("assets/video");
const OPTIMIZED_SUFFIX = ".optimized.mp4";

const TARGET_WEBM_MB = 5;
const TARGET_MP4_MB = 8;

const ensureInput = (inputPath) => {
  if (!existsSync(inputPath)) {
    throw new Error(`Input video not found: ${inputPath}`);
  }
  if (!ffmpegPath) {
    throw new Error("ffmpeg binary not available.");
  }
  if (!ffprobe?.path) {
    throw new Error("ffprobe binary not available.");
  }
};

const run = (args, label) => {
  const result = spawnSync(ffmpegPath, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${label} failed with code ${result.status}`);
  }
};

const getDurationSeconds = (inputPath) => {
  const result = spawnSync(
    ffprobe.path,
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      inputPath,
    ],
    { encoding: "utf-8" }
  );
  if (result.status !== 0) {
    throw new Error("ffprobe failed to read duration.");
  }
  const duration = Number.parseFloat(result.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error("Invalid duration returned by ffprobe.");
  }
  return duration;
};

const calcBitrateK = (targetMb, duration, minK) => {
  const bitrate = Math.floor((targetMb * 8 * 1024) / duration);
  return Math.max(bitrate, minK);
};

const getInputs = () => {
  const arg = process.argv[2];
  if (arg) {
    return [resolve(arg)];
  }
  return readdirSync(VIDEO_DIR)
    .filter((name) => extname(name).toLowerCase() === ".mp4")
    .filter((name) => !name.endsWith(OPTIMIZED_SUFFIX))
    .map((name) => join(VIDEO_DIR, name));
};

const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const buildOne = (inputPath) => {
  ensureInput(inputPath);
  const duration = getDurationSeconds(inputPath);
  const webmK = calcBitrateK(TARGET_WEBM_MB, duration, 800);
  const mp4K = calcBitrateK(TARGET_MP4_MB, duration, 1200);

  const name = basename(inputPath, ".mp4");
  const outputWebm = resolve(VIDEO_DIR, `${name}.webm`);
  const outputMp4 = resolve(VIDEO_DIR, `${name}${OPTIMIZED_SUFFIX}`);
  const outputPoster = resolve(VIDEO_DIR, `${name}-poster.jpg`);

  console.log(`\n[video] ${basename(inputPath)} ->`);
  console.log(`  webm: ${basename(outputWebm)}`);
  console.log(`  mp4 : ${basename(outputMp4)}`);
  console.log(`  poster: ${basename(outputPoster)}`);

  run(
    [
      "-y",
      "-i",
      inputPath,
      "-vf",
      "scale=960:-2",
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      `${webmK}k`,
      "-crf",
      "32",
      "-row-mt",
      "1",
      "-tile-columns",
      "2",
      "-threads",
      "4",
      "-deadline",
      "good",
      outputWebm,
    ],
    "WebM"
  );

  run(
    [
      "-y",
      "-i",
      inputPath,
      "-vf",
      "scale=960:-2",
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "27",
      "-b:v",
      `${mp4K}k`,
      "-maxrate",
      `${mp4K}k`,
      "-bufsize",
      `${mp4K}k`,
      "-movflags",
      "+faststart",
      outputMp4,
    ],
    "MP4"
  );

  run(
    [
      "-y",
      "-ss",
      "1",
      "-i",
      inputPath,
      "-vf",
      "scale=960:-2",
      "-frames:v",
      "1",
      "-q:v",
      "3",
      outputPoster,
    ],
    "Poster"
  );

  const sizes = [
    [outputWebm, "webm"],
    [outputMp4, "mp4"],
    [outputPoster, "poster"],
  ].map(([file, label]) => `${label} ${formatSize(statSync(file).size)}`);
  console.log(`  sizes: ${sizes.join(" | ")}`);
};

const build = () => {
  const inputs = getInputs();
  if (!inputs.length) {
    console.log("No source mp4 files found in assets/video.");
    return;
  }
  inputs.forEach(buildOne);
};

build();
