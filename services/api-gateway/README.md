# api-gateway

Central reverse-proxy gateway for the AgriVision AI platform. All frontend requests route through this service to downstream microservices.

## Port & Context
* **Base Endpoint**: http://localhost:8000
* **Tech Stack**: FastAPI, httpx, Uvicorn, Python 3.12
* **Docker**: `api-gateway` service in `docker-compose.yml`

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/diagnose` | Direct diagnosis shortcut (agent-orchestrator) |
| ALL | `/{path}` | Catch-all reverse proxy to downstream services |

## Routing Map
The gateway proxies requests to these services:
- `/advisory/*` → advisory-service (port 8001)
- `/crop-routing/*` → crop-routing-service (port 8002)
- `/agent/*` → agent-orchestrator (port 8003)
- `/auth/*` → auth-service (port 8004)
- `/notifications/*` → notification-service (port 8005)
- `/analytics/*` → analytics-service (port 8006)
- `/reports/*` → report-service (port 8007)
- `/rag/*` → rag-service (port 8008)

## Setup
```bash
cd services/api-gateway
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `INTERNAL_SHARED_SECRET` | (required) | Token injected into proxied requests |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:3001` | CORS origins |
