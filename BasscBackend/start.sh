#!/bin/sh
set -e
PORT="${PORT:-8000}"

echo "[start.sh] PORT=${PORT}"

if [ "$USE_MINIMAL_SERVER" = "1" ]; then
  exec python server_minimal.py
fi

echo "[start.sh] migrate..."
python manage.py migrate --noinput

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "[start.sh] ensure_superuser for user=${DJANGO_SUPERUSER_USERNAME}..."
  python manage.py ensure_superuser
else
  echo "[start.sh] DJANGO_SUPERUSER_* not set, skip ensure_superuser"
fi

if [ -f data_export.json ]; then
  python manage.py loaddata data_export.json 2>/dev/null && mv data_export.json data_export.json.done 2>/dev/null || true
fi

echo "[start.sh] starting gunicorn on 0.0.0.0:${PORT}..."
exec python -m gunicorn config.wsgi:application --bind "0.0.0.0:${PORT}"
