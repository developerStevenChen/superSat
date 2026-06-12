# 若 Nixpacks 仍 502，可在 Railway 服务 Settings 里选 Builder: Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Railway 注入 PORT；必须用 shell 形式才能展开 $PORT
CMD sh start.sh
