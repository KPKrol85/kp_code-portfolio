#!/usr/bin/env python3
"""Lauren English source-first development server."""

from __future__ import annotations

import argparse
import io
import json
import os
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
HOST = "127.0.0.1"
DEFAULT_PORT = 8181
DEV_PREFIX = "/__lauren_dev"
WATCH_INTERVAL_SECONDS = 0.4

WATCHED_EXTENSIONS = {
    ".css",
    ".html",
    ".jpeg",
    ".jpg",
    ".js",
    ".json",
    ".mjs",
    ".png",
    ".svg",
    ".avif",
    ".webmanifest",
    ".webp",
    ".woff2",
    ".xml",
}
EXCLUDED_DIRECTORY_NAMES = {
    ".agents",
    ".codex",
    ".git",
    "blob-report",
    "node_modules",
    "playwright-report",
    "test-results",
}
EXCLUDED_DIRECTORY_PATHS = {"assets/build"}
EXCLUDED_FILES = {"service-worker.js"}
HTML_BUILD_DEPENDENCIES = {
    "package.json",
    "scripts/build-html.mjs",
    "scripts/content-renderers.mjs",
    "scripts/shared-shell.mjs",
    "scripts/site-config.mjs",
    "js/data/materialAccess.js",
    "js/data/materialFilters.js",
    "js/data/materials.js",
    "js/data/packages.js",
}

MIME_OVERRIDES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
}

LIVE_RELOAD_TAG = (
    f'<script type="module" src="{DEV_PREFIX}/client.js"></script>'
)
LIVE_RELOAD_CLIENT = f"""const events = new EventSource("{DEV_PREFIX}/events");
events.addEventListener("ready", () => {{ window.__laurenDevReloadReady = true; }});
events.addEventListener("reload", () => {{
  events.close();
  window.location.reload();
}});
"""


def relative_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def is_temporary_file(name: str) -> bool:
    lowered = name.lower()
    return (
        name.startswith(("#", ".#"))
        or name.endswith("~")
        or lowered.endswith((".bak", ".swp", ".swo", ".temp", ".tmp"))
    )


def is_excluded_directory(path: Path) -> bool:
    relative = relative_path(path)
    return (
        path.name in EXCLUDED_DIRECTORY_NAMES
        or relative in EXCLUDED_DIRECTORY_PATHS
    )


def scan_watched_files() -> dict[str, tuple[int, int]]:
    snapshot: dict[str, tuple[int, int]] = {}
    for directory, child_directories, files in os.walk(ROOT):
        directory_path = Path(directory)
        child_directories[:] = [
            name
            for name in child_directories
            if not is_excluded_directory(directory_path / name)
        ]
        for name in files:
            path = directory_path / name
            relative = relative_path(path)
            if (
                relative in EXCLUDED_FILES
                or is_temporary_file(name)
                or path.suffix.lower() not in WATCHED_EXTENSIONS
            ):
                continue
            try:
                file_stat = path.stat()
            except OSError:
                continue
            snapshot[relative] = (file_stat.st_mtime_ns, file_stat.st_size)
    return snapshot


def changed_paths(
    previous: dict[str, tuple[int, int]], current: dict[str, tuple[int, int]]
) -> list[str]:
    return sorted(
        path
        for path in previous.keys() | current.keys()
        if previous.get(path) != current.get(path)
    )


def npm_command() -> str:
    return "npm.cmd" if os.name == "nt" else "npm"


def run_html_build() -> tuple[bool, str | None]:
    print("[HTML] Running npm run build:html...", flush=True)
    try:
        completed = subprocess.run(
            [npm_command(), "run", "build:html"],
            cwd=ROOT,
            check=False,
            stdin=subprocess.DEVNULL,
        )
    except OSError as error:
        message = f"Could not start npm run build:html: {error}"
        print(f"[HTML] ERROR: {message}", file=sys.stderr, flush=True)
        return False, message
    if completed.returncode != 0:
        message = f"npm run build:html exited with code {completed.returncode}"
        print(f"[HTML] ERROR: {message}", file=sys.stderr, flush=True)
        return False, message
    print("[HTML] Assembly complete.", flush=True)
    return True, None


class ReloadState:
    def __init__(self) -> None:
        self._condition = threading.Condition()
        self._version = 0
        self._html_builds = 0
        self._last_build_success: bool | None = None
        self._last_build_error: str | None = None
        self._last_changed: list[str] = []

    def record_build(self, success: bool, error: str | None) -> None:
        with self._condition:
            self._html_builds += 1
            self._last_build_success = success
            self._last_build_error = error

    def publish(self, paths: list[str]) -> int:
        with self._condition:
            self._version += 1
            self._last_changed = paths
            self._condition.notify_all()
            return self._version

    def wait(self, version: int, timeout: float) -> int:
        with self._condition:
            self._condition.wait_for(
                lambda: self._version != version, timeout=timeout
            )
            return self._version

    def wake(self) -> None:
        with self._condition:
            self._condition.notify_all()

    def status(self) -> dict[str, object]:
        with self._condition:
            return {
                "version": self._version,
                "htmlBuilds": self._html_builds,
                "lastBuildSuccess": self._last_build_success,
                "lastBuildError": self._last_build_error,
                "lastChanged": list(self._last_changed),
            }


def watch_project(
    state: ReloadState, stop_event: threading.Event
) -> None:
    previous = scan_watched_files()
    while not stop_event.wait(WATCH_INTERVAL_SECONDS):
        current = scan_watched_files()
        changed = changed_paths(previous, current)
        previous = current
        if not changed:
            continue

        requires_html_build = any(
            path in HTML_BUILD_DEPENDENCIES for path in changed
        )
        if requires_html_build:
            success, error = run_html_build()
            state.record_build(success, error)
            previous = scan_watched_files()
            if not success:
                print(
                    "[Reload] HTML assembly failed; browser reload withheld until the next source change.",
                    file=sys.stderr,
                    flush=True,
                )
                continue

        version = state.publish(changed)
        print(f"[Reload] v{version}: {', '.join(changed)}", flush=True)


class DevelopmentHttpServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def __init__(
        self,
        server_address: tuple[str, int],
        handler: type[SimpleHTTPRequestHandler],
        reload_state: ReloadState,
        stop_event: threading.Event,
    ) -> None:
        self.reload_state = reload_state
        self.stop_event = stop_event
        super().__init__(server_address, handler)

    def handle_error(self, request: object, client_address: object) -> None:
        error = sys.exception()
        if isinstance(
            error,
            (BrokenPipeError, ConnectionAbortedError, ConnectionResetError),
        ):
            return
        print(
            f"[HTTP] Request handler error: {type(error).__name__}: {error}",
            file=sys.stderr,
            flush=True,
        )


class DevelopmentRequestHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args: object, **kwargs: object) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    @property
    def development_server(self) -> DevelopmentHttpServer:
        return self.server  # type: ignore[return-value]

    def end_headers(self) -> None:
        self.send_header(
            "Cache-Control", "no-store, no-cache, must-revalidate, max-age=0"
        )
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def guess_type(self, path: str) -> str:
        return MIME_OVERRIDES.get(Path(path).suffix.lower(), super().guess_type(path))

    def log_message(self, format_string: str, *args: object) -> None:
        path = urlsplit(self.path).path
        if path.startswith(DEV_PREFIX):
            return
        status = str(args[1]) if len(args) > 1 else ""
        if status in {"200", "304"} and Path(path).suffix.lower() in {
            ".css",
            ".jpeg",
            ".jpg",
            ".js",
            ".mjs",
            ".png",
            ".svg",
            ".webmanifest",
            ".webp",
            ".woff2",
        }:
            return
        print(f"[HTTP] {self.command} {path} - {format_string % args}", flush=True)

    def do_GET(self) -> None:
        path = urlsplit(self.path).path
        if path == f"{DEV_PREFIX}/client.js":
            self._send_bytes(
                LIVE_RELOAD_CLIENT.encode("utf-8"),
                "text/javascript; charset=utf-8",
            )
            return
        if path == f"{DEV_PREFIX}/status":
            payload = json.dumps(
                self.development_server.reload_state.status(),
                ensure_ascii=False,
            ).encode("utf-8")
            self._send_bytes(payload, "application/json; charset=utf-8")
            return
        if path == f"{DEV_PREFIX}/events":
            self._send_events()
            return
        super().do_GET()

    def _send_bytes(
        self, payload: bytes, content_type: str, status: int = 200
    ) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(payload)

    def _send_events(self) -> None:
        state = self.development_server.reload_state
        stop_event = self.development_server.stop_event
        version = int(state.status()["version"])
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Connection", "keep-alive")
        self.end_headers()
        try:
            print(f"[Reload] Client connected at v{version}.", flush=True)
            self.wfile.write(f"retry: 750\nevent: ready\ndata: {version}\n\n".encode())
            self.wfile.flush()
            while not stop_event.is_set():
                next_version = state.wait(version, timeout=12)
                if next_version == version:
                    payload = ": keep-alive\n\n"
                else:
                    version = next_version
                    payload = f"event: reload\ndata: {version}\n\n"
                    print(f"[Reload] Sent browser reload v{version}.", flush=True)
                self.wfile.write(payload.encode())
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, OSError):
            return

    def send_head(self) -> io.BytesIO | object | None:
        translated = Path(self.translate_path(self.path))
        if translated.is_dir():
            translated = translated / "index.html"
        if translated.is_file() and translated.suffix.lower() == ".html":
            return self._open_html(translated, 200)
        if not translated.exists():
            not_found = ROOT / "404.html"
            if not_found.is_file():
                return self._open_html(not_found, 404)
        return super().send_head()

    def _open_html(self, path: Path, status: int) -> io.BytesIO | None:
        try:
            html = path.read_text(encoding="utf-8")
        except OSError:
            self.send_error(500, "Could not read the HTML document")
            return None
        if LIVE_RELOAD_TAG not in html:
            html = html.replace("</body>", f"  {LIVE_RELOAD_TAG}\n</body>", 1)
        payload = html.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        return io.BytesIO(payload)


def port_is_available(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        try:
            probe.bind((HOST, port))
        except OSError:
            return False
    return True


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--no-browser", action="store_true")
    parser.add_argument("--skip-initial-build", action="store_true")
    parser.add_argument("--check-port", action="store_true")
    parser.add_argument("--shutdown-on-stdin", action="store_true")
    return parser.parse_args()


def main() -> int:
    arguments = parse_arguments()
    if arguments.check_port:
        if port_is_available(arguments.port):
            print(f"Port {arguments.port} is available on {HOST}.")
            return 0
        print(
            f"ERROR: Port {arguments.port} is already occupied on {HOST}.",
            file=sys.stderr,
        )
        return 1

    state = ReloadState()
    if not arguments.skip_initial_build:
        success, error = run_html_build()
        state.record_build(success, error)
        if not success:
            return 1

    stop_event = threading.Event()
    try:
        server = DevelopmentHttpServer(
            (HOST, arguments.port),
            DevelopmentRequestHandler,
            state,
            stop_event,
        )
    except OSError:
        print(
            f"ERROR: Port {arguments.port} is already occupied on {HOST}.",
            file=sys.stderr,
        )
        return 1

    watcher = threading.Thread(
        target=watch_project,
        args=(state, stop_event),
        name="lauren-english-watcher",
        daemon=True,
    )
    watcher.start()
    url = f"http://{HOST}:{arguments.port}/"
    print(f"Lauren English development server ready at {url}", flush=True)
    print("Press Ctrl+C to stop.", flush=True)
    if not arguments.no_browser:
        threading.Timer(0.35, lambda: webbrowser.open(url)).start()
    if arguments.shutdown_on_stdin:
        def shutdown_when_stdin_closes() -> None:
            sys.stdin.buffer.read()
            if not stop_event.is_set():
                server.shutdown()

        threading.Thread(
            target=shutdown_when_stdin_closes,
            name="lauren-english-stdin-shutdown",
            daemon=True,
        ).start()

    try:
        server.serve_forever(poll_interval=0.25)
    except KeyboardInterrupt:
        print("\nStopping Lauren English development server...", flush=True)
    finally:
        stop_event.set()
        state.wake()
        server.server_close()
        watcher.join(timeout=2)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
