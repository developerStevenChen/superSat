"""
Railway Bucket（S3 兼容）上传，返回可访问的图片 URL。
"""
import logging
import os
import uuid
from django.conf import settings

logger = logging.getLogger(__name__)


def upload_file_to_bucket(file_obj, folder='uploads'):
    """
    上传文件到 Railway Bucket，返回公网 URL。
    file_obj: Django UploadedFile
    folder: 存储目录前缀
    返回: str URL 或 None（未配置或失败）
    """
    access_key = getattr(settings, 'RAILWAY_BUCKET_ACCESS_KEY', None) or os.environ.get('RAILWAY_BUCKET_ACCESS_KEY')
    secret_key = getattr(settings, 'RAILWAY_BUCKET_SECRET_KEY', None) or os.environ.get('RAILWAY_BUCKET_SECRET_KEY')
    endpoint = getattr(settings, 'RAILWAY_BUCKET_ENDPOINT', None) or os.environ.get('RAILWAY_BUCKET_ENDPOINT', 'https://t3.storageapi.dev')
    bucket = getattr(settings, 'RAILWAY_BUCKET_NAME', None) or os.environ.get('RAILWAY_BUCKET_NAME')
    public_base = getattr(settings, 'RAILWAY_BUCKET_PUBLIC_BASE', None) or os.environ.get('RAILWAY_BUCKET_PUBLIC_BASE')

    if not all([access_key, secret_key, bucket]):
        logger.warning("Bucket 未配置: 请检查 RAILWAY_BUCKET_ACCESS_KEY / SECRET_KEY / NAME 是否在 .env 或环境中")
        return None

    try:
        import boto3
        from botocore.config import Config
    except ImportError:
        logger.warning("boto3 未安装，无法上传到 Bucket")
        return None

    ext = os.path.splitext(getattr(file_obj, 'name', '') or '')[1]
    if not ext:
        content_type = getattr(file_obj, 'content_type', '') or ''
        ext = '.mp4' if content_type.startswith('video/') else '.jpg'
    key = f"{folder}/{uuid.uuid4().hex}{ext}"

    try:
        client = boto3.client(
            's3',
            endpoint_url=endpoint,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=Config(signature_version='s3v4'),
            region_name='auto',
        )
        file_obj.seek(0)
        content_type = file_obj.content_type or ('video/mp4' if folder == 'videos' else 'image/jpeg')
        client.upload_fileobj(file_obj, bucket, key, ExtraArgs={'ContentType': content_type})
    except Exception as e:
        logger.exception("上传到 Bucket 失败: %s", e)
        return None

    if public_base:
        base = public_base.rstrip('/')
        return f"{base}/{key}"
    return f"{endpoint.rstrip('/')}/{bucket}/{key}"
