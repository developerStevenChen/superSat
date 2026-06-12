# BASSC 速滑俱乐部 - 后端 API

Django + Django REST Framework 构建的后端服务，为前端提供数据接口。

## 技术栈

- **Django 6** - Web 框架
- **Django REST Framework** - REST API
- **django-cors-headers** - 跨域支持（供 React 前端调用）
- **Pillow** - 图片处理（后续上传功能）
- **SQLite** - 默认数据库（生产可切换 PostgreSQL）

## 快速开始

### 1. 激活虚拟环境

```bash
# Windows
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate
```

### 2. 安装依赖（如未安装）

```bash
pip install -r requirements.txt
```

### 3. 数据库迁移

```bash
python manage.py migrate
```

### 4. 启动开发服务器

```bash
python manage.py runserver
```

访问 http://localhost:8000/api/health/ 验证 API 是否正常。

## 项目结构

```
Bassc backend/
├── config/          # Django 项目配置
│   ├── settings.py
│   └── urls.py
├── api/             # API 应用
│   ├── views.py
│   └── urls.py
├── manage.py
├── requirements.txt
└── README.md
```

## API 端点

| 路径 | 说明 |
|------|------|
| /api/health/ | 健康检查 |
| /admin/ | Django 管理后台 |

后续将根据前端数据结构添加 homePagePic、boards、introductions、news 等接口。

## 环境变量（生产部署建议）

- `SECRET_KEY` - Django 密钥
- `DEBUG=False` - 生产环境关闭调试
- `ALLOWED_HOSTS` - 允许的域名
- `DATABASE_URL` - 数据库连接（Railway 等）
