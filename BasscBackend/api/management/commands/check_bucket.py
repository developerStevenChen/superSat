from django.core.management.base import BaseCommand

from api.bootstrap import log_bucket_config_status


class Command(BaseCommand):
    help = 'Log Railway Bucket env configuration status (for deploy logs).'

    def handle(self, *args, **options):
        log_bucket_config_status()
