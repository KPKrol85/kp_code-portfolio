import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, stat } from 'node:fs/promises';
import { getContentType, getPort, resolveRequestPath, sendText } from './preview-server-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DIST_INDEX = path.join(DIST_DIR, 'index.html');

async function assertDistReady() {
  try {
    const stats = await stat(DIST_DIR);
    if (!stats.isDirectory()) {
      throw new Error();
    }
    await stat(DIST_INDEX);
  } catch {
    throw new Error('Missing built "dist/" output. Run "npm run build" before starting preview.');
  }
}

async function handleRequest(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, {
      Allow: 'GET, HEAD',
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    response.end(request.method === 'HEAD' ? undefined : 'Method Not Allowed');
    return;
  }

  const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
  const filePath = resolveRequestPath(DIST_DIR, requestUrl.pathname);

  if (!filePath) {
    sendText(response, 403, 'Forbidden');
    return;
  }

  try {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      sendText(response, 404, 'Not Found');
      return;
    }

    const contentType = getContentType(filePath);
    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': fileStats.size,
      'Cache-Control': 'no-store',
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    const fileBuffer = await readFile(filePath);
    response.end(fileBuffer);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      sendText(response, 404, 'Not Found');
      return;
    }

    console.error('Preview server error:', error);
    sendText(response, 500, 'Internal Server Error');
  }
}

await assertDistReady();

const port = getPort();
const server = http.createServer((request, response) => {
  handleRequest(request, response);
});

server.listen(port, () => {
  console.log(`Preview ready at http://127.0.0.1:${port}`);
  console.log(`Serving dist from ${DIST_DIR}`);
});

server.on('error', (error) => {
  console.error('Failed to start preview server:', error);
  process.exitCode = 1;
});
