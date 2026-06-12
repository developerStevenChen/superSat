"""
API 工具：素材展示逻辑等。
规则：有存储的素材返回 Presigned URL（私有桶可访问），否则返回默认占位图。
"""
import os
from urllib.parse import urlparse

from django.conf import settings


def get_image_or_default(url):
    """若 url 为空则返回默认占位图，否则返回原 URL。用于未配置 Bucket 时的回退。"""
    default = getattr(settings, 'DEFAULT_PLACEHOLDER_IMAGE', None) or '/static/default-placeholder.png'
    return (url or '').strip() or default


def _get_s3_client():
    """获取 S3 兼容客户端（Railway Bucket）。未配置时返回 None。"""
    access_key = (
        getattr(settings, 'RAILWAY_BUCKET_ACCESS_KEY', None)
        or os.environ.get('RAILWAY_BUCKET_ACCESS_KEY')
        or os.environ.get('AWS_ACCESS_KEY_ID')
        or os.environ.get('ACCESS_KEY_ID')
    )
    secret_key = (
        getattr(settings, 'RAILWAY_BUCKET_SECRET_KEY', None)
        or os.environ.get('RAILWAY_BUCKET_SECRET_KEY')
        or os.environ.get('AWS_SECRET_ACCESS_KEY')
        or os.environ.get('SECRET_ACCESS_KEY')
    )
    if not access_key or not secret_key:
        return None
    endpoint = (
        getattr(settings, 'RAILWAY_BUCKET_ENDPOINT', None)
        or os.environ.get('RAILWAY_BUCKET_ENDPOINT')
        or os.environ.get('AWS_S3_ENDPOINT_URL', 'https://storage.railway.app')
    )
    region = (
        getattr(settings, 'AWS_S3_REGION_NAME', None)
        or os.environ.get('AWS_S3_REGION_NAME', 'us-west-1')
    )
    try:
        import boto3
        from botocore.config import Config
    except ImportError:
        return None
    return boto3.client(
        's3',
        endpoint_url=endpoint,
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(signature_version='s3v4'),
    )


def _object_key_from_url(url):
    """
    从完整 URL 中解析出桶内对象 key（如 uploads/xxx.jpg）。
    若已是 key（不含 http）则原样返回。
    """
    if not url or not (url or '').strip():
        return ''
    url = (url or '').strip()
    if not url.startswith('http://') and not url.startswith('https://'):
        return url
    parsed = urlparse(url)
    path = (parsed.path or '').lstrip('/')
    if not path:
        return ''
    # 去掉路径开头的 bucket 名（Railway 等常为 /bucketname/uploads/...）
    bucket = (
        getattr(settings, 'RAILWAY_BUCKET_NAME', None)
        or os.environ.get('RAILWAY_BUCKET_NAME')
        or os.environ.get('AWS_STORAGE_BUCKET_NAME')
        or os.environ.get('BUCKET')
    )
    if bucket and path.startswith(bucket + '/'):
        path = path[len(bucket) + 1:]
    return path


def get_presigned_image_url(object_key, expires_in=3600 * 24 * 7):
    """
    把桶内对象 key 转成临时可访问的 Presigned URL。
    object_key: 可为 key（如 uploads/xxx.jpg）或完整 URL（会先解析出 key）。
    expires_in: 秒，默认 7 天。
    未配置 Bucket 或失败时返回空字符串。
    """
    if not object_key or not (object_key or '').strip():
        return ''
    key = _object_key_from_url(object_key)
    if not key:
        return ''
    client = _get_s3_client()
    if not client:
        return ''
    bucket = (
        getattr(settings, 'RAILWAY_BUCKET_NAME', None)
        or os.environ.get('RAILWAY_BUCKET_NAME')
        or os.environ.get('AWS_STORAGE_BUCKET_NAME')
        or os.environ.get('BUCKET')
    )
    if not bucket:
        return ''
    try:
        url = client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket, 'Key': key},
            ExpiresIn=expires_in,
        )
        return url or ''
    except Exception:
        return ''


def get_image_url_for_api(url_or_key):
    """
    供 API 返回的图片 URL：优先生成 Presigned URL（解决私有桶 Access Denied），
    否则返回原 URL；空则返回默认占位图。
    用于轮播/board/news/introduction 等所有图片字段。
    """
    default = getattr(settings, 'DEFAULT_PLACEHOLDER_IMAGE', None) or '/static/default-placeholder.png'
    raw = (url_or_key or '').strip()
    if not raw:
        return default
    presigned = get_presigned_image_url(raw)
    if presigned:
        return presigned
    return raw


def get_presigned_media_url(url_or_key):
    """
    供 API 返回的媒体 URL（如课程 Hero 视频）：优先生成 Presigned URL，
    否则返回原 URL；空则返回空字符串。与图片同一套私有桶逻辑，不返回占位图。
    """
    raw = (url_or_key or '').strip()
    if not raw:
        return ''
    presigned = get_presigned_image_url(raw)
    return presigned if presigned else raw
