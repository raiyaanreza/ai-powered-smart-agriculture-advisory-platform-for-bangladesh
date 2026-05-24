# Graph Report - agri-ai-platform  (2026-05-24)

## Corpus Check
- 317 files · ~2,005,621 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 733 nodes · 662 edges · 262 communities (256 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `73b51d13`
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
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 35|Community 35]]

## God Nodes (most connected - your core abstractions)
1. `metrics()` - 26 edges
2. `cn()` - 24 edges
3. `verify_internal_token()` - 13 edges
4. `health()` - 12 edges
5. `clean_text()` - 11 edges
6. `AuditReportPDF` - 11 edges
7. `query_knowledge_base()` - 11 edges
8. `build_pdf()` - 10 edges
9. `useAuth()` - 9 edges
10. `GeminiAdvisoryService` - 9 edges

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

## Communities (262 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (12): cn(), Alert(), alertVariants, cn(), Badge(), badgeVariants, CardAction(), cn() (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (36): direct_diagnose(), health_check(), ingest_documents(), IngestResponse, node_classify_crop(), query_knowledge_base(), QueryRequest, QueryResponse (+28 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (25): broadcast_notification(), get_diagnoses_metrics(), get_outbreaks_telemetry(), health(), metrics(), predict(), Prediction, PredictionResponse (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (23): FPDF, build_pdf(), ContributionPDF, AuditReportPDF, build_pdf(), clean_text(), download_font(), Generate PDF version of the QA Audit Reverification Report Usage: python script (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (8): ThemeToggle(), ImageUploader(), handleScroll(), ResultDisplay(), ThemeToggle(), useAuth(), useDiagnoseImage(), useDiagnosisStats()

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (21): BroadcastRequest, ReportRequest, BaseModel, CalendarMilestone, ChatMessage, ChatRequest, ChatResponse, CropAnalysisRequest (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (21): AgentState, diagnose(), get_disease_model(), node_diagnose_disease(), Diagnoses the disease based on the identified crop., Diagnoses the disease based on the identified crop., Diagnoses the disease based on the identified crop., Conditional edge router. (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (9): fetchDashboardStats(), handleVerify(), AlertsTab(), MetricCard(), OverviewTab(), SidebarLink(), SystemTab(), VerificationCard() (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, cn(), cn(), Dialog(), DialogClose(), DialogPortal(), DialogTrigger()

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (15): _extract_user_from_jwt(), generate_report(), Returns current user profile from the Authorization header JWT., Generates expert advisory reports in PDF schema, Parses and validates authorization bearer token payload, Generates expert advisory reports in PDF schema, Decode and verify a Supabase JWT, returning user claims., Generates expert advisory reports in PDF schema (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (15): _ensure_collection(), _flatten_json(), _get_embeddings(), _load_documents(), _parse_yaml_frontmatter(), RAG Ingestion Pipeline Reads PDF, DOCX, MD, JSON files from models/sources/ and, Recursively flatten a JSON object into readable key-value text., Main ingestion entry point.     Loads all source documents, chunks them, embeds (+7 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (9): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), INITIAL_DIMENSION, THEMES, TooltipNameType (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (10): _collection_exists(), format_context_for_prompt(), _get_embeddings(), RAG Retrieval Service Semantic vector lookup using Qdrant + Gemini text-embeddin, Retrieve the top-k most semantically relevant document chunks for a query.     O, Retrieve the top-k most semantically relevant document chunks for a query.     O, Format retrieved results into a clean context block to inject into the Gemini pr, Format retrieved results into a clean context block to inject into the Gemini pr (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (5): POST(), GET(), POST(), authenticateAdmin(), GET()

### Community 14 - "Community 14"
Cohesion: 0.39
Nodes (6): iso(), AgriVision Platform - Database Seed Script (matching actual Supabase schema), rdate(), seed_diagnoses(), seed_notifications(), seed_reports()

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (5): geistMono, geistSans, metadata, RootLayout(), QueryProvider()

### Community 18 - "Community 18"
Cohesion: 0.32
Nodes (4): _make_test_jwt(), Create a test JWT signed with the test secret., test_auth_validation(), test_auth_validation_admin()

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (6): AI_CONFIG, SYSTEM_PROMPTS, User, UserDTO, UserRole, UserSchema

### Community 21 - "Community 21"
Cohesion: 0.47
Nodes (3): handleDeleteReport(), handleGenerate(), saveReports()

### Community 23 - "Community 23"
Cohesion: 0.6
Nodes (3): handleNewChat(), handleSendMessage(), saveConversations()

### Community 25 - "Community 25"
Cohesion: 0.6
Nodes (3): hasRole(), isAdmin(), isFarmer()

### Community 29 - "Community 29"
Cohesion: 0.5
Nodes (3): generate_pdf_report_task(), Mock task for generating PDF report asynchronously.     In a real implementation, Mock task for generating PDF report asynchronously.     In a real implementation

## Knowledge Gaps
- **100 isolated node(s):** `Exports a PyTorch YOLO model to ONNX format.`, `Safely loads inference models, preferring ONNX for speed with PyTorch fallback.`, `Mock task for generating PDF report asynchronously.     In a real implementation`, `Generate PDF version of the QA Audit Reverification Report Usage: python script`, `Download a font file if not already present.` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `metrics()` connect `Community 2` to `Community 1`, `Community 6`, `Community 9`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `ingest_documents()` connect `Community 1` to `Community 10`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `query_knowledge_base()` connect `Community 1` to `Community 12`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `Exports a PyTorch YOLO model to ONNX format.`, `Safely loads inference models, preferring ONNX for speed with PyTorch fallback.`, `Mock task for generating PDF report asynchronously.     In a real implementation` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._