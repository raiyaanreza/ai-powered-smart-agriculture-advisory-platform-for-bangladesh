# AGENTS.md - Local Rules for rag-service

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - This service provides RAG (Retrieval-Augmented Generation) queries against agricultural knowledge bases.
2. **Schema Validity**:
   - `QueryRequest` and `UpsertRequest` in `main.py` define the RAG contract.
3. **Vector Database**:
   - Current implementation returns mock results. Future: integrate Qdrant for real vector similarity search.
   - Document embeddings should use a sentence-transformer model before upsert.
4. **Internal Token**:
   - All requests must pass `X-Internal-Token` validation. Only the API Gateway should call this service.
