# Graph Report - agri-ai-platform  (2026-05-16)

## Corpus Check
- 129 files · ~1,619,731 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 290 nodes · 263 edges · 89 communities (83 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5c2168a8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
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
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 22 edges
2. `useAuth()` - 9 edges
3. `health()` - 7 edges
4. `GeminiAdvisoryService` - 6 edges
5. `predict()` - 6 edges
6. `Skeleton()` - 4 edges
7. `rdate()` - 4 edges
8. `iso()` - 4 edges
9. `ChatResponse` - 4 edges
10. `Button()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `GeminiAdvisoryService` --uses--> `TreatmentStep`  [INFERRED]
  services/advisory-service/app/services/gemini_service.py → services/advisory-service/app/schemas/chat.py
- `GeminiAdvisoryService` --uses--> `Diagnosis`  [INFERRED]
  services/advisory-service/app/services/gemini_service.py → services/advisory-service/app/schemas/chat.py
- `GeminiAdvisoryService` --uses--> `ChatResponse`  [INFERRED]
  services/advisory-service/app/services/gemini_service.py → services/advisory-service/app/schemas/chat.py
- `Alert()` --calls--> `alertVariants`  [EXTRACTED]
  apps/web/components/ui/alert.tsx → apps/admin/components/ui/alert.tsx
- `Badge()` --calls--> `badgeVariants`  [EXTRACTED]
  apps/web/components/ui/badge.tsx → apps/admin/components/ui/badge.tsx

## Communities (89 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (7): cn(), Badge(), badgeVariants, Skeleton(), cn(), TabsList(), tabsListVariants

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (4): fetchDashboardStats(), handleVerify(), handleScroll(), useAuth()

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (11): AgentState, get_disease_model(), health(), node_classify_crop(), node_diagnose_disease(), predict(), Diagnoses the disease based on the identified crop., Conditional edge router. (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, cn(), cn(), Dialog(), DialogClose(), DialogPortal(), DialogTrigger()

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (9): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), INITIAL_DIMENSION, THEMES, TooltipNameType (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.31
Nodes (7): BaseModel, ChatMessage, ChatRequest, ChatResponse, Diagnosis, TreatmentStep, GeminiAdvisoryService

### Community 8 - "Community 8"
Cohesion: 0.39
Nodes (6): iso(), AgriVision Platform - Database Seed Script (matching actual Supabase schema), rdate(), seed_diagnoses(), seed_notifications(), seed_reports()

### Community 9 - "Community 9"
Cohesion: 0.32
Nodes (3): Alert(), alertVariants, cn()

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (3): health_check(), API Gateway Service - Entry Point, Health check endpoint

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (6): AI_CONFIG, SYSTEM_PROMPTS, User, UserDTO, UserRole, UserSchema

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, RootLayout()

## Knowledge Gaps
- **22 isolated node(s):** `AgriVision Platform - Database Seed Script (matching actual Supabase schema)`, `Identifies the crop from the image.`, `Diagnoses the disease based on the identified crop.`, `Conditional edge router.`, `API Gateway Service - Entry Point` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 0` to `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 9`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Community 1` to `Community 11`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `GeminiAdvisoryService` (e.g. with `ChatResponse` and `Diagnosis`) actually correct?**
  _`GeminiAdvisoryService` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AgriVision Platform - Database Seed Script (matching actual Supabase schema)`, `Identifies the crop from the image.`, `Diagnoses the disease based on the identified crop.` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._