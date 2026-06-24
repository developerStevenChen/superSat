# 前端 Docker 构建，避免 Nixpacks 的 node_modules/.cache 挂载导致 EBUSY
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Railway 注入 PORT；npm start 会先写 runtime-config.js 再 serve
CMD ["sh", "-c", "npm run start"]
