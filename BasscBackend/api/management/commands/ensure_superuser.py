"""
Create superuser from Railway env vars on first deploy.
Does not overwrite existing users (change password via Railway Shell if needed).
"""
import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create superuser from DJANGO_SUPERUSER_USERNAME / PASSWORD / EMAIL env vars'

    def handle(self, *args, **options):
        username = (os.environ.get('DJANGO_SUPERUSER_USERNAME') or '').strip()
        password = (os.environ.get('DJANGO_SUPERUSER_PASSWORD') or '').strip()
        email = (os.environ.get('DJANGO_SUPERUSER_EMAIL') or '').strip() or (
            f'{username}@example.com' if username else ''
        )

        if not username or not password:
            self.stdout.write('ensure_superuser: DJANGO_SUPERUSER_USERNAME/PASSWORD not set, skip')
            return

        User = get_user_model()
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                f'ensure_superuser: user "{username}" already exists — '
                'env vars do not change password; use Railway Shell: '
                'python manage.py changepassword ' + username
            )
            return

        try:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'ensure_superuser: created superuser "{username}"'))
        except Exception as exc:
            self.stderr.write(
                self.style.ERROR(
                    f'ensure_superuser: failed for "{username}": {exc}. '
                    'Password must be at least 8 characters and not too common.'
                )
            )
