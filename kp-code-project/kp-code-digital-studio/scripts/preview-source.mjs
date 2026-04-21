import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, stat } from 'node:fs/promises';
import { ROOT_DIR, listPublicHtmlFiles, renderAssembledHtml } from './build-utils.mjs';
import {
  getContentType,
  getPort,
  resolveRequestPath,
  sendText,
} from './preview-server-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const publicHtmlFiles = new Set((await listPublicHtmlFiles()).map((filePath) => filePath.replaceAll('\\', '/')));
const SOURCE_PREVIEW_RUNTIME_MARKER =
  '    <meta name="kp-code-runtime" content="source-preview" />\n';

function toRelativeRootPath(filePath) {
  return path.relative(ROOT_DIR, filePath).replaceAll('\\', '/');
}

function injectSourcePreviewRuntimeMarker(html) {
  if (html.includes('name="kp-code-runtime"')) {
    return html;
  }

  return html.includes('</head>')
    ? html.replace('</head>', `${SOURCE_PREVIEW_RUNTIME_MARKER}</head>`)
    : html;
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
  const filePath = resolveRequestPath(PROJECT_ROOT, requestUrl.pathname);

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

    const relativePath = toRelativeRootPath(filePath);
    if (publicHtmlFiles.has(relativePath)) {
      const html = injectSourcePreviewRuntimeMarker(await renderAssembledHtml(relativePath));
      const htmlBuffer = Buffer.from(html, 'utf8');

      response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': htmlBuffer.length,
        'Cache-Control': 'no-store',
      });

      if (request.method === 'HEAD') {
        response.end();
        return;
      }

      response.end(htmlBuffer);
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

    console.error('Source preview server error:', error);
    sendText(response, 500, 'Internal Server Error');
  }
}

const port = getPort();
const server = http.createServer((request, response) => {
  handleRequest(request, response);
});

server.listen(port, () => {
  console.log(`Source preview ready at http://127.0.0.1:${port}`);
  console.log(`Serving source files from ${PROJECT_ROOT}`);
});

server.on('error', (error) => {
  console.error('Failed to start source preview server:', error);
  process.exitCode = 1;
});
