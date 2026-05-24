# Graph Report - agri-ai-platform  (2026-05-24)

## Corpus Check
- 319 files · ~2,007,101 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 784 nodes · 741 edges · 268 communities (261 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f72d7add`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 78|Community 78]]

## God Nodes (most connected - your core abstractions)
1. `metrics()` - 27 edges
2. `cn()` - 24 edges
3. `run_ingestion()` - 18 edges
4. `verify_internal_token()` - 13 edges
5. `health()` - 12 edges
6. `query_knowledge_base()` - 12 edges
7. `clean_text()` - 11 edges
8. `AuditReportPDF` - 11 edges
9. `build_pdf()` - 10 edges
10. `EmbeddingCache` - 10 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `authenticateAdmin()`  [INFERRED]
  apps/admin/app/api/admin/broadcast/route.ts → apps/admin/lib/auth.ts
- `GET()` --calls--> `authenticateAdmin()`  [INFERRED]
  apps/admin/app/api/admin/farmers/route.ts → apps/admin/lib/auth.ts
- `POST()` --calls--> `authenticateAdmin()`  [INFERRED]
  apps/admin/app/api/admin/farmers/route.ts → apps/admin/lib/auth.ts
- `GET()` --calls--> `authenticateAdmin()`  [INFERRED]
  apps/admin/app/api/outbreak-analytics/route.ts → apps/admin/lib/auth.ts
- `test_advisory_chat()` --calls--> `ChatResponse`  [INFERRED]
  services/advisory-service/tests/test_advisory.py → services/advisory-service/app/schemas/chat.py

## Communities (268 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (44): BroadcastRequest, ingest_documents(), IngestRequest, IngestResponse, node_classify_crop(), query_knowledge_base(), QueryRequest, QueryResponse (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (26): broadcast_notification(), get_diagnoses_metrics(), get_outbreaks_telemetry(), health(), metrics(), predict(), Prediction, PredictionResponse (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (36): embed_query(), embed_texts(), get_embedding_dim(), get_local_embedder(), get_query_cache_stats(), Local Embedding Provider — BAAI/bge-m3 via sentence-transformers ===============, Embed a list of document texts. Used during ingestion.     Runs purely on local, Embed a list of document texts. Used during ingestion.     Runs purely on local (+28 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (23): FPDF, build_pdf(), ContributionPDF, AuditReportPDF, build_pdf(), clean_text(), download_font(), Generate PDF version of the QA Audit Reverification Report Usage: python script (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (22): _compute_hash(), EmbeddingCache, _ensure_collection(), _flatten_json(), get_cache(), _get_client(), _get_embeddings(), _load_documents() (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (8): ThemeToggle(), ImageUploader(), handleScroll(), ResultDisplay(), ThemeToggle(), useAuth(), useDiagnoseImage(), useDiagnosisStats()

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (21): AgentState, diagnose(), get_disease_model(), node_diagnose_disease(), Diagnoses the disease based on the identified crop., Diagnoses the disease based on the identified crop., Diagnoses the disease based on the identified crop., Conditional edge router. (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (9): fetchDashboardStats(), handleVerify(), AlertsTab(), MetricCard(), OverviewTab(), SidebarLink(), SystemTab(), VerificationCard() (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (18): _extract_user_from_jwt(), generate_report(), Returns current user profile from the Authorization header JWT., Generates expert advisory reports in PDF schema, Parses and validates authorization bearer token payload, Generates expert advisory reports in PDF schema, Decode and verify a Supabase JWT, returning user claims., Generates expert advisory reports in PDF schema (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, cn(), cn(), Dialog(), DialogClose(), DialogPortal(), DialogTrigger()

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (15): direct_diagnose(), health_check(), RAG Service — FastAPI Application Provides /rag/query, /rag/ingest, and /rag/sta, Semantic vector search over the agricultural knowledge base.     Returns relevan, Direct route for YOLO crop/disease diagnostics, Direct route for YOLO crop/disease diagnostics, Direct route for YOLO crop/disease diagnostics, Direct route for YOLO crop/disease diagnostics (+7 more)

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (4): cn(), Badge(), badgeVariants, Skeleton()

### Community 12 - "Community 12"
Cohesion: 0.16
Nodes (9): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), INITIAL_DIMENSION, THEMES, TooltipNameType (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): POST(), GET(), POST(), authenticateAdmin(), GET()

### Community 16 - "Community 16"
Cohesion: 0.39
Nodes (6): iso(), AgriVision Platform - Database Seed Script (matching actual Supabase schema), rdate(), seed_diagnoses(), seed_notifications(), seed_reports()

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (5): geistMono, geistSans, metadata, RootLayout(), QueryProvider()

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (3): cn(), TabsList(), tabsListVariants

### Community 20 - "Community 20"
Cohesion: 0.32
Nodes (3): Alert(), alertVariants, cn()

### Community 22 - "Community 22"
Cohesion: 0.32
Nodes (4): _make_test_jwt(), Create a test JWT signed with the test secret., test_auth_validation(), test_auth_validation_admin()

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (6): AI_CONFIG, SYSTEM_PROMPTS, User, UserDTO, UserRole, UserSchema

### Community 25 - "Community 25"
Cohesion: 0.47
Nodes (3): handleDeleteReport(), handleGenerate(), saveReports()

### Community 27 - "Community 27"
Cohesion: 0.8
Nodes (4): generateTTS(), GET(), POST(), splitTextIntoChunks()

### Community 28 - "Community 28"
Cohesion: 0.6
Nodes (3): handleNewChat(), handleSendMessage(), saveConversations()

### Community 30 - "Community 30"
Cohesion: 0.6
Nodes (3): hasRole(), isAdmin(), isFarmer()

### Community 34 - "Community 34"
Cohesion: 0.5
Nodes (3): generate_pdf_report_task(), Mock task for generating PDF report asynchronously.     In a real implementation, Mock task for generating PDF report asynchronously.     In a real implementation

## Knowledge Gaps
- **123 isolated node(s):** `Exports a PyTorch YOLO model to ONNX format.`, `Safely loads inference models, preferring ONNX for speed with PyTorch fallback.`, `Mock task for generating PDF report asynchronously.     In a real implementation`, `Generate PDF version of the QA Audit Reverification Report Usage: python script`, `Download a font file if not already present.` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `metrics()` connect `Community 1` to `Community 8`, `Community 0`, `Community 10`, `Community 6`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `ingest_documents()` connect `Community 0` to `Community 4`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `run_ingestion()` connect `Community 4` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `run_ingestion()` (e.g. with `ingest_documents()` and `embed_texts()`) actually correct?**
  _`run_ingestion()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Exports a PyTorch YOLO model to ONNX format.`, `Safely loads inference models, preferring ONNX for speed with PyTorch fallback.`, `Mock task for generating PDF report asynchronously.     In a real implementation` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._