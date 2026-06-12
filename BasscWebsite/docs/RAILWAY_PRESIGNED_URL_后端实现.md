# Railway 存储：用 Presigned URL 解决 Access Denied

Railway 存储桶**没有公开读/Policy 设置**，桶内文件默认私有。要让前端能显示图片，**后端在返回 API 时，把“对象 key”转成“临时签名链接（Presigned URL）”再返回**即可。

---

## 思路

- 数据库里继续存：**对象 key**（例如 `uploads/043f05d0ce0f4740bc264603afd1b619.jpg`）或当前你存的完整 URL 中的 key 部分。
- 在**返回给前端的接口**（如 `GET /api/homepage/`）里，对每张图片用 S3 客户端生成 **presigned GET URL**（有效期例如 1 小时或 7 天），把**这个临时 URL** 填到 `image` / `image_url` 字段里返回。
- 前端不改逻辑，仍然用接口里的 `image` 显示图片；因为拿到的是带签名的 URL，浏览器就能直接访问。

---

## Django + boto3 示例

### 1. 安装

```bash
pip install boto3
```

### 2. 环境变量（从 Railway Bucket 的 Credentials 页复制）

- `AWS_ACCESS_KEY_ID` 或 Railway 提供的 `ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY` 或 `SECRET_ACCESS_KEY`
- `AWS_STORAGE_BUCKET_NAME` 或 `BUCKET`（如 `buffered-trunk-7yzdtczh95`）
- `AWS_S3_REGION_NAME` 或 `REGION`
- `AWS_S3_ENDPOINT_URL`：Railway 存储一般为 `https://storage.railway.app` 或你桶的 endpoint

### 3. 生成 Presigned URL 的代码

```python
import boto3
from botocore.config import Config

def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=os.environ.get("AWS_S3_ENDPOINT_URL", "https://storage.railway.app"),
        region_name=os.environ.get("AWS_S3_REGION_NAME", "us-west-1"),
        config=Config(signature_version="s3v4"),
    )

def get_presigned_image_url(object_key, expires_in=3600 * 24 * 7):
    """把桶内对象 key 转成临时可访问的 URL。expires_in 单位：秒，默认 7 天。"""
    if not object_key:
        return ""
    # 若数据库存的是完整 URL，可从中提取 key（例如 key = "uploads/xxx.jpg"）
    if object_key.startswith("http"):
        from urllib.parse import urlparse
        parsed = urlparse(object_key)
        object_key = parsed.path.lstrip("/")
        if object_key.startswith("buffered-trunk-"):
            object_key = "/".join(object_key.split("/")[1:])  # 去掉 bucket 名
    client = get_s3_client()
    bucket = os.environ.get("AWS_STORAGE_BUCKET_NAME") or os.environ.get("BUCKET")
    url = client.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": object_key},
        ExpiresIn=expires_in,
    )
    return url
```

### 4. 在返回主页接口时替换图片 URL

在**序列化** `home_page_pic`（或 `homePagePic`）的地方，对每一项的 `image` 做替换，例如：

```python
# 示例：在 serializer 或 view 里
def serialize_homepage_pic(item):
    return {
        "id": item["id"],
        "title": item["title"],
        "description": item["description"],
        "image": get_presigned_image_url(item.get("image") or item.get("image_url")),
        "sort_order": item.get("sort_order", 0),
        "is_active": item.get("is_active", True),
    }

# 返回 /api/homepage/ 时
response_data["home_page_pic"] = [serialize_homepage_pic(p) for p in home_page_pic_list]
```

若你当前存的字段是**完整 URL**（例如 `https://xxx.railway.app/.../uploads/xxx.jpg`），需要先从该 URL 里**解析出对象 key**（通常为 `uploads/xxx.jpg`），再对 key 调 `get_presigned_image_url(key)`。上面示例里已对 `object_key.startswith("http")` 做了简单解析，你可根据实际 URL 格式再微调。

### 5. 其他用到图片的接口

对**介绍、板块、新闻**等所有返回“图片 URL”的接口，同样在序列化时用 `get_presigned_image_url(存的对象 key)` 填到前端的 `image` / `prim_pic` / `images[]` 等字段，前端无需改。

---

## 小结

| 项目 | 说明 |
|------|------|
| Railway 控制台 | 无 Policy/公开读设置，属正常现象 |
| 可行方案 | 仅能通过 **Presigned URL** 让前端访问私有桶图片 |
| 修改位置 | **后端**：在返回图片的 API 里，把对象 key 转成 presigned URL 再返回 |
| 前端 | 无需改，继续用接口返回的 `image` 显示即可 |

按上述在后端实现后，轮播图、介绍、新闻等图片应能正常显示；若后端项目不在本仓库，可把这段逻辑加到你的 Django 项目里即可。
