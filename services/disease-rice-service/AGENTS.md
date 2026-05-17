# AGENTS.md - Local Rules for disease-rice-service

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - Maintain strict separation of concerns. Do not cross-import packages from other services directly.
2. **Schema Validity**:
   - Pydantic models inside `app/schemas/` serve as contract enforcement tools.
3. **Database Boundaries**:
   - All external repository calls must utilize standard db repositories patterns.
