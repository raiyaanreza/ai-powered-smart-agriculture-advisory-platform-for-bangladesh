# AGENTS.md - Local Rules for report-service

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - This service generates PDF crop health reports. No inference or advisory logic.
2. **Schema Validity**:
   - `ReportRequest` in `main.py` defines the report contract (farmer_id, farmer_name, diagnoses_count, recommendations).
3. **Report Generation**:
   - Current implementation returns a mock URL. Future: use reportlab or weasyprint to generate real PDFs.
   - Generated files should be stored in `/static/reports/` and served via the gateway.
4. **Celery Integration**:
   - Long-running report generation should use `packages/utils/celery_app.py` for background task queuing.
5. **Internal Token**:
   - All requests must pass `X-Internal-Token` validation. Only the API Gateway should call this service.
