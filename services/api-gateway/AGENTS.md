# AGENTS.md - Local Rules for api-gateway

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - This service is a stateless reverse proxy. Do not add business logic here.
   - All request handling must delegate to downstream services via `httpx.AsyncClient`.
2. **Routing**:
   - New downstream routes must be registered in the `service_routes` dict in `main.py`.
   - Always inject the `X-Internal-Token` header when proxying requests.
3. **Schema Validity**:
   - Request/response schemas are defined in downstream services. Do not duplicate them here.
4. **Error Handling**:
   - Upstream 5xx errors from downstream services must be wrapped in 502 Bad Gateway responses.
