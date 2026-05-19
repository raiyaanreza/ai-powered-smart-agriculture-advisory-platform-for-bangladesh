# AGENTS.md - Local Rules for advisory-service

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - All AI calls use Google Gemini via `app/services/gemini_service.py`. Never import `google.generativeai` outside that file.
2. **Prompts**:
   - LLM system prompts must be imported from `packages/prompts/`. Never hardcode prompt strings in endpoint handlers.
3. **Schema Validity**:
   - Pydantic models in `app/schemas/chat.py` are the contract source of truth for all request/response shapes.
4. **Error Handling**:
   - Gemini quota failures must trigger the fallback response path in `gemini_service.py`, not crash the endpoint.
5. **Internal Token**:
   - All requests must pass `X-Internal-Token` validation. Only the API Gateway should call this service.
