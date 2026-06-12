"""
URL configuration for config project.
"""
from django.contrib import admin
from django.http import JsonResponse, HttpResponse
from django.urls import path, include


def root_view(request):
    """根路径返回 200，避免代理把 404 当成 502"""
    return JsonResponse({'ok': True, 'api': '/api/', 'health': '/api/health/'})


def api_root_view(request):
    """/api 无斜杠时也返回 200，指向实际 API 根"""
    return JsonResponse({'ok': True, 'endpoints': {'health': '/api/health/', 'homepage': '/api/homepage/'}})


def favicon_view(request):
    """避免 /favicon.ico 404"""
    return HttpResponse(status=204)


urlpatterns = [
    path('', root_view),
    path('api', api_root_view),
    path('favicon.ico', favicon_view),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
