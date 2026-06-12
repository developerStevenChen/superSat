# Railway 部署说明

## 后端 API 地址

若后端服务的 Public Domain 为：

**`https://basscnewwebsite-production.up.railway.app`**

则 API 根路径为：

- **API 根**：`https://basscnewwebsite-production.up.railway.app/api/`
- **健康检查**：`https://basscnewwebsite-production.up.railway.app/api/health/`
- **主页数据**：`https://basscnewwebsite-production.up.railway.app/api/homepage/`
- **登录**：`https://basscnewwebsite-production.up.railway.app/api/auth/login/`

前端在环境变量中设置：

```env
VITE_API_BASE_URL=https://basscnewwebsite-production.up.railway.app
```

（前端会拼成 `VITE_API_BASE_URL + '/api'` 请求后端。）

## 出现 502 / "Application failed to respond" 时

0. **【必查】确认你访问的是「后端」的域名，不是前端的**  
   项目里有两个服务：**前端**（BasscWebsite）和**后端**（BasscBackend）。每个服务有**各自的**公网域名。  
   - 若你一直在浏览器里打开的是**前端的域名**，那么 `/`、`/api/health/` 会由前端的静态服务器处理，没有这些路由就会 502。  
   - 正确做法：在 Railway 项目里点进**后端服务**（Django / BasscBackend）→ **Settings** → **Networking** / **Generate Domain**，看该服务自己的域名（可能类似 `xxx-production.up.railway.app`，不一定叫 basscnewwebsite）。用**这个后端域名**在浏览器里访问 `https://<后端域名>/` 和 `https://<后端域名>/api/health/`。  
   - 若后端服务还没有域名，请在该后端服务里点 **Generate Domain**，记下域名后再测。

1. **【常见】检查公网域名的目标端口（Target Port）**  
   Railway 文档说明：502 多为「公网域名指向的端口」与「应用实际监听的端口」不一致。  
   - 进入该**后端服务** → **Settings** → **Networking**（或 **Public Networking**）。  
   - 找到该服务生成的域名（如 `basscnewwebsite-production.up.railway.app`）对应的 **Target Port**（目标端口）。  
   - 应用通过 `PORT` 环境变量监听（日志里是 `Listening at: http://0.0.0.0:8080`，即 8080）。  
   - 把 **Target Port 设为 8080**，或**留空/不填**让 Railway 自动使用应用监听的端口。  
   - 保存后重新部署或等待生效，再访问根路径与 `/api/health/` 测试。

2. **必须设置 Root Directory**  
   该服务 **Settings → Root Directory** 必须填 `BasscBackend`。  
   若未设置，Railway 会从仓库根目录构建，找不到 `config.wsgi` 和 `requirements.txt`，导致 502。

3. **看 Deploy Logs**  
   Railway 项目 → 该服务 → **Deployments** → 点最新一次部署 → **View Logs**。  
   看是否有 Python 报错、`ModuleNotFoundError`、数据库连接错误、或 gunicorn 启动失败。

4. **启动命令**  
   仓库内已提供 `BasscBackend/railway.toml` 和 `Procfile`，会使用：  
   `python -m gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`  
   若在 Dashboard 手动填了 **Start Command**，请与此一致并确保带 `--bind 0.0.0.0:$PORT`。

5. **确认 ALLOWED_HOSTS**  
   当存在环境变量 `PORT` 时，`config/settings.py` 已自动把 `'.railway.app'` 加入 `ALLOWED_HOSTS`。  
   若仍被拒绝，可在 **Variables** 添加：  
   `ALLOWED_HOSTS=basscnewwebsite-production.up.railway.app`

6. **数据库**  
   - **推荐生产环境使用 PostgreSQL（数据持久化）**：在 Railway 项目里 **+ New → Database → PostgreSQL**，创建后 Railway 会自动把 **DATABASE_URL** 注入到同项目的后端服务（或在后端 Variables 里手动添加）。本仓库已支持 `DATABASE_URL`，配置后重启即可用 PostgreSQL，**数据不会因重新部署而丢失**。详见 **DATA_MIGRATION.md**（带数据上线、导出导入步骤）。  
   - 若使用 MySQL：设置 **USE_MYSQL=1** 及 **DB_HOST**、**DB_NAME**、**DB_USER**、**DB_PASSWORD** 等。  
   - **未配置 DATABASE_URL 且未配置 MySQL 时**使用 SQLite：`start.sh` 会执行 `migrate`，但 **SQLite 在容器内，重新部署后数据会丢失**，仅适合测试。  
   - **创建可登录的超级用户**：在后端 **Variables** 里添加 **DJANGO_SUPERUSER_USERNAME**、**DJANGO_SUPERUSER_PASSWORD**（及可选 **DJANGO_SUPERUSER_EMAIL**），保存后重新部署，启动时会自动执行 `createsuperuser --noinput`；或在该服务 **Shell** 里执行 `python manage.py createsuperuser`。

7. **依赖**  
   `requirements.txt` 已包含 `gunicorn`；构建命令见 `railway.toml` 或使用 `pip install -r requirements.txt`。

8. **若仍 502：改用 Docker 部署**  
   在服务 **Settings → Build → Builder** 里选 **Dockerfile**（仓库内 `BasscBackend/Dockerfile` 已配好），保存后重新部署。  
   同时请到 **Deployments → 最新部署 → View Logs** 把报错内容复制下来，便于排查（如数据库连接失败、模块找不到等）。

9. **用极简服务排查（无需改 Start Command）**  
   仓库内提供了 `server_minimal.py`（不依赖 Django，只监听 PORT 并返回 200）。  
   - 在后端服务 **Variables** 里**新增**一条：`USE_MINIMAL_SERVER` = `1`，保存后会自动重新部署。  
   - 用**该后端服务的域名**访问 `https://<后端域名>/`，若返回 `{"ok":true,"msg":"minimal server"}`，说明流量能到容器，问题在 Django，可删掉变量 `USE_MINIMAL_SERVER` 再查 Django/DB；若仍然 502，说明是域名绑错服务或目标端口错误，请再核对步骤 0 和 1。  
   - 测完后记得删掉 `USE_MINIMAL_SERVER` 或设为空，否则会一直跑极简服务而不是 Django。
