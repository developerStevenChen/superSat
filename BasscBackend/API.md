# BASSC 速滑俱乐部 - API 说明

## 认证与权限

- **GET**：所有人可读，仅返回 `is_active=True` 的记录（未登录或普通用户）。
- **POST / PUT / PATCH / DELETE**：仅**超级用户或 is_staff 管理员**可写。

认证方式（二选一）：

1. **Session**：先登录 Django Admin `http://127.0.0.1:8000/admin/`，同一浏览器访问 API 即带 Session。
2. **Basic Auth**：请求头 `Authorization: Basic <base64(username:password)>`。

## 基础 URL

- 开发环境：`http://127.0.0.1:8000/api/`

## 端点一览

| 资源 | 路径 | 说明 |
|------|------|------|
| 健康检查 | `GET /api/health/` | 无需认证 |
| 主页轮播图 | `/api/homepagepic/` | homePagePic |
| 介绍板块 | `/api/boards/` | boards |
| 介绍文章 | `/api/introductions/` | introductions |
| 新闻 | `/api/news/` | news（含嵌套 images） |
| 导航项 | `/api/navitems/` | navItems |

## CRUD 示例

### 主页轮播图 HomePagePic

- 列表：`GET /api/homepagepic/`
- 详情：`GET /api/homepagepic/{id}/`
- 创建：`POST /api/homepagepic/`（需管理员）
- 更新：`PUT /api/homepagepic/{id}/` 或 `PATCH /api/homepagepic/{id}/`
- 删除：`DELETE /api/homepagepic/{id}/`

请求体示例（创建/更新）：

```json
{
  "image": "https://example.com/pic.jpg",
  "title": "标题",
  "description": "介绍文字",
  "sort_order": 0,
  "is_active": true
}
```

### 新闻 News（含配图）

- 列表：`GET /api/news/`
- 详情：`GET /api/news/{id}/`
- 创建：`POST /api/news/`（需管理员）
- 更新：`PUT /api/news/{id}/` 或 `PATCH /api/news/{id}/`
- 删除：`DELETE /api/news/{id}/`

请求体示例（创建）：

```json
{
  "title": "新闻标题",
  "intro": "简介",
  "content": "正文内容",
  "prim_pic": "https://example.com/main.jpg",
  "is_active": true,
  "images": [
    { "image_url": "https://example.com/1.jpg", "sort_order": 0, "is_active": true },
    { "image_url": "https://example.com/2.jpg", "sort_order": 1, "is_active": true }
  ]
}
```

### 其他资源

- **Board**：`/api/boards/`，字段含 `image`, `title`, `description`, `link`, `sort_order`, `is_active`。
- **Introduction**：`/api/introductions/`，字段含 `image`, `title`, `text`, `sort_order`, `is_active`。
- **NavItem**：`/api/navitems/`，字段含 `key`, `label`, `path`, `sort_order`, `is_active`。

## 分页

列表接口默认分页，每页 20 条。可选参数：`?page=2`。

## 创建超级用户

```bash
python manage.py createsuperuser
```

然后使用该账号登录 `/admin/` 或带 Basic Auth 调用 API 即可进行 CRUD。
