# 带数据上线：为什么数据会丢 + 用 PostgreSQL 持久化并导入本地数据

## 为什么之前的数据会丢失？

后端若使用 **SQLite**（默认），数据库文件 `db.sqlite3` 在**容器内部**。Railway 每次重新部署、重启或扩容都会换新容器，**容器内文件系统不保留**，所以 SQLite 里的数据会丢。

**解决办法**：使用 **Railway 提供的 PostgreSQL**，数据存在 Railway 的数据库服务里，与容器无关，**持久保留**。

---

## 一、在 Railway 上添加 PostgreSQL（数据持久化）

1. 打开 Railway 项目，在**项目首页**（不是进某个服务）点击 **+ New** → 选 **Database** → **PostgreSQL**。
2. 创建完成后，点进这个 **PostgreSQL** 服务，在 **Variables** 或 **Connect** 里可以看到 **DATABASE_URL**（或 `DATABASE_PUBLIC_URL`）。
3. 把该 PostgreSQL 的 **DATABASE_URL** 配到**后端服务**里：
   - 点进**后端服务**（BasscBackend）→ **Variables**。
   - 若 Railway 已自动把同项目下的数据库变量注入到后端，可能已有 **DATABASE_URL**，无需再填。
   - 若没有，在 PostgreSQL 服务里复制 **DATABASE_URL**，在后端服务里新增变量 **DATABASE_URL** = 该值。
4. **保存**后后端会重新部署；启动时会执行 `migrate`，在 PostgreSQL 里建表。  
   之后所有数据都会写在 PostgreSQL 里，**不会再因部署/重启而丢失**。

---

## 二、把本地 SQLite 的数据导出并导入到线上

### 步骤 1：在本地导出数据（在项目里、已激活虚拟环境）

在**本地**进入后端目录并执行（只导出业务数据，排除会冲突的 contenttypes、permissions）：

```bash
cd BasscBackend
python manage.py dumpdata --natural-foreign --natural-primary \
  --exclude contenttypes --exclude auth.Permission \
  --indent 2 -o data_export.json
```

**若在 Windows 下出现** `'charmap' codec can't encode characters` **编码错误**，请改用脚本（强制 UTF-8 写入）：

```bash
cd BasscBackend
python scripts/export_data.py
```

（脚本会导出**全部**数据，含管理员账号，便于用同一账号在线上登录。）

生成的 **data_export.json** 在 `BasscBackend/` 下。

### 步骤 2：把导出文件传到 Railway 并在线上导入

- **方式 A（推荐）**：在 Railway 后端服务里打开 **Shell**。把本地的 `data_export.json` 内容复制到剪贴板，在 Shell 里执行：
  ```bash
  cd /app && cat > data_export.json << 'ENDOFFILE'
  ```
  然后粘贴文件内容，换行后输入 `ENDOFFILE` 回车。再执行：
  ```bash
  python manage.py loaddata data_export.json
  ```
- **方式 B**：临时把 `data_export.json` 加入仓库再部署，在 Shell 里执行 `python manage.py loaddata data_export.json`（文件在 /app 下）。导入完成后从仓库删除该文件并提交（`data_export.json` 已加入 .gitignore，需用 `git add -f BasscBackend/data_export.json` 才能提交一次）。

导入成功后，建议从仓库中删除 data_export.json（若曾提交），避免敏感信息长期保留在 Git 中。

### 步骤 3：（可选）若只导出了业务数据、没导出 auth

线上需要能登录的话，要么：

- 在步骤 1 用**不排除 auth** 的 dumpdata（并导出 auth.user、authtoken 等），再 loaddata；  
要么  
- 在 Railway 后端 Variables 里设置 **DJANGO_SUPERUSER_USERNAME** / **DJANGO_SUPERUSER_PASSWORD**，让启动时自动创建超级用户（见 RAILWAY.md），然后用该账号登录。

---

## 三、小结

| 项目         | 说明 |
|--------------|------|
| 数据为何丢失 | 默认用 SQLite，存在容器内，重新部署/重启后容器被换掉，数据就没了。 |
| 持久化方案   | 使用 Railway PostgreSQL，在后端配置 **DATABASE_URL**，数据持久保留。 |
| 带数据上线   | 本地用 **dumpdata** 导出为 **data_export.json**，部署后在线用 **loaddata** 导入；或先建 PostgreSQL 再导入。 |
| 导入后       | 建议从仓库删除 data_export.json 并加入 .gitignore，避免泄露。 |

当前仓库已支持 **DATABASE_URL**（见 config/settings.py）：只要在后端服务里配置好 PostgreSQL 的 **DATABASE_URL**，就会自动使用 PostgreSQL，不再使用 SQLite，数据即可带数据上线并持久保存。
