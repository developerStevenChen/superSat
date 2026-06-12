"""
最早执行：对 / 和 /api/health/ 直接返回 200，不经过会话/DB，避免 502。
用于排查 Railway 上请求时 worker 崩溃（如 DB 不可用）。
"""
import json
from django.http import HttpResponse


def _ok_json(data):
    return HttpResponse(
        json.dumps(data, ensure_ascii=False),
        content_type='application/json; charset=utf-8',
        status=200,
    )


class HealthEarlyResponseMiddleware:
    """对根路径与健康检查在进入其他中间件前直接返回，避免 DB/会话 导致崩溃"""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path.rstrip('/') or '/'
        if path == '/' and request.method == 'GET':
            return _ok_json({'ok': True, 'api': '/api/', 'health': '/api/health/'})
        if path == '/api/health' and request.method == 'GET':
            return _ok_json({'status': 'ok', 'message': 'BASSC 速滑俱乐部 API 运行正常'})
        if path == '/favicon.ico' and request.method == 'GET':
            return HttpResponse(status=204)
        return self.get_response(request)
