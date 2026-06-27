import sys

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Skip during most management commands; gunicorn workers still run bootstrap.
        argv = sys.argv
        if len(argv) > 1 and argv[0].endswith('manage.py'):
            if argv[1] in ('migrate', 'makemigrations', 'test', 'shell', 'ensure_superuser', 'check_bucket'):
                return
        try:
            from api.bootstrap import ensure_superuser_from_env
            ensure_superuser_from_env()
        except Exception as exc:
            import logging
            logging.getLogger(__name__).error('bootstrap on ready failed: %s', exc)
