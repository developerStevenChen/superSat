#!/usr/bin/env python3
"""
极简 HTTP 服务：仅用于排查 502。不依赖 Django，只监听 PORT 并返回 200。
若用此脚本仍 502，说明是 Railway 域名/端口/服务绑定问题；若正常则说明是 Django 问题。

用法：在 Railway 后端服务里临时把 Start Command 改为：python server_minimal.py
"""
import os
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get("PORT", "8000"))


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(b'{"ok":true,"msg":"minimal server"}\n')

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Minimal server listening on 0.0.0.0:{PORT}")
    server.serve_forever()
