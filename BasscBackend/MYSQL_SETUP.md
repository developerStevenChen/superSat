# MySQL 配置指南

## 快速切换 MySQL

### 方法一：环境变量（推荐）

在 Windows PowerShell 中：

```powershell
$env:USE_MYSQL="1"
$env:DB_NAME="bassc_db"
$env:DB_USER="root"
$env:DB_PASSWORD="你的密码"
$env:DB_HOST="127.0.0.1"
$env:DB_PORT="3306"
```

然后运行：
```bash
python manage.py migrate
```

### 方法二：直接修改 settings.py

在 `config/settings.py` 中，将 `USE_MYSQL` 检查改为直接使用 MySQL：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'bassc_db',
        'USER': 'root',
        'PASSWORD': '你的密码',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}
```

---

## 安装 MySQL 驱动

### 选项 1：mysqlclient（推荐，性能好）

```bash
pip install mysqlclient
```

**注意**：Windows 可能需要先安装 MySQL Connector/C，或使用预编译 wheel。

### 选项 2：PyMySQL（纯 Python，易安装）

```bash
pip install PyMySQL
```

然后在 `config/__init__.py` 中添加：

```python
import pymysql
pymysql.install_as_MySQLdb()
```

---

## 创建数据库

在 MySQL 中执行：

```sql
CREATE DATABASE bassc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 验证连接

```bash
python manage.py dbshell
```

如果成功进入 MySQL 命令行，说明连接正常。
