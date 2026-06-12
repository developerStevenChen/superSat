"""
API 权限：公开只读（仅返回 is_active=True），写操作仅超级用户/管理员。
"""
from rest_framework import permissions


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    GET/HEAD/OPTIONS：所有人可读（由 ViewSet 的 get_queryset 过滤 is_active）。
    POST/PUT/PATCH/DELETE：仅 is_staff 用户（超级用户或管理员）。
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff


class AllowCreateOrStaffOnly(permissions.BasePermission):
    """
    POST：所有人可提交（获客表单）。
    GET/PUT/PATCH/DELETE：仅 is_staff（超级用户或管理员）。
    """

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        if request.method in ('GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'):
            return request.user and request.user.is_authenticated and request.user.is_staff
        return False
