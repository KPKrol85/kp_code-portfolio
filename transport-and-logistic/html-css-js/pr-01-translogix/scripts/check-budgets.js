#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const rootDir = path.resolve(__dirname, '..');
const budgetsPath = path.join(rootDir, 'perf-budgets.json');

function formatBytes(bytes) {
  return `${bytes} B (${(bytes / 1024).toFixed(2)} KB)`;
}

function loadBudgets() {
  if (!fs.existsSync(budgetsPath)) {
    throw new Error(`Missing budgets file: ${path.relative(rootDir, budgetsPath)}`);
  }

  const raw = fs.readFileSync(budgetsPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== 'object' || !parsed.budgets || typeof parsed.budgets !== 'object') {
    throw new Error('Invalid perf-budgets.json format. Expected: { "budgets": { "path": { "max_gzip_bytes": number } } }');
  }

  return parsed.budgets;
}

function checkBudgets() {
  const budgets = loadBudgets();
  const results = [];
  let hasFailures = false;

  for (const [assetPath, config] of Object.entries(budgets)) {
    const absolutePath = path.join(rootDir, assetPath);
    const maxGzipBytes = config?.max_gzip_bytes;

    if (!Number.isFinite(maxGzipBytes) || maxGzipBytes <= 0) {
      throw new Error(`Invalid max_gzip_bytes for ${assetPath}`);
    }

    if (!fs.existsSync(absolutePath)) {
      hasFailures = true;
      results.push({
        assetPath,
        status: 'FAIL',
        message: 'File not found',
      });
      continue;
    }

    const content = fs.readFileSync(absolutePath);
    const gzipBytes = zlib.gzipSync(content).length;
    const withinBudget = gzipBytes <= maxGzipBytes;

    if (!withinBudget) {
      hasFailures = true;
    }

    results.push({
      assetPath,
      status: withinBudget ? 'PASS' : 'FAIL',
      gzipBytes,
      maxGzipBytes,
    });
  }

  console.log('Performance budget check (gzip):');
  for (const result of results) {
    if (result.message) {
      console.log(`- [${result.status}] ${result.assetPath}: ${result.message}`);
      continue;
    }

    const delta = result.gzipBytes - result.maxGzipBytes;
    const deltaLabel = delta <= 0 ? `${Math.abs(delta)} B under` : `${delta} B over`;
    console.log(
      `- [${result.status}] ${result.assetPath}: ${formatBytes(result.gzipBytes)} / limit ${formatBytes(result.maxGzipBytes)} (${deltaLabel})`
    );
  }

  if (hasFailures) {
    console.error('\nBudget check failed.');
    process.exit(1);
  }

  console.log('\nAll budgets passed.');
}

try {
  checkBudgets();
} catch (error) {
  console.error(`Budget check error: ${error.message}`);
  process.exit(1);
}
