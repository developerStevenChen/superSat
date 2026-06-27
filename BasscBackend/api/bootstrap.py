"""Bootstrap helpers run on deploy / worker start."""
import logging
import os

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)


def ensure_superuser_from_env():
    """
    Create or sync superuser from DJANGO_SUPERUSER_* env vars.
    Safe to call multiple times (idempotent password sync).
    """
    username = (os.environ.get('DJANGO_SUPERUSER_USERNAME') or '').strip()
    password = (os.environ.get('DJANGO_SUPERUSER_PASSWORD') or '').strip()
    email = (os.environ.get('DJANGO_SUPERUSER_EMAIL') or '').strip() or (
        f'{username}@example.com' if username else ''
    )

    if not username or not password:
        logger.info('ensure_superuser: DJANGO_SUPERUSER_USERNAME/PASSWORD not set, skip')
        print('ensure_superuser: DJANGO_SUPERUSER_USERNAME/PASSWORD not set, skip', flush=True)
        return

    User = get_user_model()
    try:
        validate_password(password, user=None)
    except ValidationError as exc:
        logger.error(
            'ensure_superuser: invalid password for %r: %s',
            username,
            '; '.join(exc.messages),
        )
        return

    user = User.objects.filter(username=username).first()
    if user:
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        if email and hasattr(user, 'email'):
            user.email = email
        user.save()
        msg = f'ensure_superuser: updated password and staff flags for {username!r}'
        logger.info(msg)
        print(msg, flush=True)
        return

    try:
        User.objects.create_superuser(username=username, email=email, password=password)
        msg = f'ensure_superuser: created superuser {username!r}'
        logger.info(msg)
        print(msg, flush=True)
    except Exception as exc:
        logger.error('ensure_superuser: failed for %r: %s', username, exc)


def log_bucket_config_status():
    """Print bucket env status on deploy so Railway logs show missing vars."""
    import os

    from .bucket_config import bucket_config_hint, bucket_configured, get_bucket_config

    cfg = get_bucket_config()
    if bucket_configured():
        bucket_source = 'BUCKET' if os.environ.get('BUCKET', '').strip() else 'RAILWAY_BUCKET_NAME/other'
        msg = f'bucket: configured (name={cfg["bucket"]!r}, source={bucket_source})'
    else:
        msg = f'bucket: not configured — {bucket_config_hint()}'
    logger.info(msg)
    print(msg, flush=True)
