# Graph Report - agri-ai-platform  (2026-05-19)

## Corpus Check
- 287 files · ~1,668,224 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 607 nodes · 490 edges · 236 communities (228 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `804b2c9d`
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
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 60|Community 60]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 24 edges
2. `health()` - 12 edges
3. `clean_text()` - 11 edges
4. `AuditReportPDF` - 11 edges
5. `build_pdf()` - 10 edges
6. `useAuth()` - 9 edges
7. `GeminiAdvisoryService` - 9 edges
8. `authenticateAdmin()` - 8 edges
9. `verify_internal_token()` - 8 edges
10. `predict()` - 6 edges

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

## Communities (236 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (10): cn(), Alert(), alertVariants, cn(), Badge(), badgeVariants, Skeleton(), cn() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (30): broadcast_notification(), BroadcastRequest, generate_report(), get_diagnoses_metrics(), get_outbreaks_telemetry(), health(), predict(), query_knowledge_base() (+22 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (21): FPDF, AuditReportPDF, build_pdf(), clean_text(), download_font(), Generate PDF version of the QA Audit Reverification Report Usage: python script, Add a section title (H1)., Add a sub-title (H2). (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (24): AgentState, diagnose(), get_disease_model(), metrics(), node_classify_crop(), node_diagnose_disease(), Diagnoses the disease based on the identified crop., Identifies the crop from the image. (+16 more)

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (16): BaseModel, CalendarMilestone, ChatMessage, ChatRequest, ChatResponse, CropAnalysisRequest, CropAnalysisResponse, Diagnosis (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (6): ImageUploader(), handleScroll(), ResultDisplay(), useAuth(), useDiagnoseImage(), useDiagnosisStats()

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (9): fetchDashboardStats(), handleVerify(), AlertsTab(), MetricCard(), OverviewTab(), SidebarLink(), SystemTab(), VerificationCard() (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, cn(), cn(), Dialog(), DialogClose(), DialogPortal(), DialogTrigger()

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (9): direct_diagnose(), health_check(), API Gateway Service - Entry Point with Asynchronous Reverse Proxying, Direct route for YOLO crop/disease diagnostics, Direct route for YOLO crop/disease diagnostics, Health check endpoint, Health check endpoint, Generically proxy incoming gateway traffic to downstream services (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.16
Nodes (9): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), INITIAL_DIMENSION, THEMES, TooltipNameType (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (5): POST(), GET(), POST(), authenticateAdmin(), GET()

### Community 12 - "Community 12"
Cohesion: 0.39
Nodes (6): iso(), AgriVision Platform - Database Seed Script (matching actual Supabase schema), rdate(), seed_diagnoses(), seed_notifications(), seed_reports()

### Community 13 - "Community 13"
Cohesion: 0.25
Nodes (5): geistMono, geistSans, metadata, RootLayout(), QueryProvider()

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (6): AI_CONFIG, SYSTEM_PROMPTS, User, UserDTO, UserRole, UserSchema

### Community 17 - "Community 17"
Cohesion: 0.47
Nodes (3): handleDeleteReport(), handleGenerate(), saveReports()

### Community 19 - "Community 19"
Cohesion: 0.6
Nodes (3): handleNewChat(), handleSendMessage(), saveConversations()

### Community 21 - "Community 21"
Cohesion: 0.6
Nodes (3): hasRole(), isAdmin(), isFarmer()

## Knowledge Gaps
- **66 isolated node(s):** `Exports a PyTorch YOLO model to ONNX format.`, `Safely loads inference models, preferring ONNX for speed with PyTorch fallback.`, `Mock task for generating PDF report asynchronously.     In a real implementation`, `Generate PDF version of the QA Audit Reverification Report Usage: python script`, `Download a font file if not already present.` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `verify_internal_token()` connect `Community 1` to `Community 8`, `Community 3`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 0` to `Community 9`, `Community 10`, `Community 7`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `health()` connect `Community 1` to `Community 3`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `Exports a PyTorch YOLO model to ONNX format.`, `Safely loads inference models, preferring ONNX for speed with PyTorch fallback.`, `Mock task for generating PDF report asynchronously.     In a real implementation` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._