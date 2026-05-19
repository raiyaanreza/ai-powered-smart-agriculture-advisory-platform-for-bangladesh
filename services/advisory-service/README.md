# advisory-service

AI-powered crop advisory and diagnosis service using Google Gemini for vision-based disease analysis and conversational agricultural guidance.

## Port & Context
* **Base Endpoint**: http://localhost:8001
* **Tech Stack**: FastAPI, Google Gemini SDK, Uvicorn, Python 3.12
* **Docker**: `advisory-service` service in `docker-compose.yml`

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/advisory/chat` | Conversational agricultural advisory |
| POST | `/advisory/crop-analysis` | Crop health analysis from image |
| POST | `/advisory/diagnose` | Full diagnosis with AI vision model |

## Setup
```bash
cd services/advisory-service
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

## Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | (required) | Google Gemini API key |
| `INTERNAL_SHARED_SECRET` | `super-secret-internal-key-2026` | Validates requests from gateway |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:3001` | CORS origins |

## Architecture
- `app/schemas/chat.py` — Pydantic request/response models
- `app/services/gemini_service.py` — Gemini AI integration with fallback handling
