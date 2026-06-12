#!/bin/sh
# 确保 PORT 从环境变量读取，避免 Railway 上 502
PORT="${PORT:-8000}"

# 在 Railway Variables 里设 USE_MINIMAL_SERVER=1 可临时用极简服务排查 502（不改 Start Command）
if [ "$USE_MINIMAL_SERVER" = "1" ]; then
  exec python server_minimal.py
fi

# 每次启动自动执行 migrate，避免登录 500（表不存在）
python manage.py migrate --noinput

# 若在 Railway Variables 里设置了 DJANGO_SUPERUSER_USERNAME 和 DJANGO_SUPERUSER_PASSWORD，首次启动会自动创建超级用户（已有则跳过）
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py createsuperuser --noinput 2>/dev/null || true
fi

# 若存在 data_export.json（临时带入的导出文件），自动执行一次 loaddata 后重命名，避免重复导入
if [ -f data_export.json ]; then
  python manage.py loaddata data_export.json 2>/dev/null && mv data_export.json data_export.json.done 2>/dev/null || true
fi

exec python -m gunicorn config.wsgi:application --bind "0.0.0.0:${PORT}"
