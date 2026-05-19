# agent-orchestrator

LangGraph-based AI orchestration service that coordinates crop classification and disease detection using YOLO models.

## Port & Context
* **Base Endpoint**: http://localhost:8003
* **Tech Stack**: FastAPI, LangGraph, Ultralytics YOLO, Uvicorn, Python 3.12
* **Docker**: `agent-orchestrator` service in `docker-compose.yml`

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/diagnose` | Run crop classification → disease detection pipeline |
| GET | `/metrics` | Telemetry (diagnosis count, inference time, cache stats) |

## Setup
```bash
cd services/agent-orchestrator
uvicorn app.main:app --host 0.0.0.0 --port 8003
```

## Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `INTERNAL_SHARED_SECRET` | `super-secret-internal-key-2026` | Validates requests from gateway |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:3001` | CORS origins |
| `LANGCHAIN_TRACING_V2` | (optional) | Enable LangSmith tracing |
| `LANGCHAIN_API_KEY` | (optional) | LangSmith API key |

## Pipeline
1. Image uploaded to `/diagnose`
2. `crop-classifier` YOLO model identifies the crop type
3. Crop-specific disease model (rice/brassica/corn/potato/wheat) runs detection
4. Predictions returned with class names and confidence scores

## Models Used
- `models/crop-classifier/best.pt` — Crop type classification
- `models/{crop}-disease/best.pt` — Per-crop disease detection (5 models, lazy-loaded)
