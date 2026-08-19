from __future__ import annotations

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
HOST = "127.0.0.1"
PORT = 8000


class FrontendHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_ROOT), **kwargs)

    def do_GET(self) -> None:  # noqa: N802 - inherited interface
        parsed = urlparse(self.path)
        if parsed.path == "/":
            self.path = "/frontend/"

        super().do_GET()


def main() -> None:
    load_dotenv(PROJECT_ROOT / ".env")
    server = ThreadingHTTPServer((HOST, PORT), FrontendHandler)
    print(f"Serving Copenhagen Sea Live at http://{HOST}:{PORT}/frontend/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
