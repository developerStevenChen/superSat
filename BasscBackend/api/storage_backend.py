"""
Railway Bucket（S3 兼容）上传，返回可访问的图片 URL。
"""
import logging
import os
import uuid

from .bucket_config import bucket_config_hint, bucket_configured, get_bucket_config, get_s3_client

logger = logging.getLogger(__name__)


def upload_file_to_bucket(file_obj, folder='uploads'):
    """
    上传文件到 Railway Bucket。
    返回 (url, error)：成功时 error 为 None；失败时 url 为 None。
    """
    cfg = get_bucket_config()
    bucket = cfg['bucket']
    endpoint = cfg['endpoint']
    public_base = cfg['public_base']

    if not bucket_configured():
        msg = bucket_config_hint()
        logger.warning("Bucket 未配置: %s", msg)
        return None, msg

    client, client_error = get_s3_client()
    if client_error:
        logger.warning("Bucket S3 客户端失败: %s", client_error)
        return None, client_error

    ext = os.path.splitext(getattr(file_obj, 'name', '') or '')[1]
    if not ext:
        content_type = getattr(file_obj, 'content_type', '') or ''
        ext = '.mp4' if content_type.startswith('video/') else '.jpg'
    key = f"{folder}/{uuid.uuid4().hex}{ext}"

    try:
        file_obj.seek(0)
        content_type = file_obj.content_type or ('video/mp4' if folder == 'videos' else 'image/jpeg')
        client.upload_fileobj(
            file_obj,
            bucket,
            key,
            ExtraArgs={'ContentType': content_type},
        )
    except Exception as exc:
        logger.exception("上传到 Bucket 失败 bucket=%r key=%r: %s", bucket, key, exc)
        return None, f'上传到 Bucket 失败（bucket={bucket}）：{exc}'

    if public_base:
        base = public_base.rstrip('/')
        return f"{base}/{key}", None
    return f"{endpoint.rstrip('/')}/{bucket}/{key}", None
