# AGENTS.md - Local Rules for auth-service

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - This service handles token validation and user session data only. No crop/diagnosis logic.
2. **Schema Validity**:
   - Pydantic models in `app/schemas/` define the auth contract (TokenValidationRequest, user profiles).
3. **Token Validation**:
   - Current implementation uses mock validation for local dev. Production requires Supabase JWT verification.
   - Never return raw tokens in responses — only decoded user metadata.
4. **Internal Token**:
   - All requests must pass `X-Internal-Token` validation. Only the API Gateway should call this service.
