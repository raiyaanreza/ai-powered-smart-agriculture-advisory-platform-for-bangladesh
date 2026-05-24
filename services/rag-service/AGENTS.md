# AGENTS.md - Local Rules for rag-service

> **Role**: AI Local Coding Guidelines for `services/rag-service/`

## 1. Service Boundaries

- This service provides RAG (Retrieval-Augmented Generation) via semantic vector search over the agricultural knowledge base.
- Two primary endpoints:
  - `POST /rag/query` — semantic retrieval of agricultural knowledge chunks
  - `POST /rag/ingest` — triggers ingestion of all documents from `models/sources/` into Qdrant
- Only the **API Gateway** and **Advisory Service** should call `/rag/query`.
- The `/rag/ingest` endpoint bypasses internal token auth (intentional, to allow CLI/admin calls).

## 2. Document Sources (`models/sources/`)

All RAG knowledge documents live in `models/sources/` organized by crop/category:

| Folder | Content |
|--------|---------|
| `Rice/` | IRRI Rice Knowledge Bank + BRRI disease/pest fact sheets (Bengali) |
| `Corn/` | CABI PlantwisePlus corn disease fact sheets |
| `Brassica/` | CABI PlantwisePlus brassica/cabbage disease fact sheets |
| `Potato/` | CABI PlantwisePlus potato disease fact sheets |
| `Wheat/` | CABI PlantwisePlus wheat disease fact sheets |
| `Soil_and_Fertilizer/` | BARC fertilizer guide 2024 |
| `Agricultural_Extension/` | BARI extension manual (EN + BN) |
| `Climate_Resilience/` | Mountain area and salt irrigation documents |
| `Market_and_Pricing/` | Agricultural price and availability data |
| `Oilseed_Crops/` | BARI mustard/oilseed variety guides (Bengali) |
| `Vegetable_Crops/` | BARI vegetable variety and cultivation guides (Bengali) |
| `vutta/` | BARI hybrid maize/corn variety PDFs (Bengali PDF format) |

### YAML Frontmatter Requirements

Every `.md` file MUST have valid YAML frontmatter with these fields:
```yaml
---
document_id: <unique_id>
crop: <CropName>         # Must match the crop model recognizes (Rice, Corn, Potato, Wheat, Brassica, etc.)
disease_pest_name: "<Bengali name>"  # ALWAYS quote if starts with special chars (especially #, :, {, })
scientific_name: <Latin name or empty string "">
doi: <DOI or N/A>
article_url: <URL>
publisher: <Publisher Name>
publication_year: <YYYY>
language: Bengali
academic_citation: "<Full citation>"  # ALWAYS quote if contains colons
---
```

**Critical Rules:**
- ❌ Never let `disease_pest_name` or `academic_citation` start with `#` unquoted — YAML treats `#` as a comment, silently dropping the field value.
- ❌ Never misclassify `crop:` — e.g. a Rice blast doc must have `crop: Rice`, not `crop: Wheat`.
- ❌ Never leave document body empty after the frontmatter — empty docs are waste in the vector index.
- ❌ Do not commit OCR-garbled content (encoded as ®ষ¡, ¢ছব¡র etc.) — fix or remove the corrupted sections.

## 3. Vector Database

- Uses **Qdrant** (`QDRANT_URL` env var, default: `http://localhost:6333`).
- Collection name: `agri_knowledge_base`
- Embedding model: `models/gemini-embedding-2` (3072-dim vectors)
- Run `POST /rag/ingest` to (re-)index all documents after adding/changing source files.

## 4. Internal Token

- All requests to `/rag/query` must pass `X-Internal-Token` header matching `INTERNAL_SHARED_SECRET`.
- `/rag/ingest` and `/health` endpoints are exempt.

## 5. Key Files

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI app, endpoint definitions, schemas |
| `app/services/ingestion.py` | Document loading, chunking, Qdrant upsert pipeline |
| `app/services/retrieval.py` | Semantic search + context formatting for LLM injection |
