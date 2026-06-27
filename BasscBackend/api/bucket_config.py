"""Railway Bucket (S3-compatible) credentials — single source for upload and presigned URLs."""
import os


def _first_env(*keys, default=''):
    for key in keys:
        value = (os.environ.get(key) or '').strip()
        if value:
            return value
    return default


def get_bucket_config():
    """
    Read bucket settings from env. Accepts Railway Reference names too.

    Important: Railway's RAILWAY_BUCKET_NAME is the canvas display name, NOT the
    S3 API bucket name. Prefer BUCKET (from Bucket → Credentials / Variable Reference).
    """
    bucket = _first_env(
        'BUCKET',
        'AWS_STORAGE_BUCKET_NAME',
        'S3_BUCKET',
        'RAILWAY_BUCKET_NAME',
    )
    return {
        'access_key': _first_env(
            'RAILWAY_BUCKET_ACCESS_KEY',
            'ACCESS_KEY_ID',
            'AWS_ACCESS_KEY_ID',
        ),
        'secret_key': _first_env(
            'RAILWAY_BUCKET_SECRET_KEY',
            'SECRET_ACCESS_KEY',
            'AWS_SECRET_ACCESS_KEY',
        ),
        'endpoint': _first_env(
            'RAILWAY_BUCKET_ENDPOINT',
            'ENDPOINT',
            'AWS_S3_ENDPOINT_URL',
            default='https://t3.storageapi.dev',
        ),
        'bucket': bucket,
        'public_base': _first_env('RAILWAY_BUCKET_PUBLIC_BASE'),
        'region': _first_env('REGION', 'AWS_S3_REGION_NAME', default='auto'),
    }


def bucket_configured():
    cfg = get_bucket_config()
    return bool(cfg['access_key'] and cfg['secret_key'] and cfg['bucket'])


def bucket_config_hint():
    """Human-readable hint for missing bucket env vars."""
    cfg = get_bucket_config()
    missing = []
    if not cfg['access_key']:
        missing.append('RAILWAY_BUCKET_ACCESS_KEY（或 ACCESS_KEY_ID）')
    if not cfg['secret_key']:
        missing.append('RAILWAY_BUCKET_SECRET_KEY（或 SECRET_ACCESS_KEY）')
    if not cfg['bucket']:
        missing.append('BUCKET（S3 API 桶名，不要用 RAILWAY_BUCKET_NAME 显示名）')
    if not cfg['endpoint']:
        missing.append('RAILWAY_BUCKET_ENDPOINT（或 ENDPOINT）')
    if not missing:
        using_display_name = (
            not _first_env('BUCKET', 'AWS_STORAGE_BUCKET_NAME', 'S3_BUCKET')
            and bool(_first_env('RAILWAY_BUCKET_NAME'))
        )
        if using_display_name:
            return (
                '凭证已配置，但可能用了错误的桶名：请在 Variables 添加 BUCKET（来自 Bucket Credentials），'
                '不要用 RAILWAY_BUCKET_NAME（那只是 Railway 画布上的显示名）。'
            )
        return '凭证已配置但上传失败，请查看 Deploy Logs 中的 boto3 报错。'
    return '缺少环境变量：' + '、'.join(missing)


def get_s3_client():
    """Build boto3 S3 client for Railway Bucket. Returns (client, error_message)."""
    cfg = get_bucket_config()
    if not cfg['access_key'] or not cfg['secret_key']:
        return None, bucket_config_hint()
    if not cfg['bucket']:
        return None, bucket_config_hint()
    try:
        import boto3
        from botocore.config import Config
    except ImportError:
        return None, 'boto3 未安装'

    region = cfg['region'] or 'auto'
    if region == 'auto':
        region = 'us-east-1'

    try:
        client = boto3.client(
            's3',
            endpoint_url=cfg['endpoint'],
            aws_access_key_id=cfg['access_key'],
            aws_secret_access_key=cfg['secret_key'],
            region_name=region,
            config=Config(
                signature_version='s3v4',
                s3={'addressing_style': 'virtual'},
            ),
        )
        return client, None
    except Exception as exc:
        return None, f'无法创建 S3 客户端：{exc}'
