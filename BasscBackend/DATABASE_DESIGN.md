# BASSC 速滑俱乐部 - 数据库设计说明

## 一、Django 与 MySQL 的关系（给有 MySQL 经验的开发者）

| 概念 | MySQL | Django ORM |
|------|-------|------------|
| 数据库 | 手动建库 | 自动创建（需先建空库） |
| 表 | `CREATE TABLE` | 定义 `Model` → `python manage.py migrate` |
| 字段 | `INT`, `VARCHAR`, `TEXT` | `IntegerField`, `CharField`, `TextField` |
| 外键 | `FOREIGN KEY` | `ForeignKey` |
| 增删改查 | 手写 SQL | `Model.objects.create()`, `.filter()`, `.get()` |

**ORM 优势**：防 SQL 注入、自动迁移、跨数据库（SQLite/MySQL/PostgreSQL 可切换）。

---

## 二、表结构设计（对应前端数据结构）

### 1. api_homepagepic - 主页轮播图

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT (PK) | 自增主键 |
| image | VARCHAR(500) | 图片 URL（Railway 存储链接） |
| title | VARCHAR(200) | 标题 |
| description | VARCHAR(500) | 介绍 |
| sort_order | INT | 排序序号（小优先） |
| is_active | BOOLEAN | 是否启用 |

**对应前端**：`homePagePic[]`

---

### 2. api_board - 介绍板块

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT (PK) | 自增主键 |
| image | VARCHAR(500) | 板块图片 URL |
| title | VARCHAR(100) | 标题 |
| description | VARCHAR(300) | 简介 |
| link | VARCHAR(200) | 可选跳转链接 |
| sort_order | INT | 排序 |
| is_active | BOOLEAN | 是否启用 |

**对应前端**：`boards[]`

---

### 3. api_introduction - 介绍文章

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT (PK) | 自增主键 |
| image | VARCHAR(500) | 配图 URL |
| title | VARCHAR(200) | 标题 |
| text | TEXT | 正文 |
| sort_order | INT | 排序 |
| is_active | BOOLEAN | 是否启用 |

**对应前端**：`introductions[]`

---

### 4. api_news - 新闻

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT (PK) | 自增主键 |
| title | VARCHAR(200) | 标题 |
| intro | VARCHAR(500) | 简介 |
| content | TEXT | 正文 |
| prim_pic | VARCHAR(500) | 主图 URL |
| created_at | DATETIME | 发布时间 |
| updated_at | DATETIME | 更新时间 |
| is_active | BOOLEAN | 是否发布 |

**对应前端**：`newsList[]` 主表

---

### 5. api_newsimage - 新闻配图

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT (PK) | 自增主键 |
| news_id | INT (FK) | 关联 api_news.id |
| image_url | VARCHAR(500) | 图片 URL |
| sort_order | INT | 排序 |

**对应前端**：`news.images[]` 数组

---

### 6. api_navitem - 导航项

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT (PK) | 自增主键 |
| key | VARCHAR(50) UNIQUE | 标识（如 class, event） |
| label | VARCHAR(50) | 显示文字 |
| path | VARCHAR(200) | 前端路由路径 |
| sort_order | INT | 排序 |
| is_active | BOOLEAN | 是否显示 |

**对应前端**：`navItems[]`

---

## 三、ER 图（简化）

```
api_news ──< api_newsimage   （一对多）

其他表独立，无外键关联
```

---

## 四、使用 MySQL 的配置步骤

### 1. 安装 MySQL 驱动

```bash
pip install mysqlclient
# 或（若 mysqlclient 安装失败）
pip install PyMySQL
```

### 2. 创建数据库

```sql
CREATE DATABASE bassc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置 settings.py

在 `config/settings.py` 中修改 `DATABASES`（见下方「MySQL 配置示例」）。

### 4. 执行迁移

```bash
python manage.py migrate
```

---

## 五、常用 Django 数据库命令

| 命令 | 说明 |
|------|------|
| `python manage.py makemigrations` | 根据模型变更生成迁移文件 |
| `python manage.py migrate` | 执行迁移，更新数据库 |
| `python manage.py dbshell` | 进入数据库命令行（可直接写 SQL） |
| `python manage.py showmigrations` | 查看迁移状态 |
