# AI Agriculture Advisory Platform — Architecture

## 1. Purpose of This Document

This document defines the root architecture for the AI agriculture advisory platform so that AI agents, developers, and future engineers can work independently without breaking system integrity. It is written as the primary reference for incremental development, modular implementation, and future scale-up toward government and business deployment in Bangladesh.

The system is designed to support:

* crop image diagnosis through specialized models,
* agentic advisory workflows,
* Bangla-first user interaction,
* public-scale web access,
* modular feature development,
* future expansion into mobile, IoT, and government analytics.

This document should be treated as a living architecture contract.

---

## 2. Vision & Product Philosophy

### 2.1 Vision

Build a **government-grade AI agriculture platform** focused on:
* Rural Bangladeshi farmers
* Mid-scale food suppliers
* Agricultural officers and extension workers
* Ministry-level decision makers

The platform acts as a unified ecosystem for disease diagnosis, crop advisory, weather-risk alerts, and national agricultural intelligence.

**Core Innovation**: Beyond simple detection, the platform is an **AI agricultural operating system** with modular agents, localized advisory workflows, and high-fidelity geospatial intelligence.

### 2.2 Core Product Philosophy

The system is designed to be:
* **Bangla-native**: First-class support for regional language and conversational advisory.
* **Agent-driven**: Intelligent orchestration of complex advisory tasks using LangGraph.
* **Modular & Scalable**: Horizontally scalable architecture for government-level deployment.
* **Premium UX**: High-fidelity glassmorphic interfaces with real-time data visualizations.

### 2.3 Product Experience Philosophy

The platform bridges the gap between complex AI and rural accessibility:
* **Simple for Rural Farmers**: Minimal cognitive load, high contrast, and voice-assisted.
* **Professional for Government Officials**: Data-heavy, analytical, and authoritative.
* **Bangla-native**: Regional language and voice-first interaction.
* **Trustworthy**: Transparent AI confidence levels and RAG-verified guidance.

---

## 3. Product Architecture Goals

### 3.1 Primary goals

* Serve farmers with fast, trustworthy, localized agricultural guidance.
* Support crop disease detection using crop-specific routing.
* Keep every major subsystem independently maintainable.
* Make the platform easy for AI agents to extend.
* Reduce human engineering cost by creating a strong AI-friendly code structure.
* Prepare the platform for public sector and large-user deployments.

### 3.2 Non-goals for early phases

* No single monolithic model for all crops.
* No tightly coupled frontend-backend logic.
* No hardcoded AI prompts inside UI components.
* No feature implementation directly inside shared utility files unless it is truly reusable.
* No premature optimization outside the core diagnosis and advisory flows.

---

## 4. System Design Principles

1. **Modularity first**
   Every feature must live in an isolated boundary.

2. **Contract-driven development**
   UI, API, model services, and agent services must communicate through explicit schemas.

3. **Domain separation**
   Frontend, backend, ML, and agent orchestration must not depend on each other internally beyond published interfaces.

4. **Async-by-default**
   AI calls, inference jobs, report generation, and notifications should be treated as asynchronous workflows wherever possible.

5. **AI-agent friendly structure**
   The repository must be easy for coding agents to understand, search, modify, and test with low token overhead.

6. **Human override and auditability**
   Every advisory action should be traceable.

7. **Bangla-first user experience**
   The platform should be understandable to rural and mid-level farmers in Bangladesh.

---

## 5. High-Level System Scope

### Phase 1 — AI Disease Detection Portal (COMPLETED)
* **Features**: Crop category detection, specialized rice disease routing, severity estimation, and treatment recommendations.
* **Local Adaptation**: Bangla reports and interactive advisory chat.

### Phase 2 — National Command Center (COMPLETED)
* **GIS Outbreak Intelligence**: Real-time interactive map showing disease hotspots across Bangladesh.
* **National Alert System**: Instant broadcast of critical weather and pest warnings.
* **Disease Library**: National visual reference gallery for verified agricultural data.

---

## 6. Feature Ecosystem

### A. AI Crop Diagnosis & Advisory
* **Multi-turn Advisory Chat**: LangGraph-powered conversational agent that remembers context and provides localized treatment steps.
* **Visual Disease Library**: Curated database of crop diseases with high-resolution visual markers for expert and farmer reference.

### B. National Command Center
* **Live Heatmaps & Predictive Spread**: Regional disease trend analysis for agricultural offices with pulse-animated hotspots.
* **Verification Workflow**: Administrative control over the national agricultural knowledge base.

### C. UI/UX Innovation
* **Semantic Map Background**: An animated, glowing map of Bangladesh integrated into the dashboard, providing a sense of geographical scale and real-time connectivity.
* **Glassmorphism**: A modern, transparent design system that balances technical density with visual clarity.

---

## 7. Recommended Architecture Style

The overall system should be a **modular monorepo with service-oriented backend architecture**.

### Why this style fits the project

* Multiple teams can work without blocking each other.
* AI agents can operate on narrow scopes.
* Model services can scale independently.
* Frontend pages and admin modules remain isolated.
* Shared logic stays in versioned packages.

### High-level layers

* **Presentation layer**: web app, admin app, future mobile app.
* **API layer**: gateway and public APIs.
* **Business logic layer**: advisory services, workflow orchestration, user management, analytics.
* **AI layer**: crop classifier, disease classifiers, RAG assistant, agent graph.
* **Data layer**: relational DB, vector DB, object storage, cache, event queue.
* **Infrastructure layer**: containerization, CI/CD, observability, deployments.

---

## 8. Technology Stack

### 8.1 Frontend

* **Next.js** for the web application and public portal.
* **TypeScript** for strong typing and safer AI-assisted refactoring.
* **Tailwind CSS** for rapid layout consistency.
* **shadcn/ui** for reusable UI primitives.
* **Framer Motion** for focused motion where it improves clarity.
* **TanStack Query** for client data caching and server synchronization.
* **Zod** for schema validation at the UI boundary.

### 8.2 Backend

* **FastAPI** as the main backend framework.
* **Python** for ML and AI ecosystem compatibility.
* **Pydantic** for request/response contracts.
* **SQLAlchemy or SQLModel** for database access.
* **Celery or Dramatiq** for background jobs.
* **Redis** for caching, queues, and session support.

### 8.3 AI / ML / Agent Layer

* **PyTorch** for model inference and future training workflows.
* **ONNX Runtime** for optimized inference where possible.
* **LangGraph** for structured agent workflows.
* **LangChain** for retrieval, tool usage, and chain composition.
* **Qdrant** for vector search and RAG memory.
* **LLM provider APIs** for hosted generation, summarization, and translation tasks.
* **Whisper-style or equivalent speech services** if voice features are added later.

### 8.4 Data and Storage

* **PostgreSQL** as the core relational database.
* **PostGIS** if geo-based agricultural analytics are required.
* **Qdrant** as vector database.
* **Redis** as cache and job broker.
* **S3-compatible object storage** for images, documents, model artifacts, and reports.

### 8.5 DevOps and Delivery

* **Docker** for local reproducibility.
* **Docker Compose** for developer environments.
* **Kubernetes** for scale-out deployments.
* **GitHub Actions** for CI/CD.
* **Prometheus + Grafana** for metrics and dashboards.
* **Centralized logs** through Loki or a similar stack.
* **LangSmith or equivalent** for agent tracing and debugging.

### 8.6 API and Integration

* REST for public and internal APIs.
* WebSockets or SSE for streaming AI responses.
* OpenAPI-first contracts for all services.
* Auth layer compatible with email, phone, and future government identity integration.

---

## 9. Monorepo Root Structure

```text
agri-ai-platform/
├── apps/
│   ├── web/
│   ├── admin/
│   ├── docs/
│   └── mobile-web/                # optional later
│
├── services/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── crop-routing-service/
│   ├── disease-brassica-service/
│   ├── disease-rice-service/
│   ├── disease-corn-service/
│   ├── disease-potato-service/
│   ├── disease-wheat-service/
│   ├── rag-service/
│   ├── agent-orchestrator/
│   ├── advisory-service/
│   ├── analytics-service/
│   ├── notification-service/
│   └── report-service/
│
├── models/
│   ├── crop-classifier/
│   ├── brassica-disease/
│   ├── rice-disease/
│   ├── corn-disease/
│   ├── potato-disease/
│   ├── wheat-disease/
│   └── shared-model-utils/
│
├── packages/
│   ├── ui/
│   ├── config/
│   ├── types/
│   ├── schemas/
│   ├── constants/
│   ├── prompts/
│   ├── ai-tools/
│   ├── auth/
│   └── utils/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   ├── monitoring/
│   └── ci-cd/
│
├── datasets/
├── notebooks/
├── experiments/
├── scripts/
├── docs/
└── README.md
```

---

## 10. Frontend Architecture

### 10.1 Frontend goals

The frontend must remain fast, accessible, and easy to extend without interfering with business logic.

### 10.2 Frontend boundaries

* UI only renders data and sends actions.
* UI never contains model logic.
* UI never calls model files directly.
* All external communication must go through API clients or server actions.

### 10.3 Main frontend modules

#### Public web app

* Landing page
* About project
* Crop upload and diagnosis page
* AI chat and advisory page
* Knowledge articles
* FAQ and help center
* Contact support
* Language switcher

#### Farmer dashboard

* Diagnosis history
* Saved advisories
* Nearby alerts
* Recommended actions
* Voice guidance

#### Admin dashboard

* User activity overview
* Disease trend map
* Model performance metrics
* Manual moderation queue
* Knowledge base management

### 10.4 Frontend folder design

```text
apps/web/
├── app/
│   ├── (public)/
│   ├── (dashboard)/
│   ├── (auth)/
│   └── api/
├── components/
├── features/
│   ├── diagnosis/
│   ├── advisory/
│   ├── articles/
│   ├── alerts/
│   └── profile/
├── hooks/
├── lib/
├── styles/
├── i18n/
└── tests/
```

### 10.5 Frontend development rules

* Each feature should own its own UI, hooks, schemas, and API adapters.
* Reusable shared UI must go into `packages/ui`.
* Page-level logic should remain in the feature folder.
* Avoid global state unless it is truly cross-cutting.
* Prefer route-based modularity over large shared containers.

---

## 11. Backend Architecture

### 11.1 Backend goals

The backend must provide stable contracts, isolate AI logic, and support long-running workflows.

### 11.2 Core backend services

#### API Gateway
* route requests, enforce auth, rate limit public endpoints, aggregate downstream service responses, centralize API versioning.

#### Auth Service
* user registration, login/logout, session handling, role-based access control, future government identity integration.

#### Crop Routing Service
* determine crop family from image or metadata, route to the correct disease model, return routing confidence, handle fallback logic.

#### Disease Model Services
Separate services for each crop family.
* infer disease class, estimate confidence, provide severity signals, return model metadata and version.

#### Advisory Service
* convert diagnosis results into practical advice, format treatment steps, localize recommendations into Bangla, adapt advice to region and crop stage.

#### RAG Service
* retrieve policy and agriculture knowledge, ground AI answers in trusted documents, provide citations or source references internally.

#### Agent Orchestrator
* coordinate multi-step workflows, call tools in sequence, manage branching and fallback, maintain state across agent steps.

#### Analytics Service
* store usage metrics, track region-level disease trends, support dashboards, generate reports for officers and administrators.

#### Notification Service
* SMS/email/push notifications, advisory reminders, outbreak alerts, scheduled weather warnings.

#### Report Service
* generate PDF reports, create downloadable advisory summaries, create government-ready exports.

### 11.3 Backend folder design pattern

Each service should follow a consistent shape.

```text
service-name/
├── app/
│   ├── api/
│   ├── core/
│   ├── domain/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── workers/
│   └── main.py
├── tests/
├── Dockerfile
└── README.md
```

### 11.4 Backend design rules

* Keep domain logic inside `domain` or `services`.
* Keep database access inside repositories.
* Keep request validation in schemas.
* Keep orchestration logic out of endpoint handlers.
* Keep each service deployable on its own.

---

## 12. Model Architecture

### 12.1 Model system goals

The model layer should remain specialist-based rather than universal.

### 12.2 Model strategy

* First classify crop type.
* Route to the correct crop family service.
* Run the crop-specific disease model.
* Return diagnosis.
* Pass output to the advisory pipeline.

### 12.3 Model services

Each crop family should be treated as a separate model domain.

Suggested model packages:

* `crop-classifier`
* `brassica-disease`
* `rice-disease`
* `corn-disease`
* `potato-disease`
* `wheat-disease`

### 12.4 Model service contract

Each model service should expose the same interface:

* input image
* optional crop metadata
* output class label
* confidence
* severity estimate
* top-k probabilities
* model version
* inference duration

### 12.5 Model serving principles

* Standardize preprocessing.
* Keep versioned inference pipelines.
* Store model metadata with reproducibility details.
* Use ONNX or equivalent only when it improves speed or deployment reliability.
* Do not mix training code with production inference code.

### 12.6 Model lifecycle structure

```text
datasets/ -> notebooks/ -> experiments/ -> model registry -> service deployment -> monitoring -> retraining
```

---

## 13. Agentic Workflow Architecture

This is the core intelligence layer of the platform.

### 13.1 Why agent workflows are needed

A single LLM response is not enough for a government-grade advisory system. The system needs workflow control, tool usage, fallback policies, memory, and validation.

### 13.2 Recommended orchestration framework

* Use **LangGraph** as the primary workflow engine.
* Use **LangChain** for tools, retrievers, prompt composition, and integrations.
* Use a dedicated agent service rather than embedding orchestration inside the frontend or general API routes.

### 13.3 Primary Agent Roles

#### 1. Crop Intake Agent (Intent & Routing)
* **Purpose**: Identifies intent (diagnosis, pricing, weather, advice).
* **Action**: Detects crop family and routes to specialized models or fallback classifiers.

#### 2. Farmer Advisory Agent
* **Purpose**: Provides treatment/prevention steps in Bangla.
* **Answers**: Pesticide usage, fertilizer dosage, irrigation timing, etc.

#### 3. Weather Risk Agent
* **Purpose**: Combines Weather API data with crop stages and disease risk models.
* **Warnings**: "High fungal infection risk in next 3 days."

#### 4. Government Subsidy Agent
* **Purpose**: Helps farmers find and apply for digital subsidies and schemes.

#### 5. Marketplace Intelligence Agent
* **Purpose**: Provides local crop prices, demand prediction, and selling suggestions.

#### 6. Emergency Outbreak Agent
* **Purpose**: Detects regional trends (e.g., "Brown spot increasing in Rajshahi") for early warning.

#### 7. RAG Verification & Safety Agent
* **Purpose**: Checks advice against BARI/BRRI documents to ensure context grounding and safety.

#### 8. Escalation Agent
* **Purpose**: Decides when to ask for more images or suggest human expert review.

### 13.4 Core Agent Workflow Chain

```text
User Input
→ Intent Agent
→ Crop Routing Agent
→ Specialized Model Service
→ Diagnosis Interpreter
→ Advisory Agent
→ RAG Verification Agent
→ Localization Agent
→ Response Formatter
→ User Output
```

### 13.5 Core Interaction Workflows

#### Disease Diagnosis Workflow
```text
Upload Image → Validation → Crop Detection → Disease Routing → AI Inference → Severity Check → RAG Verification → Localized Response (Bangla) → Save/Share
```

#### AI Advisory Workflow
```text
Query → Intent Detection → Knowledge Retrieval → Context Injection → Generation → Safety Guardrail → Voice/Text Response
```

---

## 14. Data Architecture

### 14.1 Core database entities

The relational database should store:
* users, roles, diagnoses, advisories, crops, disease classes, model versions, agent runs, alert subscriptions, documents, feedback, and audit logs.

### 14.2 Storage Boundaries
* **PostgreSQL**: Relational data, history, and moderation records.
* **Qdrant**: Vector embeddings for RAG and semantic search.
* **Redis**: Cache, job queues, and temporary workflow state.
* **S3-Compatible Storage**: Images, PDF reports, and model weights.

### 14.3 Authentication Flow
* **Guest**: Session-based (temporary).
* **User**: Email/Google Login (Phase 1) → Phone/OTP (Phase 2).
* **Official**: Role-based Access Control (RBAC) with audit logging.

---

## 15. User Roles & Journeys

### A. Guest User (Non-Registered)
* **Description**: Visitors exploring the site for the first time.
* **Goal**: Immediate value demonstration (Aha! moment).
* **Allowed**: Limited AI diagnosis, article browsing, public alerts.
* **Journey**: Landing Page → Upload Image → AI Result → Registration CTA.

### B. Registered Farmer/User
* **Description**: The primary audience (rural farmers, rooftop gardeners).
* **Goal**: Long-term crop health management.
* **Allowed**: Full diagnosis history, severity tracking, localized alerts, personalized AI chat assistant.
* **Journey**: Dashboard → Upload/History → Advisory → Action/Alerts.

### C. Agricultural Expert / Agronomist
* **Description**: Verified specialists validating AI outputs.
* **Goal**: Ensure quality and safety of advice.
* **Allowed**: Review queue for low-confidence cases, manual advisory overriding, knowledge base publishing.

### D. Government / Admin User
* **Description**: Regional/National agricultural officers.
* **Goal**: High-level monitoring and policy enforcement.
* **Allowed**: National disease heatmap, regional outbreak analytics, AI governance audit logs.

### E. Super Admin
* **Description**: Technical platform operators.
* **Goal**: System integrity and resource management.

---

## 16. Vibe Coding & AI-Assisted Strategy

To optimize for AI-assisted development (Cursor, Antigravity, etc.), the codebase must maintain:
* **Strong boundaries**: One feature = one folder.
* **Contract-first**: Define schemas before logic.
* **Self-Documentation**: README.md, ARCHITECTURE.md, and API_CONTRACT.md in every service folder.
* **Prompt Centralization**: All LLM instructions stored in `packages/prompts/`.

---

## 17. Suggested Development Sequence

### Phase 1: Foundation (MVP)
* Core monorepo setup, auth system, and base UI.
* Primary disease detection pipeline (Classifier + Routing).
* Basic RAG system and Bangla advisory assistant.

### Phase 2: Intelligence Expansion
* Weather API integration and localized risk alerts.
* Farmer account dashboards and history tracking.
* Voice input/output support for low-literacy users.

### Phase 3: Agentic Ecosystem
* Full LangGraph orchestration of specialized advisory agents.
* Regional outbreak detection and government dashboard.
* Subsidy and marketplace intelligence integration.

### Phase 4: National Scale
* IoT sensor integration, drone/satellite analytics.
* National Agricultural Intelligence Layer (Digital Twin).

---

## 18. Future Expansion Scopes

* **Drone Integration**: Large-scale farm surveys and government monitoring.
* **IoT Integration**: Real-time soil moisture, temperature, and humidity sensors.
* **Yield Prediction**: Historical and weather-based growth modeling.
* **National Intelligence**: A centralized "Agricultural Digital Twin" for Bangladesh.

---

## 19. Operational Context for AI Agents

When an AI coding agent works on this repository, it should:
* search only within the relevant service or feature folder,
* not modify unrelated modules,
* respect schema contracts,
* preserve naming conventions,
* update docs when behavior changes,
* prefer small, reviewable diffs,
* avoid generating duplicate logic.

Agents should always ask:
1. Which domain owns this logic?
2. Which schema defines the contract?
3. Which service should change?
4. Which tests must be updated?
5. Which docs must be synchronized?

---

## 20. Business & Strategic Value

### For the Government
* National crop monitoring and real-time disease outbreak detection.
* Digitization of agricultural extension services.
* Data-driven resource allocation for extension officers.

### For Farmers
* Instant, localized diagnosis leading to reduced crop loss and improved yields.
* Accessible AI guidance via native language support and historical tracking.

### Key Novelty Points
* **Multi-agent Agriculture Intelligence**: Specialized agents for distinct agricultural domains orchestrated via LangGraph.
* **Geospatial Intelligence (GIS)**: Real-time mapping of agricultural health at a national scale.
* **Modular Routing Architecture**: High-accuracy results via specialized crop-specific model routing.

---

## 21. Final Architecture Summary

The platform is a **modular AI agriculture ecosystem** featuring:
* **Presentation**: Next.js public/admin frontends.
* **Backend**: FastAPI microservices for business logic.
* **AI Core**: Specialist crop disease models and RAG knowledge systems.
* **Orchestration**: LangGraph-based multi-agent workflows.
* **Data**: PostgreSQL (Relational), Redis (Cache/Queue), and Qdrant (Vector).
* **Delivery**: Containerized monorepo with automated CI/CD.

This structure allows for incremental builds, efficient AI-assisted development, and government-scale deployment.
