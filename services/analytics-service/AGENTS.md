# AGENTS.md - Local Rules for analytics-service

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - This service provides outbreak telemetry and diagnosis metrics. No inference or advisory logic.
2. **Schema Validity**:
   - Pydantic models in `app/schemas/` define analytics response contracts.
3. **Database Boundaries**:
   - Current endpoints return static data. Future implementation should query PostgreSQL for aggregated metrics.
4. **Internal Token**:
   - All requests must pass `X-Internal-Token` validation. Only the API Gateway should call this service.
