# Deploy backend sur VPS

## Variables d'environnement

```env
PORT=8080
NODE_ENV=production
MONGODB_URI=...
JWT_SECRET=...
SESSION_SECRET=...
FRONTEND_URL=https://sunushop.vercel.app
CORS_ORIGINS=https://sunushop.vercel.app
OAUTH_CLIENT_ID=...
OAUTH_CLIENT_SECRET=...
OAUTH_CALLBACK_URL=https://sunushop.vercel.app/backend/auth/provider/callback
EMAIL=...
APP_PASSWORD=...
IMAGE_ENDPOINT=https://cloud.appwrite.io/v1/storage/buckets/
IMAGE_BUCKET_ID=...
IMAGE_PROJECT_ID=...
```

## Port

Si le port `8080` est deja pris sur le VPS, mappe le conteneur sur un autre port hote, par exemple `8081:8080`.

## Health check

Le backend expose `GET /api/health`.

## Frontend Vercel

Configure le frontend avec:

```env
NEXT_PUBLIC_BASE_URL=/backend
API_BASE_URL=http://<ip-du-vps>:<port>/api
BACKEND_PROXY_TARGET=http://<ip-du-vps>:<port>
```

Le navigateur appellera `/backend/...` et Vercel le proxyfera vers le backend.
