"""
Create or sync superuser from Railway env vars on each deploy.
"""
from django.core.management.base import BaseCommand

from api.bootstrap import ensure_superuser_from_env


class Command(BaseCommand):
    help = 'Create or sync superuser from DJANGO_SUPERUSER_USERNAME / PASSWORD / EMAIL env vars'

    def handle(self, *args, **options):
        ensure_superuser_from_env()
