import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const distDir = new URL('../dist', import.meta.url);
const distPath = distDir.pathname;

const ensureDir = (path) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};

ensureDir(distPath);
ensureDir(join(distPath, 'css'));
ensureDir(join(distPath, 'js'));

execSync('npm run css:build', { stdio: 'inherit' });
execSync('npm run js:build', { stdio: 'inherit' });

const rootDir = new URL('..', import.meta.url).pathname;
const htmlFiles = readdirSync(rootDir).filter((file) => file.endsWith('.html'));
htmlFiles.forEach((file) => {
  cpSync(join(rootDir, file), join(distPath, file));
});

const assetsPath = join(rootDir, 'assets');
if (existsSync(assetsPath)) {
  cpSync(assetsPath, join(distPath, 'assets'), { recursive: true });
}
