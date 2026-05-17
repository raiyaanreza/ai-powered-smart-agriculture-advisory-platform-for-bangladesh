# Architectural Decisions Record (ADR)

This document registers the key architectural and design decisions made for the AgriVision AI Agriculture Platform.

---

## 🏛️ ADR 01: Microservices Architecture over Monolith
* **Status**: Accepted
* **Context**: The government-scale agricultural operating system for Bangladesh requires distinct, highly specialized modules (such as distinct crop disease visual models, conversational advisory interfaces, dynamic telemetry analytics, and vector index databases) that must scale independently.
* **Decision**: Implement a decoupled FastAPI microservices architecture tied together by a centralized asynchronous `api-gateway` and a dynamic `agent-orchestrator` (using LangGraph).
* **Consequences**: Enables modular testing, independent scaling, and distinct model versioning schedules, at the expense of higher initial infrastructure management overhead.

## 📡 ADR 02: Centralized Reverse Proxy Gateway
* **Status**: Accepted
* **Context**: Frontend clients (`apps/web` and `apps/admin`) need a single, unified backend API endpoint rather than direct bindings to 14 separate microservice ports.
* **Decision**: Construct an asynchronous reverse-proxy inside `services/api-gateway` utilizing `httpx.AsyncClient` on Port `8000` to transparently route all requests.
* **Consequences**: Clients bind only to Port `8000`. We secure CORS and token validation policies in a single centralized choke-point.

## 🧠 ADR 03: Model Serving Decoupling
* **Status**: Accepted
* **Context**: Initially, the LangGraph `agent-orchestrator` was coupled directly to model serving, loading local PyTorch `.pt` files directly inside graph execution nodes. This caused memory bloat and blocked thread scheduling.
* **Decision**: Decouple the orchestrator completely. Each crop category (e.g. `disease-rice-service`) and classifier must serve its own models over localized FastAPI endpoint wrappers. The orchestrator queries these serving endpoints asynchronously.
* **Consequences**: Restored orchestrator runtime performance and isolated model execution failures.

## 📁 ADR 04: Local DVC & Git Model Tracking Isolation
* **Status**: Accepted
* **Context**: Trained YOLO model weight files (`best.pt`) are heavy binary artifacts (often exceeding 10MB) which should not be stored directly in Git history.
* **Decision**: Initialize DVC (Data Version Control) configuration files (`dvc.yaml`) at the `models/` directory level to track binary states, while excluding raw weights from Git using standard `.gitignore` rules.
* **Consequences**: Keeps the Git history clean and light, while enabling deterministic weight state tracking.
