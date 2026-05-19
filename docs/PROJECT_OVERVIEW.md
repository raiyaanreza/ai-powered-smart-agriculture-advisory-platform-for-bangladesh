# 🌾 AgriVision AI — Unified Project Overview, System & Design Architecture

*A Modular, Agentic, Government-Scale Agricultural Operating System & Intelligence Ecosystem for Bangladesh*

---

## 1. Product Vision & Scope

### 1.1 Core Vision
AgriVision AI is built as a **government-grade AI agriculture operating system** tailored to:
* **Rural Bangladeshi Farmers**: Providing instant, low-bandwidth, voice-assisted disease diagnosis and treatment steps.
* **Mid-scale Food Suppliers**: Enabling digital crop quality tracking and crop management.
* **Agricultural Extension Officers / Agronomists**: Serving as an automated queue for verification, manual advisory overrides, and knowledge base publishing.
* **Ministry-level Decision Makers**: Offering high-fidelity geospatial intelligence, regional disease heatmap trends, and national alert broadcasts.

Beyond simple disease classification, the platform represents an **AI agricultural operating system** featuring domain-specific specialized agents, localized advisory workflows, and high-fidelity geospatial intelligence.

### 1.2 Core Product Philosophy
The system is designed around four key pillars:
1. **Bangla-native**: Deep integration of the Hind Siliguri font, locale-aware date formatting, and conversational AI flows natively in Bengali to ensure high usability in rural contexts.
2. **Agent-driven**: Multi-agent orchestration powered by **LangGraph** to handle complex diagnostic logic, weather risk overlays, and safety filters.
3. **Modular & Scalable**: A service-oriented monorepo backend where every microservice scale-out, ML model classifier, and frontend page is strictly isolated to prevent regression.
4. **Premium UX**: Highly distinct visual design utilizing a cohesive **glassmorphism** theme, animated background particles, and a glowing, real-time national GIS map.

### 1.3 High-Level System Scope

#### Phase 1 — AI Disease Detection Portal (COMPLETED & VERIFIED)
* **Features**: Multi-crop category classification, specialized crop family model routing, severity estimation, and localized treatment recommendations.
* **Local Adaptation**: Bilingual reports (English/Bangla) and interactive advisory chat interface.

#### Phase 2 — National Command Center (COMPLETED & VERIFIED)
* **GIS Outbreak Intelligence**: Interactive SVG map showing disease hotspots and regional trends across Bangladesh divisions.
* **National Alert System**: Instant digital broadcast form of critical weather, pest, and advisory warnings stored in Supabase and broadcasted dynamically.
* **Disease Library**: Dynamic reference library containing 22 high-resolution entries mapping crop categories, visual symptoms, and BARI/BRRI-grounded guidelines.

#### Phase 3 — Agentic Ecosystem & Infrastructure Hardening (COMPLETED & VERIFIED)
* **LangGraph Advisory Engine**: Fully integrated multi-turn conversational agents grounded by RAG search and safety safeguards.
* **Infrastructure Parity**: Complete dockerization of all 14 backend microservices, Redis celery task brokers, and custom unit testing suites for zero drift.

---

## 2. Technical & System Architecture

### 2.1 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 6, Tailwind CSS 4, shadcn/ui 4, Framer Motion |
| **Backend** | FastAPI 0.136, Python 3.12, SQLAlchemy 2.0 (Relational), Celery 5.4, Uvicorn |
| **AI / ML / Agents** | PyTorch 2.11, ONNX Runtime, LangGraph 1.1, LangChain 1.2, Qdrant 1.13, Gemini 3.1 Flash Lite |
| **Data & Storage** | Supabase, PostgreSQL, Redis 7 (Cache/Job Broker), Qdrant (Vector), S3-compatible Object Storage |
| **Infra & DevOps** | Docker, Docker Compose, Kubernetes, Terraform, GitHub Actions, Prometheus, LangSmith |

### 2.2 Monorepo Structure
The repository is managed as a unified monorepo to ensure shared configuration and packages.

```text
agri-ai-platform/
├── apps/
│   ├── web/                    # Public & Farmer Dashboard (Next.js)
│   ├── admin/                  # Government & Expert Command Center (Next.js)
│   └── docs/                   # System Documentation
│
├── services/
│   ├── api-gateway/            # Asynchronous proxying & security gate (Port 8000)
│   ├── advisory-service/       # LLM chat & diagnostic details resolver (Port 8001)
│   ├── crop-routing-service/   # YOLO crop family router (Port 8002)
│   ├── agent-orchestrator/     # LangGraph workflow engine (Port 8003)
│   ├── auth-service/           # Microservice JWT RBAC validator (Port 8004)
│   ├── notification-service/   # Dynamic SMS & alert gateway (Port 8005)
│   ├── analytics-service/      # Regional telemetry & statistics provider (Port 8006)
│   ├── report-service/         # Asynchronous PDF generation engine (Port 8007)
│   ├── rag-service/            # Semantic agronomic knowledge query stubs (Port 8008)
│   ├── disease-rice-service/   # Specialized YOLO rice model (Port 8010)
│   ├── disease-brassica-serv/  # Specialized YOLO mustard/cabbage model (Port 8011)
│   ├── disease-corn-service/   # Specialized YOLO corn model (Port 8012)
│   ├── disease-potato-service/ # Specialized YOLO potato model (Port 8013)
│   └── disease-wheat-service/  # Specialized YOLO wheat model (Port 8014)
│
├── models/
│   ├── crop-classifier/        # YOLO crop classifier weights (best.pt)
│   ├── brassica-disease/       # YOLO Brassica weights (best.pt)
│   ├── rice-disease/           # YOLO Rice weights (best.pt)
│   ├── corn-disease/           # YOLO Corn weights (best.pt)
│   ├── potato-disease/         # YOLO Potato weights (best.pt)
│   ├── wheat-disease/          # YOLO Wheat weights (best.pt)
│   └── shared-model-utils/     # ONNX exporters & inference loading libraries
│
├── packages/
│   ├── ui/                     # Shared React components (Input, Card, Modal)
│   ├── config/                 # Centralized port & URL endpoints mapping
│   ├── types/                  # Standard TypeScript schemas & interface bindings
│   ├── schemas/                # Shared Zod validation schemas (Diagnosis, Profile)
│   ├── constants/              # Bangladesh divisions, crop names, severity grades
│   ├── prompts/                # Unified prompts repository (Advisory prompts)
│   ├── ai-tools/               # Configured AI configs (gemini-3.1-flash-lite)
│   ├── auth/                   # Shared React auth hooks & RBAC checks
│   └── utils/                  # Date formatting, HTML sanitizers, color metrics
│
├── infrastructure/
│   ├── docker/                 # Deployment Dockerfiles
│   ├── kubernetes/             # ClusterIP service and deployment templates
│   ├── terraform/              # Infrastructure-as-code state setups
│   ├── monitoring/             # Prometheus configuration files
│   └── ci-cd/                  # GitHub Actions workflow specifications
└── README.md
```

### 2.3 Layered Architecture & Features

#### Public Web App (`apps/web`)
* **Landing Page**: Implements high-impact sections, scroll-driven Pipeline animations, stagger effects, and glassmorphic card grids.
* **Intelligent Uploader**: Features image-drag-and-drop, real-time feedback, size and content-type validation, and Vertical stet-grid stack options on mobile layouts.
* **Advisory Chat**: Multi-turn chat grounded with RAG models, custom sleek scrollbars, and dual-stage auto-scrolling to perfectly tracking responses.
* **Dynamic Library**: Displays 22 categorized entries with live searching, responsive pagination grids, and treatment guidelines.

#### Government Command Center (`apps/admin`)
* **Live Telemetry & Heatmap**: Glowing dashboard tiles featuring diagnostic counters, model accuracies, active broadcast indicators, and interactive SVG geospatial analytics.
* **Farmer Verification Queue**: Expert moderation layout supporting real-time document viewing, visual certifications, and administrative approvals.
* **National Broadcast Broadcaster**: Form-based broadcaster to instantly issue advisory, weather, and pesticide warnings to the platform.
* **System Operations Panel**: Administrative shell detailing PostgreSQL migration steps, system-wide status telemetry, and active Docker port mapping.

---

## 3. Experience & Design Architecture

### 3.1 Design System Direction
* **Visual Identity**: Premium agricultural and authoritative government-grade. High-contrast elements, Earth Green, and Harvest Gold typography.
* **Unified Glassmorphism**: Cards and panels utilize `bg-white/70 backdrop-blur-lg` styling with ultra-soft, multi-layered shadows and thin borders to create a lightweight, responsive feel.
* **Animated Semantic Map**: Features an interactive SVG outline of Bangladesh containing glows, pulsars, and hover telemetry to show outbreak activity in districts like Dhaka, Chittagong, Rajshahi, and Barisal.
* **Typography Hierarchy**: Uses Inter for functional English UI interfaces and Hind Siliguri with LTR Bengali subset support to maintain high readability in the local script.

### 3.2 Spacing & Radii Strategy
* **Border Radii scale**: Sm: `rounded-lg` (8px), Md: `rounded-xl` (12px), Lg: `rounded-2xl` (16px), Xl: `rounded-3xl` (24px). Border radii are capped on mobile screens to preserve maximum content area.
* **Responsive Paddings**: Grids, containers, and sections use responsive utility classes (e.g. `py-12 sm:py-16 lg:py-24`) to optimize vertical layouts across mobile and desktop.

### 3.3 User Roles & Journeys
* **Guest User**: Landing Page → Upload Image → Crop Detection & Routing → Quick Diagnosis Result → Registration CTA.
* **Registered Farmer**: Personalized Dashboard → Upload/History → Severe Outbreak Alerts → Multi-turn Advisory chat.
* **Agronomist / Expert**: Review Verification Queue → Review Low-confidence Model Classifications → Manual Overrides.
* **Government Officer**: Regional Heatmap Trends → Alert Broadcaster → AI Governance logs & model performance charts.

---

## 4. AI & Agentic Orchestration

### 4.1 Specialized Routing Pipeline
Instead of relying on a single monolithic model, AgriVision leverages a **specialist-based routing strategy**:

```text
User Input Image
  │
  ▼
api-gateway (X-Internal-Token verification)
  │
  ▼
crop-routing-service (YOLO Crop Classifier)
  │
  ├─► Rice ─────► disease-rice-service (YOLO Rice Model)
  ├─► Mustard ──► disease-brassica-service (YOLO Brassica Model)
  ├─► Corn ─────► disease-corn-service (YOLO Corn Model)
  ├─► Potato ───► disease-potato-service (YOLO Potato Model)
  └─► Wheat ────► disease-wheat-service (YOLO Wheat Model)
  │
  ▼
agent-orchestrator (LangGraph workflow)
  │
  ├─► RAG Grounding Verification (RAG stubs)
  ├─► Safety Filter & Bangla Localization
  ▼
Advisory Output (Bilingual Treatment Steps)
```

### 4.2 Multi-Agent LangGraph Workflow
1. **Intake Agent**: Classifies user query intent (diagnosis, weather, price, or general advice).
2. **Crop Router Agent**: Oversees image data stream parsing and passes payloads to the correct YOLO disease service.
3. **Advisory Agent**: Formulates clear treatment options, localized fertilizer doses, and irrigation recommendations.
4. **Safety & RAG Verification Agent**: Cross-references AI recommendations with BARI/BRRI handbook documents, adding necessary disclaimers and safety warnings.
5. **Localization Agent**: Translates technical descriptions into simple, friendly Bengali script.

---

## 5. Security, Quality Assurance & Hardening

The system has undergone a comprehensive code-level security and performance hardening process:

### 5.1 Critical Security Hardening
* **Inter-Service Communication Protection**: All downstream FastAPI endpoints are protected by dynamic verification handlers using `INTERNAL_SHARED_SECRET` validation, verifying authorized requests via `X-Internal-Token` headers.
* **Elimination of Hardcoded Production Secrets**: Production databases, Supabase Client variables, and LLM configuration keys are completely bound to environment scopes (`.env` / `.env.local`).
* **Path Traversal Remediation**: All 6 file-upload endpoints process filenames through secure filename sanitizers (`secure_filename` logic), preventing attackers from writing files arbitrarily outside designated temp directories.
* **Upload Boundaries & DDoS Defense**: Implemented request size limits (max 10MB) and content-type validation constraints (`image/` MIME-types strictly) on all file intake pathways.

### 5.2 Code Quality & DRY Alignment
* **Asynchronous Event Handling**: Integrated `httpx.AsyncClient` asynchronous proxy networks inside `api-gateway` to guarantee non-blocking forwarding to sub-services.
* **Structured Logging**: Replaced flat print logs with standardized, level-based logs mapping correlation context.
* **Offline Pytest Integration**: Populated microservices with mock testing coverage, decoupling unit logic from runtime databases or live model weights.
* **TypeScript & Zod Strict Gating**: Sync'd package bindings between frontends and backend structures, implementing explicit types to suppress unsafe `any` occurrences.

### 5.3 Infrastructure & Dockerization Parity
* **Multi-Service Composition**: Root `docker-compose.yml` natively orchestrates all 14 backend microservices and the frontend components.
* **Broken Dockerfiles Fixed**: Rebuilt `agent-orchestrator` and `advisory-service` container layers with correct system builders, pip package installations, and Uvicorn commands.
* **Dev Reload Stripped**: Cleaned developer auto-reload parameters (`--reload`) from production launch configs to increase memory efficiencies.
* **Redis Task Worker Integration**: Initialized Celery workers to handle PDF exports in the background, utilizing Redis as the task broker.

---

## 6. Strategic Implementation Checklist (For Operators)

When maintaining or deploying AgriVision AI, ensure you follow these strict development steps:

- [ ] **Lock Scopes to Feature Folders**: Always contain changes inside the designated subfolder (e.g. `apps/web/features/diagnosis/`).
- [ ] **Enforce Shared Schema Contracts**: Before changing request/response structures, update shared schemas (`packages/schemas/` or local Python models) first.
- [ ] **Run Workspace static checks**: Execute `pnpm run build` and backend `pytest` triggers to confirm static type safety and pass active unit coverage metrics.
- [ ] **Never hardcode credentials**: Move all keys, endpoints, and secrets to environmental files.
- [ ] **Update Documentation**: Always update `CURRENT_STATE.md` and feature `README.md` files when behavioral logic is changed.

---
*Document owner: Senior Software Architect | Last revised: 2026-05-19*
