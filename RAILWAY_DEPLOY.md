# Railway 部署：前端 + 后端两个服务

从 [Railway](https://railway.app) 创建项目并连接 GitHub 仓库 `developerStevenChen/bassc_new_website`，然后建**两个服务**：一个后端（Django），一个前端（React）。

---

## 一、先部署后端（Django）

### 1. 新建服务并连仓库

1. 登录 [Railway](https://railway.app) → **New Project**。
2. 选 **Deploy from GitHub repo**，选中 `bassc_new_website`。
3. 仓库连好后，会先出现一个服务，先用来做**后端**。

### 2. 设置后端根目录

1. 点进该服务 → **Settings**。
2. 找到 **Root Directory**（或 **Source** 里的 Root Directory）。
3. 填：`BasscBackend`（只部署这个子目录）。

### 3. 后端构建与启动命令（如需要）

- **Build Command**（若 Railway 未自动识别）：  
  `pip install -r requirements.txt`
- **Start Command**：  
  `python -m gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`  
  （用 `python -m gunicorn` 避免 Railway 上找不到 gunicorn 命令。）

（Railway 会提供 `PORT`，不填则用默认。）

### 4. 后端环境变量

在服务里 **Variables** 添加（根据实际情况改值）：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `SECRET_KEY` | Django 密钥（生产务必随机） | 一串随机字符 |
| `DEBUG` | 生产建议关 | `False` |
| `ALLOWED_HOSTS` | 允许的域名，逗号分隔 | `*` 或 `xxx.up.railway.app` |
| `CORS_ALLOWED_ORIGINS` | 前端地址（用于跨域） | `https://你的前端.up.railway.app` |
| `RAILWAY_BUCKET_ACCESS_KEY` | Railway Bucket 访问密钥 | 从 Railway Bucket 复制 |
| `RAILWAY_BUCKET_SECRET_KEY` | Railway Bucket 密钥 | 从 Railway Bucket 复制 |
| `RAILWAY_BUCKET_ENDPOINT` | S3 兼容端点 | 如 `https://t3.storageapi.dev` |
| `RAILWAY_BUCKET_NAME` | 桶名 | 如 `buffered-trunk-xxx` |

若用数据库（如 PostgreSQL）：再在 Railway 里添加 **PostgreSQL** 插件，并设置 `DATABASE_URL`（Django 需用 `dj-database-url` 等解析，或自行在 settings 里读）。

### 5. 生成域名

- 在服务 **Settings** 里打开 **Generate Domain**，得到类似 `xxx.up.railway.app`。
- 记下此后端域名，下一步前端要填。

### 6. 迁移（首次部署）

若使用数据库，在 **Settings** 里可加一条 **Deploy** 前执行的命令（或单独跑一次）：  
`python manage.py migrate`

（不同 Railway 版本可能叫 “Pre-deploy command” 或 “Custom start”。没有的话就进 Deploy 后的 Shell 执行一次。）

---

## 二、再部署前端（React）

### 1. 在同一项目里新建服务

1. 回到项目首页（Project 面板）。
2. **Add Service** → 再选 **GitHub Repo**，仍选 `bassc_new_website`（同一仓库）。

### 2. 设置前端根目录

1. 进入这个新服务 → **Settings**。
2. **Root Directory** 填：`BasscWebsite`。

### 3. 前端构建与启动

- **Build Command**：  
  `npm ci && npm run build`  
  （或 `npm install && npm run build`）
- **Start Command**（用静态服务器托管打包结果）：  
  `npx serve -s dist -l $PORT`  
  （前端打包输出在 `dist`，`-s` 做 SPA 回退。）

若 Railway 识别为 “Static Site”，可能只需填 **Output Directory**：`dist`，不一定需要 `serve`。

### 4. 前端环境变量（构建时注入 API 地址）

在**前端服务**的 **Variables** 里加：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_API_BASE_URL` | 后端 API 根地址（构建时写入前端） | `https://你的后端.up.railway.app` |

注意：填**后端域名**即可，不要带 `/api`。前端代码会自动拼上 `/api`。  
例如后端域名为 `https://bassc-backend.up.railway.app`，则 `VITE_API_BASE_URL=https://bassc-backend.up.railway.app`。

### 5. 生成前端域名

- 同样在 **Settings** 里 **Generate Domain**，得到前端访问地址。
- 把这个**前端完整地址**填回**后端**的 `CORS_ALLOWED_ORIGINS`（如 `https://bassc-frontend.up.railway.app`），保存后后端会重新部署，跨域即可用。

---

## 三、检查清单

- [ ] 后端 Root Directory = `BasscBackend`，Start = `python -m gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
- [ ] 后端 Variables：`SECRET_KEY`、`DEBUG`、`ALLOWED_HOSTS`、`CORS_ALLOWED_ORIGINS`、Railway Bucket 相关
- [ ] 前端 Root Directory = `BasscWebsite`，Build = `npm ci && npm run build`，Start = `npx serve -s dist -l $PORT`（或按静态站点配置）
- [ ] 前端 Variables：`VITE_API_BASE_URL` = 后端域名
- [ ] 后端已执行 `python manage.py migrate`（若用数据库）
- [ ] 访问前端域名能打开页面，且接口请求指向后端域名（F12 看 Network）

---

## 四、常见问题

- **前端请求 404 / 跨域**：确认 `VITE_API_BASE_URL` 是后端域名且无尾斜杠；`CORS_ALLOWED_ORIGINS` 为前端完整地址（含 `https://`）。
- **后端 500**：看 Railway 该服务的 **Logs**；常见是缺环境变量或未执行 migrate。
- **静态/图片打不开**：确认 Bucket 相关环境变量正确；图片通过 Presigned URL 由后端返回，前端无需改。

部署完成后，前端访问你生成的前端域名即可；后端仅作为 API，一般不直接对用户开放。
