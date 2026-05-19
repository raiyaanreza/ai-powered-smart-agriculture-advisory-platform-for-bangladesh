# AGENTS.md - Local Rules for agent-orchestrator

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - This service owns the LangGraph diagnosis pipeline. Do not add advisory or chat logic here.
2. **Model Loading**:
   - YOLO models are lazy-loaded via `get_disease_model()` with cache hit/miss tracking. Do not load all models at startup.
   - Model paths reference `../../models/` relative to service root.
3. **LangGraph**:
   - Pipeline nodes go in `main.py` as typed functions operating on the graph `State` TypedDict.
   - Adding new nodes requires updating the `StateGraph` builder and routing edges.
4. **Telemetry**:
   - The `/metrics` endpoint reads from in-memory counters (`metrics_store`). Increment counters in the `/diagnose` handler.
5. **Internal Token**:
   - All requests must pass `X-Internal-Token` validation. Only the API Gateway should call this service.
