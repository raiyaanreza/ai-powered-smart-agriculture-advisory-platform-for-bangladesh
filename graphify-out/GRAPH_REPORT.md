# Graph Report - agri-ai-platform  (2026-05-17)

## Corpus Check
- 136 files · ~1,638,270 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 346 nodes · 342 edges · 93 communities (88 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `43e57d83`
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
- [[_COMMUNITY_Community 45|Community 45]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 22 edges
2. `clean_text()` - 11 edges
3. `AuditReportPDF` - 11 edges
4. `build_pdf()` - 10 edges
5. `useAuth()` - 9 edges
6. `GeminiAdvisoryService` - 8 edges
7. `health()` - 7 edges
8. `predict()` - 6 edges
9. `Skeleton()` - 4 edges
10. `rdate()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `GeminiAdvisoryService` --uses--> `TreatmentStep`  [INFERRED]
  services/advisory-service/app/services/gemini_service.py → services/advisory-service/app/schemas/chat.py
- `GeminiAdvisoryService` --uses--> `Diagnosis`  [INFERRED]
  services/advisory-service/app/services/gemini_service.py → services/advisory-service/app/schemas/chat.py
- `GeminiAdvisoryService` --uses--> `ChatResponse`  [INFERRED]
  services/advisory-service/app/services/gemini_service.py → services/advisory-service/app/schemas/chat.py
- `GeminiAdvisoryService` --uses--> `CropAnalysisResponse`  [INFERRED]
  services/advisory-service/app/services/gemini_service.py → services/advisory-service/app/schemas/chat.py
- `Alert()` --calls--> `alertVariants`  [EXTRACTED]
  apps/web/components/ui/alert.tsx → apps/admin/components/ui/alert.tsx

## Communities (93 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (7): cn(), Badge(), badgeVariants, Skeleton(), cn(), TabsList(), tabsListVariants

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (8): fetchDashboardStats(), handleVerify(), ImageUploader(), handleScroll(), ResultDisplay(), useAuth(), useDiagnoseImage(), useDiagnosisStats()

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (21): FPDF, AuditReportPDF, build_pdf(), clean_text(), download_font(), Generate PDF version of the QA Audit Reverification Report Usage: python script, Add a section title (H1)., Add a sub-title (H2). (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (11): AgentState, get_disease_model(), health(), node_classify_crop(), node_diagnose_disease(), predict(), Diagnoses the disease based on the identified crop., Conditional edge router. (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, cn(), cn(), Dialog(), DialogClose(), DialogPortal(), DialogTrigger()

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (12): BaseModel, CalendarMilestone, ChatMessage, ChatRequest, ChatResponse, CropAnalysisRequest, CropAnalysisResponse, Diagnosis (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.16
Nodes (9): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), INITIAL_DIMENSION, THEMES, TooltipNameType (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.39
Nodes (6): iso(), AgriVision Platform - Database Seed Script (matching actual Supabase schema), rdate(), seed_diagnoses(), seed_notifications(), seed_reports()

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (5): geistMono, geistSans, metadata, RootLayout(), QueryProvider()

### Community 10 - "Community 10"
Cohesion: 0.32
Nodes (3): Alert(), alertVariants, cn()

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (3): health_check(), API Gateway Service - Entry Point, Health check endpoint

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (6): AI_CONFIG, SYSTEM_PROMPTS, User, UserDTO, UserRole, UserSchema

### Community 15 - "Community 15"
Cohesion: 0.47
Nodes (3): handleDeleteReport(), handleGenerate(), saveReports()

### Community 17 - "Community 17"
Cohesion: 0.6
Nodes (3): handleNewChat(), handleSendMessage(), saveConversations()

## Knowledge Gaps
- **35 isolated node(s):** `Generate PDF version of the QA Audit Reverification Report Usage: python script`, `Download a font file if not already present.`, `Remove emoji characters that can't render in the font.`, `Remove **bold** markers from text.`, `Remove [text](url) markdown links.` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 0` to `Community 10`, `Community 4`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `Generate PDF version of the QA Audit Reverification Report Usage: python script`, `Download a font file if not already present.`, `Remove emoji characters that can't render in the font.` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._