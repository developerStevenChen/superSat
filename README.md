# BASSC New Website

Monorepo: backend (Django API) + frontend (React).

- **BasscBackend** – Django REST API, Railway Bucket uploads, presigned URLs
- **BasscWebsite** – React frontend (homepage, courses, news, dashboard)

## Railway (one repo, two services)

- **Backend**: Root Directory `BasscBackend`, build/run Django (e.g. gunicorn).
- **Frontend**: Root Directory `BasscWebsite`, build `npm run build`, serve static.
