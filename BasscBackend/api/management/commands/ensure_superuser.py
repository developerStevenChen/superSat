"""
Create or sync superuser from Railway env vars on each deploy.
When DJANGO_SUPERUSER_USERNAME + DJANGO_SUPERUSER_PASSWORD are set, password is applied
so changing Railway Variables and redeploying updates login credentials.
"""
import os

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create or sync superuser from DJANGO_SUPERUSER_USERNAME / PASSWORD / EMAIL env vars'

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
        try:
            validate_password(password, user=None)
        except ValidationError as exc:
            self.stderr.write(
                self.style.ERROR(
                    f'ensure_superuser: invalid password for "{username}": {"; ".join(exc.messages)}'
                )
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
            self.stdout.write(
                self.style.SUCCESS(f'ensure_superuser: updated password and staff flags for "{username}"')
            )
            return

        try:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'ensure_superuser: created superuser "{username}"'))
        except Exception as exc:
            self.stderr.write(self.style.ERROR(f'ensure_superuser: failed for "{username}": {exc}'))
